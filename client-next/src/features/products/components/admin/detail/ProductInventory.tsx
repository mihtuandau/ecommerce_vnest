import type { Product } from "@/types/models";

export function ProductInventory({ product }: { product: Product }) {
  const stock =
    product.variants?.reduce((total, variant) => total + (variant.stock || 0), 0) ??
    product.stock ??
    0;

  return <div>{stock}</div>;
}
