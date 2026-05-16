import { Product } from "@/types/models";

export interface DiscountWithRelations {
  id: number;
  percentage?: number | null;
  fixedAmount?: number | null;
  maxDiscountAmount?: number | null;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  isFlashSale: boolean;
  code: string;
  applicableToProducts: { 
    productId: number; 
    percentage?: number | null; 
    fixedAmount?: number | null;
    stockLimit: number;
    soldCount: number;
  }[];
  applicableToCategories: { categoryId: number }[];
  products?: any[]; // For flattened flash sale response
}

export function calculateDiscountedPrice(
  product: any,
  discounts: any[],
): number {
  const parsePrice = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^\d.]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  if (!Array.isArray(discounts)) return parsePrice(product.price || product.basePrice);
  
  const now = new Date();
  const basePrice = parsePrice(product.price || product.basePrice);
  
  // Filter active discounts (Flash Sale or auto-applied vouchers)
  const activeDiscounts = discounts.filter(d => 
    d.isActive && 
    new Date(d.startDate) <= now && 
    (!d.endDate || new Date(d.endDate) >= now) &&
    (d.isFlashSale || d.code === "" || !!d.products)
  );

  let bestPrice = basePrice;

  for (const discount of activeDiscounts) {
    // Attempt to find product configuration in this discount
    let productConfig: any = null;

    // A. Check in flattened products (from getFlashSale API)
    if (discount.products) {
      productConfig = discount.products.find((p: any) => 
        String(p.id) === String(product.id) || 
        String(p.productId) === String(product.id)
      );
    }

    // B. Check in raw relations (from getPublicDiscounts API)
    if (!productConfig && discount.applicableToProducts) {
      productConfig = discount.applicableToProducts.find((ap: any) => 
        String(ap.productId) === String(product.id) ||
        String(ap.productId) === String(product.productId)
      );
    }

    const isGlobal = (!discount.applicableToProducts || discount.applicableToProducts.length === 0) && 
                     (!discount.applicableToCategories || discount.applicableToCategories.length === 0);
    
    const isCategoryMatch = product.categoryId && discount.applicableToCategories?.some((ac: any) => ac.categoryId === product.categoryId);

    // If we have a match (Global, Category, or Specific Product)
    if (isGlobal || productConfig || isCategoryMatch) {
      // Check stock limit if it's a specific product config
      const isOutOfStock = productConfig && productConfig.stockLimit > 0 && productConfig.soldCount >= productConfig.stockLimit;
      
      if (!isOutOfStock) {
        let currentDiscountedPrice = basePrice;
        const percentage = productConfig?.percentage ?? discount.percentage;
        const fixedAmount = productConfig?.fixedAmount ?? discount.fixedAmount;

        if (percentage) {
          let reduction = Math.round(basePrice * (percentage / 100));
          if (discount.maxDiscountAmount && reduction > discount.maxDiscountAmount) {
            reduction = discount.maxDiscountAmount;
          }
          currentDiscountedPrice = basePrice - reduction;
        } else if (fixedAmount) {
          currentDiscountedPrice = Math.max(0, basePrice - fixedAmount);
        }

        if (currentDiscountedPrice < bestPrice) {
          bestPrice = currentDiscountedPrice;
        }
      }
    }
  }

  return bestPrice;
}
