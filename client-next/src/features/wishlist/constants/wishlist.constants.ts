import type { CustomCollection } from "@/features/wishlist/types";

export const WISHLIST_COLLECTIONS_STORAGE_KEY = "luxe-wishlist-collections-v2";
export const WISHLIST_ASSIGNMENTS_STORAGE_KEY = "luxe-wishlist-assignments-v2";

export const DEFAULT_WISHLIST_COLLECTIONS: CustomCollection[] = [
  { name: "Thời trang", icon: "Shirt" },
  { name: "Giày & Túi", icon: "ShoppingBag" },
  { name: "Mỹ phẩm", icon: "Sparkles" },
];
