import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug: string;
  stock: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        const { items } = get();
        if (!items.find((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },
      
      removeFromWishlist: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      
      toggleWishlist: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "minhtuan-wishlist",
    }
  )
);
