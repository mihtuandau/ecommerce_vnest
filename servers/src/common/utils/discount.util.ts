import { Discount, Product, ProductVariant } from '@prisma/client';

export interface DiscountWithRelations extends Discount {
  applicableToProducts: { productId: number }[];
  applicableToCategories: { categoryId: number }[];
}

export function calculateDiscountedPrice(
  variant: ProductVariant & { product: { categoryId: number | null } },
  discounts: DiscountWithRelations[],
): number {
  const now = new Date();
  
  // Lọc các discount đang hoạt động và là Flash Sale (hoặc code trống - áp dụng tự động)
  const activeDiscounts = discounts.filter(d => 
    d.isActive && 
    d.startDate <= now && 
    (!d.endDate || d.endDate >= now) &&
    (d.isFlashSale || d.code === "")
  );

  let bestPrice = variant.price;

  for (const discount of activeDiscounts) {
    // Kiểm tra xem discount có áp dụng cho sản phẩm hoặc danh mục này không
    const isGlobal = discount.applicableToProducts.length === 0 && discount.applicableToCategories.length === 0;
    const isProductMatch = discount.applicableToProducts.some(ap => ap.productId === variant.productId);
    const isCategoryMatch = variant.product.categoryId && discount.applicableToCategories.some(ac => ac.categoryId === variant.product.categoryId);

    if (isGlobal || isProductMatch || isCategoryMatch) {
      let currentDiscountedPrice = variant.price;
      
      if (discount.percentage) {
        currentDiscountedPrice = Math.round(variant.price * (1 - discount.percentage / 100));
      } else if (discount.fixedAmount) {
        currentDiscountedPrice = Math.max(0, variant.price - discount.fixedAmount);
      }

      if (currentDiscountedPrice < bestPrice) {
        bestPrice = currentDiscountedPrice;
      }
    }
  }

  return bestPrice;
}
