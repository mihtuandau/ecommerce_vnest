export const SHOP_PRICE_RANGES = [
  { label: "Dưới 500K", min: "0", max: "500000" },
  { label: "500K — 2 triệu", min: "500000", max: "2000000" },
  { label: "2 — 5 triệu", min: "2000000", max: "5000000" },
  { label: "Trên 5 triệu", min: "5000000", max: "999999999" }
] as const;

export const SHOP_SORT_OPTIONS = [
  { label: "Phổ biến nhất", value: "sold" },
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp → Cao", value: "price-asc" },
  { label: "Giá: Cao → Thấp", value: "price-desc" },
  { label: "Đánh giá cao", value: "rating" },
] as const;
