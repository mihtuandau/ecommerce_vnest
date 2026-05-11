import { use } from "react";
import { ProductDetailView } from "@/features/products/components/customer/detail/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  return <ProductDetailView slug={slug} />;
}
