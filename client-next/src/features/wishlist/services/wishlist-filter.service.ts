import type { WishlistItem } from "@/features/wishlist/store/wishlist.store";
import type { WishlistItemCollections, WishlistSortBy } from "@/features/wishlist/types";

export function getDiscountedWishlistItems(items: WishlistItem[]) {
  return items.filter((item) => item.originalPrice && item.originalPrice > item.price);
}

export function getFilteredWishlistItems({
  items,
  discountFilter,
  currentCollection,
  sortBy,
  itemCollections,
}: {
  items: WishlistItem[];
  discountFilter: boolean;
  currentCollection: string;
  sortBy: WishlistSortBy;
  itemCollections: WishlistItemCollections;
}) {
  let list = [...items];

  if (discountFilter) {
    list = getDiscountedWishlistItems(list);
  } else if (currentCollection !== "all") {
    list = list.filter((item) => itemCollections[item.id] === currentCollection);
  }

  if (sortBy === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === "discount") {
    list.sort((a, b) => {
      const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discountB - discountA;
    });
  }

  return list;
}
