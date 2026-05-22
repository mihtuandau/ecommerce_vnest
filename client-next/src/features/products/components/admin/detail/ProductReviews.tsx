import type { Product } from "@/types/models";

export function ProductReviews({ product }: { product: Product }) {
  return <div>{(product as { reviewCount?: number }).reviewCount || 0}</div>;
}
