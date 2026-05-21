import { calculateDiscountedPrice } from "@/features/discounts/utils/discount";
import type { Product, ProductVariant } from "@/types/models";

export function findSelectedProductVariant(
  product: Product | null | undefined,
  selectedSize: string | null,
  selectedColor: string | null
) {
  if (!product?.variants) return null;

  return (
    product.variants.find(
      (variant: ProductVariant) =>
        (!selectedSize || variant.size === selectedSize) &&
        (!selectedColor || variant.color === selectedColor)
    ) || null
  );
}

export function getProductDetailImageUrl(image: any) {
  return typeof image === "string" ? image : image?.url || "";
}

export function getProductGalleryImages(
  product: Product | null | undefined,
  selectedVariant: ProductVariant | null
) {
  if (!product) return [];

  const mainImages = product.images || [];
  const variantImages: any[] = [];

  product.variants?.forEach((variant: any) => {
    variant.images?.forEach((image: any) => {
      const url = getProductDetailImageUrl(image);
      const existsInVariants = variantImages.some(
        (variantImage) => getProductDetailImageUrl(variantImage) === url
      );
      const existsInMain = mainImages.some(
        (mainImage: any) => getProductDetailImageUrl(mainImage) === url
      );

      if (!existsInVariants && !existsInMain) {
        variantImages.push(image);
      }
    });
  });

  let combined = [...mainImages, ...variantImages];

  if (selectedVariant?.images && selectedVariant.images.length > 0) {
    const variantUrls = selectedVariant.images.map(getProductDetailImageUrl);
    const otherImages = combined.filter(
      (image) => !variantUrls.includes(getProductDetailImageUrl(image))
    );
    combined = [...selectedVariant.images, ...otherImages];
  }

  return combined.map((image) => ({ url: getProductDetailImageUrl(image) }));
}

export function findActiveFlashSaleSession(flashSale: any, productId?: string | number) {
  const sessions = Array.isArray(flashSale) ? flashSale : [];
  const now = new Date();

  return sessions.find(
    (session) =>
      new Date(session.startDate) <= now &&
      (!session.endDate || new Date(session.endDate) >= now) &&
      session.products?.some(
        (product: any) =>
          String(product.id) === String(productId) ||
          String(product.productId) === String(productId)
      )
  );
}

export function getProductPricing(
  product: Product,
  selectedVariant: ProductVariant | null,
  discounts: any[]
) {
  const currentBasePrice =
    selectedVariant?.price || (product as any).price || product.basePrice || 0;
  const finalPrice = calculateDiscountedPrice(
    { ...product, price: currentBasePrice },
    discounts
  );
  const isFlashSale = finalPrice < currentBasePrice;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;

  return {
    currentBasePrice,
    finalPrice,
    finalOriginalPrice: isFlashSale ? currentBasePrice : originalPrice,
    isFlashSale,
    flashSalePercent: isFlashSale
      ? Math.round(((currentBasePrice - finalPrice) / currentBasePrice) * 100)
      : 0,
  };
}

export function getCurrentProductStock(
  product: Product,
  selectedVariant: ProductVariant | null
) {
  return selectedVariant?.stock ?? (product as any).stock;
}
