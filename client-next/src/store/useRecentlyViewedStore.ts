import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ViewedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
}

interface RecentlyViewedState {
  items: ViewedProduct[];
  addItem: (product: ViewedProduct) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => {
        // Remove duplicate if exists
        const filtered = state.items.filter((item) => item.id !== product.id);
        // Keep only last 10 items
        const newItems = [product, ...filtered].slice(0, 10);
        return { items: newItems };
      }),
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
