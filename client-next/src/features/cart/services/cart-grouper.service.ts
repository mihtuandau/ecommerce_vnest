import type { CartItem } from "@/features/cart/store/cart.store";

export function groupCartItemsByProduct(items: CartItem[]) {
  return items.reduce<Record<string, CartItem[]>>((groups, item) => {
    const key = item.productId || item.name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}
