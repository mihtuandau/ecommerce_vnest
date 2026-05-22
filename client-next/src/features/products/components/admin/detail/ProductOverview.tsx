import type { Product } from "@/types/models";

export function ProductOverview({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}
