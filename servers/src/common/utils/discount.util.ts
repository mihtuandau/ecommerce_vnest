import { Discount, Product, ProductVariant } from '@prisma/client';

export interface DiscountWithRelations extends Discount {
  applicableToProducts: { 
    productId: number; 
    percentage?: number | null; 
    fixedAmount?: number | null;
    stockLimit: number;
    soldCount: number;
  }[];
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
    
    // Tìm cấu hình riêng cho sản phẩm này trong discount
    // Hỗ trợ cả ProductVariant (có productId) và Product (có id)
    const targetProductId = variant.productId || (variant as any).id;
    const productConfig = discount.applicableToProducts.find(ap => ap.productId === targetProductId);
    
    // Nếu có cấu hình sản phẩm, kiểm tra xem còn suất không
    const isOutOfStock = productConfig && productConfig.stockLimit > 0 && productConfig.soldCount >= productConfig.stockLimit;
    
    const isCategoryMatch = variant.product.categoryId && discount.applicableToCategories.some(ac => ac.categoryId === variant.product.categoryId);

    if ((isGlobal || productConfig || isCategoryMatch) && !isOutOfStock) {
      let currentDiscountedPrice = variant.price;
      
      // Ưu tiên: % của sản phẩm -> % của session -> fixedAmount của sản phẩm -> fixedAmount của session
      const percentage = productConfig?.percentage ?? discount.percentage;
      const fixedAmount = productConfig?.fixedAmount ?? discount.fixedAmount;

      if (percentage) {
        let reduction = Math.round(variant.price * (percentage / 100));
        
        // Apply max discount cap if defined
        if (discount.maxDiscountAmount && reduction > discount.maxDiscountAmount) {
          reduction = discount.maxDiscountAmount;
        }
        
        currentDiscountedPrice = variant.price - reduction;
      } else if (fixedAmount) {
        // fixedAmount is the reduction amount
        currentDiscountedPrice = Math.max(0, variant.price - fixedAmount);
      }

      if (currentDiscountedPrice < bestPrice) {
        bestPrice = currentDiscountedPrice;
      }
    }
  }

  return bestPrice;
}
