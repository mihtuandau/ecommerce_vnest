/**
 * TanStack Query key factory.
 * Provides type-safe, consistent query keys across the app.
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, string>) => ["products", "list", params] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
  },
  cart: {
    all: ["cart"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: Record<string, string>) => ["orders", "list", params] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, any>) => ["users", "list", params] as const,
    me: ["users", "me"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    byProduct: (productId: string) => ["reviews", "product", productId] as const,
  },
  discounts: {
    all: ["discounts"] as const,
    validate: (code: string) => ["discounts", "validate", code] as const,
  },
  banners: {
    all: ["banners"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
} as const;
