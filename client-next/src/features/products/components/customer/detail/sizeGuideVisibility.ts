import type { Product } from "@/types/models";

const FASHION_KEYWORDS = [
  "ao",
  "quan",
  "dam",
  "vay",
  "giay",
  "dep",
  "sneaker",
  "boot",
  "hoodie",
  "jacket",
  "jeans",
  "shirt",
  "dress",
  "skirt",
  "pants",
  "thoi trang",
  "do the thao",
];

const UNIT_PATTERN =
  /\b\d+([.,]\d+)?\s?(ml|l|g|kg|gram|gam|mg|cm|mm|inch|oz|pack|pcs|vien|chai|hop|tuyp)\b/i;
const ALPHA_SIZE_PATTERN = /^(xxs|xs|s|m|l|xl|xxl|xxxl|free size|freesize|one size)$/i;
const SHOE_SIZE_PATTERN = /^(2[8-9]|3[0-9]|4[0-6])$/;

const normalize = (value?: string | null) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function shouldShowSizeGuide(product: Product, sizes: string[]) {
  if (sizes.length === 0) return false;

  const haystack = normalize(
    [product.name, product.category?.name, product.category?.slug, product.brand?.name]
      .filter(Boolean)
      .join(" ")
  );

  const normalizedSizes = sizes.map((size) => normalize(size.trim()));
  const hasUnitSize = normalizedSizes.some((size) => UNIT_PATTERN.test(size));
  if (hasUnitSize) return false;

  const isFashionProduct = FASHION_KEYWORDS.some((keyword) =>
    haystack.includes(keyword)
  );
  const hasAlphaClothingSize = normalizedSizes.some((size) =>
    ALPHA_SIZE_PATTERN.test(size)
  );
  const hasShoeSize = normalizedSizes.some((size) => SHOE_SIZE_PATTERN.test(size));

  return isFashionProduct && (hasAlphaClothingSize || hasShoeSize);
}
