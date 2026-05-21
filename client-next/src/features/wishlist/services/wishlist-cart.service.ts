import type { WishlistItem } from "@/store/useWishlistStore";
import type { Product } from "@/types/models";

export function shouldOpenQuickAdd(product: Product) {
  const variants = product.variants || [];
  return variants.length > 1 || variants.some((variant) => variant.size || variant.color);
}

export function mapProductToCartItem(product: Product, fallback: WishlistItem) {
  const variantId = product.variants?.[0]?.id || product.id;

  return {
    productId: String(product.id),
    variantId: String(variantId),
    name: product.name,
    price: Number(product.price || product.basePrice || 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    imageUrl: fallback.imageUrl,
    slug: product.slug,
    quantity: 1,
  };
}

export function mapWishlistItemToCartItem(item: WishlistItem) {
  return {
    productId: String(item.id),
    variantId: String(item.variantId || item.id),
    name: item.name,
    price: Number(item.price),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    imageUrl: item.imageUrl,
    slug: item.slug,
    quantity: 1,
  };
}
