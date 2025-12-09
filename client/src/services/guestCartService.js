/**
 * Guest Cart Service - Manage cart in localStorage for non-authenticated users
 */

const GUEST_CART_KEY = 'guest_cart';

class GuestCartService {
  /**
   * Get guest cart from localStorage
   */
  getCart() {
    try {
      const cart = localStorage.getItem(GUEST_CART_KEY);
      return cart ? JSON.parse(cart) : { items: [] };
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return { items: [] };
    }
  }

  /**
   * Save cart to localStorage
   */
  saveCart(cart) {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  /**
   * Add item to guest cart
   */
  addItem(variantId, quantity = 1, productData = {}) {
    const cart = this.getCart();
    const existingItem = cart.items.find(item => item.variantId === variantId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        variantId,
        quantity,
        productData, // Store product info for display
        addedAt: new Date().toISOString(),
      });
    }

    this.saveCart(cart);
    return cart;
  }

  /**
   * Update item quantity
   */
  updateQuantity(variantId, quantity) {
    const cart = this.getCart();
    const item = cart.items.find(item => item.variantId === variantId);

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.variantId !== variantId);
      } else {
        item.quantity = quantity;
      }
    }

    this.saveCart(cart);
    return cart;
  }

  /**
   * Remove item from cart
   */
  removeItem(variantId) {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.variantId !== variantId);
    this.saveCart(cart);
    return cart;
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    localStorage.removeItem(GUEST_CART_KEY);
    return { items: [] };
  }

  /**
   * Get cart item count
   */
  getItemCount() {
    const cart = this.getCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Migrate guest cart to user cart after login
   */
  async migrateToUserCart(cartService) {
    const guestCart = this.getCart();
    
    if (guestCart.items.length === 0) {
      return;
    }

    try {
      // Add each guest cart item to user's cart
      for (const item of guestCart.items) {
        await cartService.addToCart(item.variantId, item.quantity);
      }

      // Clear guest cart after migration
      this.clearCart();
      console.log('✅ Guest cart migrated to user cart');
    } catch (error) {
      console.error('❌ Error migrating guest cart:', error);
      throw error;
    }
  }
}

export default new GuestCartService();
