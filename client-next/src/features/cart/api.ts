import { api } from "@/lib/axios";

export const cartApi = {
  syncCart: async (items: { variantId: number; quantity: number }[]) => {
    const { data } = await api.post("/cart/sync", { items });
    return data;
  },

  getCart: async () => {
    const { data } = await api.get("/cart");
    return data;
  },

  addItem: async (variantId: number, quantity: number) => {
    const { data } = await api.post("/cart/items", { variantId, quantity });
    return data;
  },

  updateQuantity: async (variantId: number, quantity: number) => {
    const { data } = await api.put(`/cart/items/${variantId}`, { quantity });
    return data;
  },

  removeItem: async (variantId: number) => {
    const { data } = await api.delete(`/cart/items/${variantId}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete("/cart");
    return data;
  },
};
