export interface CustomCollection {
  name: string;
  icon: string;
}

export type WishlistViewMode = "grid" | "list";

export type WishlistSortBy = "recent" | "price-asc" | "price-desc" | "discount";

export type WishlistItemCollections = Record<string, string>;
