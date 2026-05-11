export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
}
