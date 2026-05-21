/**
 * Products Module Constants
 */

export const PRODUCTS_CONSTANTS = {
  // Grid Pagination
  GRID_LIMIT: 9, // Items per page in grid view

  // Related Products
  RELATED_LIMIT: 4, // Related products to show

  // Product Details
  MAX_IMAGES: 10,
  MIN_RATING: 0,
  MAX_RATING: 5,

  // Autocomplete
  AUTOCOMPLETE_LIMIT: 40,

  // Product Selector
  SELECTOR_LIMIT: 50,

  // Orders
  ORDERS_PRODUCT_LIMIT: 1000,

  // Reviews
  REVIEWS_LIMIT: 100,
} as const;

export const PRODUCTS_MESSAGES = {
  // No Results
  NO_PRODUCTS: "Không tìm thấy sản phẩm nào",
  NO_RESULTS: "Không có kết quả tìm kiếm",
  EMPTY_CATEGORY: "Danh mục này chưa có sản phẩm",

  // Filtering
  FILTER_BY_PRICE: "Lọc theo giá",
  FILTER_BY_RATING: "Lọc theo đánh giá",
  FILTER_BY_CATEGORY: "Lọc theo danh mục",
  FILTER_BY_BRAND: "Lọc theo thương hiệu",

  // Sorting
  SORT_BY_NEWEST: "Mới nhất",
  SORT_BY_POPULAR: "Phổ biến nhất",
  SORT_BY_PRICE_LOW: "Giá thấp nhất",
  SORT_BY_PRICE_HIGH: "Giá cao nhất",
  SORT_BY_RATING: "Đánh giá cao nhất",
  SORT_BY_SALES: "Bán chạy nhất",

  // Product Info
  RELATED_PRODUCTS: "Sản phẩm liên quan",
  YOU_MAY_LIKE: "Bạn có thể thích",
  OUT_OF_STOCK: "Hết hàng",
  IN_STOCK: "Còn hàng",
  LAST_ITEMS: "Chỉ còn {{count}} sản phẩm",

  // Actions
  ADD_TO_CART: "Thêm vào giỏ",
  VIEW_DETAILS: "Xem chi tiết",
  ADD_TO_WISHLIST: "Thêm vào danh sách yêu thích",
  COMPARE: "So sánh",

  // Loading
  LOADING: "Đang tải...",
  ERROR_LOADING: "Lỗi khi tải sản phẩm",
  RETRY: "Thử lại",
} as const;

export const PRODUCTS_SORT_OPTIONS = {
  NEWEST: "newest",
  POPULAR: "popular",
  PRICE_LOW: "price_asc",
  PRICE_HIGH: "price_desc",
  RATING: "rating",
  SALES: "sales",
} as const;

export const PRODUCTS_VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
} as const;

export const PRODUCT_CARD_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

export const PRODUCT_IMAGE_ASPECT_RATIOS = {
  SQUARE: "1/1",
  LANDSCAPE: "16/9",
  PORTRAIT: "3/4",
} as const;

export const SHOP_PRICE_RANGES = [
  { label: "Dưới 500K", min: "0", max: "500000" },
  { label: "500K — 2 triệu", min: "500000", max: "2000000" },
  { label: "2 — 5 triệu", min: "2000000", max: "5000000" },
  { label: "Trên 5 triệu", min: "5000000", max: "999999999" },
] as const;

export const SHOP_SORT_OPTIONS = [
  { label: "Phổ biến nhất", value: "sold" },
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp → Cao", value: "price-asc" },
  { label: "Giá: Cao → Thấp", value: "price-desc" },
  { label: "Đánh giá cao", value: "rating" },
] as const;
