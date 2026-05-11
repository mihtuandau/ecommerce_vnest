"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/models";

const RECENTLY_VIEWED_KEY = "minhtuan_recently_viewed";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recently viewed products", e);
      }
    }
  }, []);

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
      // Save to local storage
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recentlyViewed, addProduct };
}
