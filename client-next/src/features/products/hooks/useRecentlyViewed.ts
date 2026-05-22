"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks";
import { Product } from "@/types/models";

const RECENTLY_VIEWED_KEY = "minhtuan_recently_viewed";
const MAX_ITEMS = 10;
const EMPTY_RECENTLY_VIEWED: Product[] = [];

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<Product[]>(
    RECENTLY_VIEWED_KEY,
    EMPTY_RECENTLY_VIEWED
  );

  const addProduct = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      // If already at the top, don't update to avoid infinite loops
      if (prev.length > 0 && prev[0].id === product.id) {
        return prev;
      }

      // Remove if already exists elsewhere in the list
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to front
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      return updated;
    });
  }, [setRecentlyViewed]);

  return { recentlyViewed, addProduct };
}
