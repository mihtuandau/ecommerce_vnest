


const CART_STORAGE_KEY = 'shopping_cart';
const DEBOUNCE_DELAY = 300;

export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return [];
    
    const parsed = JSON.parse(savedCart);
    const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
    const deduped = items.reduce((acc, item) => {
      const existing = acc.find(i => i.variantId === item.variantId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    
    return deduped;
  } catch {
    return [];
  }
};

const serializeCartItem = (item) => ({
  variantId: item.variantId,
  quantity: item.quantity,
  product: item.product ? {
    id: item.product.id,
    name: item.product.name,
    image: item.product.image,
    variant: item.product.variant ? {
      id: item.product.variant.id,
      price: item.product.variant.price,
      size: item.product.variant.size,
      color: item.product.variant.color,
      stock: item.product.variant.stock,
    } : null
  } : null,
  addedAt: item.addedAt
});

let saveTimeout;
export const saveCartToStorage = (items) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const plainItems = Array.isArray(items) ? items.map(serializeCartItem) : [];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(plainItems));
    } catch (error) {}
  }, DEBOUNCE_DELAY);
};

export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {}
};