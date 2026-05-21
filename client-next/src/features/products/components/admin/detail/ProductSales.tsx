import type { Product } from "@/types/models";

export function ProductSales({ product }: { product: Product }) {
  return <div>{(product as { soldCount?: number }).soldCount || 0}</div>;
}
