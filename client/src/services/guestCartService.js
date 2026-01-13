const GUEST_CART_KEY = 'guest_cart';

class GuestCartService {
  getCart() {
    try {
      const cart = localStorage.getItem(GUEST_CART_KEY);
      return cart ? JSON.parse(cart) : { items: [] };
    } catch (error) {return { items: [] };
    }
  }

  saveCart(cart) {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (error) {}
  }

  addItem(variantId, quantity = 1, productData = {}) {
    const cart = this.getCart();
    const existingItem = cart.items.find(item => item.variantId === variantId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        variantId,
        quantity,
        productData, 
        addedAt: new Date().toISOString(),
      });
    }

    this.saveCart(cart);
    return cart;
  }

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

  removeItem(variantId) {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.variantId !== variantId);
    this.saveCart(cart);
    return cart;
  }

  clearCart() {
    localStorage.removeItem(GUEST_CART_KEY);
    return { items: [] };
  }

  getItemCount() {
    const cart = this.getCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  async migrateToUserCart(cartService) {
    const guestCart = this.getCart();
    
    if (guestCart.items.length === 0) {
      return;
    }

    try {
      for (const item of guestCart.items) {
        await cartService.addToCart(item.variantId, item.quantity);
      }

      this.clearCart();} catch (error) {throw error;
    }
  }
}

export default new GuestCartService();
