import { useState, useEffect } from "react";

export const useProductFilters = (currentFilters, priceRange, onFilterChange) => {
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || "",
    brandId: currentFilters.brandId || "",
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || "newest",
    minRating: currentFilters.minRating || "",
    stockStatus: currentFilters.stockStatus || "",
  });

  useEffect(() => {
    setFilters({
      categoryId: currentFilters.categoryId || "",
      brandId: currentFilters.brandId || "",
      minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
      maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
      sortBy: currentFilters.sortBy || "newest",
      minRating: currentFilters.minRating || "",
      stockStatus: currentFilters.stockStatus || "",
    });
  }, [currentFilters, priceRange]);

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (["sortBy", "categoryId", "brandId", "minRating", "stockStatus"].includes(name)) {
      onFilterChange(newFilters);
    }
  };

  const applyPriceFilter = () => {
    const toApply = { ...filters };
    if (filters.maxPrice >= priceRange.maxPrice) toApply.maxPrice = "";
    if (filters.minPrice <= priceRange.minPrice) toApply.minPrice = "";
    onFilterChange(toApply);
  };

  return { 
    filters, 
    setFilters, 
    handleChange, 
    applyPriceFilter,
    handlePriceChange: (name, val) => setFilters(prev => ({ ...prev, [name]: val }))
  };
};
