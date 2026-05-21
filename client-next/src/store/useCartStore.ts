import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  color?: string;
  size?: string;
  selected?: boolean;
}

export type CheckoutDiscount = {
  id?: number;
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  percentage?: number | null;
  fixedAmount?: number | null;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
};

interface CartStore {
  items: CartItem[];
  buyNowItem: CartItem | null;
  isDirty: boolean; // Flag to track if guest items need merging
  appliedDiscount: CheckoutDiscount | null;
  addItem: (item: CartItem, isGuest?: boolean) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  setItems: (items: CartItem[], isFromServer?: boolean) => void;
  setBuyNowItem: (item: CartItem) => void;
  clearBuyNowItem: () => void;
  toggleSelectItem: (variantId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  totalPrice: () => number;
  selectedTotalPrice: () => number;
  selectedCount: () => number;
  setAppliedDiscount: (discount: CheckoutDiscount | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      buyNowItem: null,
      isDirty: false,
      appliedDiscount: null,

      addItem: (item, isGuest = true) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              isDirty: isGuest,
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            isDirty: isGuest,
            items: [...state.items, { ...item, selected: true }],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
          // We don't necessarily set isDirty here as sync is handled by individual API if logged in
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

      clearCart: () => set({ items: [], isDirty: false }),

      clearSelectedItems: () =>
        set((state) => ({
          items: state.items.filter((i) => !i.selected),
          isDirty: false,
        })),

      setItems: (newItems, isFromServer = false) =>
        set((state) => {
          const mergedItems = newItems.map((ni) => {
            const existing = state.items.find((i) => i.variantId === ni.variantId);
            return {
              ...ni,
              selected: existing ? existing.selected : (ni.selected ?? true),
            };
          });

          const uniqueItems = Array.from(
            new Map(mergedItems.map((item) => [item.variantId, item])).values()
          );

          return {
            items: uniqueItems,
            isDirty: isFromServer ? false : state.isDirty,
          };
        }),

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

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
          0
        ),

      selectedTotalPrice: () =>
        get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0),

      selectedCount: () => get().items.filter((i) => i.selected).length,

      setAppliedDiscount: (discount) => set({ appliedDiscount: discount }),
    }),
    {
      name: "minhtuan-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
