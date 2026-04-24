import { api } from "@/lib/axios";

export const cartApi = {
  syncCart: async (items: { productId: string; quantity: number }[]) => {
    const { data } = await api.post("/cart/sync", { items });
    return data;
  },

  getCart: async () => {
    const { data } = await api.get("/cart");
    return data;
  },
};
