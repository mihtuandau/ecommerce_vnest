import type { CartItem } from "@/store/useCartStore";

type ServerCartItem = {
  variantId: number;
  quantity: number;
  discountedPrice?: number;
  variant: {
    productId: string;
    price: number;
    originalPrice?: number | null;
    color?: string;
    size?: string;
    images?: { url: string }[];
    product: {
      name: string;
      slug: string;
      originalPrice?: number | null;
      images?: { url: string }[];
    };
  };
};

type ServerCartResponse = {
  cartItems?: ServerCartItem[];
};

export function mapServerCartItemToCartItem(item: ServerCartItem): CartItem {
  return {
    productId: item.variant.productId,
    variantId: String(item.variantId),
    name: item.variant.product.name,
    price: Number(item.variant.price),
    discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : undefined,
    originalPrice:
      item.variant.originalPrice || item.variant.product.originalPrice
        ? Number(item.variant.originalPrice || item.variant.product.originalPrice)
        : undefined,
    quantity: item.quantity,
    imageUrl: item.variant.images?.[0]?.url || item.variant.product.images?.[0]?.url || "",
    slug: item.variant.product.slug,
    color: item.variant.color,
    size: item.variant.size,
    selected: true,
  };
}

export function mapServerCartToCartItems(response: ServerCartResponse): CartItem[] {
  return (response.cartItems || []).map(mapServerCartItemToCartItem);
}
