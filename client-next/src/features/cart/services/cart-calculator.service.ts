import type { CartItem } from "@/features/cart/store/cart.store";

export function getSelectedCartItems(items: CartItem[]) {
  return items.filter((item) => item.selected);
}

export function calculateCartTotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );
}

export function calculateSelectedCartTotal(items: CartItem[]) {
  return calculateCartTotal(getSelectedCartItems(items));
}

export function calculateCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function areAllCartItemsSelected(items: CartItem[]) {
  return items.length > 0 && items.every((item) => item.selected);
}
