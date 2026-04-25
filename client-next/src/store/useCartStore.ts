import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  color?: string;
  size?: string;
  selected?: boolean;
}

interface CartStore {
  items: CartItem[];
  buyNowItem: CartItem | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setBuyNowItem: (item: CartItem) => void;
  clearBuyNowItem: () => void;
  toggleSelectItem: (variantId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  totalPrice: () => number;
  selectedTotalPrice: () => number;
  selectedCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      buyNowItem: null,
      
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, selected: true }] };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      
      setItems: (items) => set({ items: items.map(item => ({ ...item, selected: item.selected ?? true })) }),

      setBuyNowItem: (item) => set({ buyNowItem: item }),
      
      clearBuyNowItem: () => set({ buyNowItem: null }),

      toggleSelectItem: (variantId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, selected: !item.selected } : item
          ),
        })),

      toggleSelectAll: (selected) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        })),
      
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      selectedTotalPrice: () =>
        get().items
          .filter((i) => i.selected)
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      selectedCount: () => get().items.filter((i) => i.selected).length,
    }),
    {
      name: "vnest-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
