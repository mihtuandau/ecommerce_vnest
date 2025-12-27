import { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import Accordion from "../common/Accordion";

const ProductFilter = ({
  categories = [],
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 100000000 },
  onFilterChange,
  currentFilters = {},
  hideCategories = false,
  layout = "vertical", // "vertical" or "horizontal"
}) => {
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || "",
    brandId: currentFilters.brandId || "",
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || "newest",
    minRating: currentFilters.minRating || "",
    stockStatus: currentFilters.stockStatus || "",
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        if (!dropdownRefs.current[openDropdown].contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

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
    if (
      ["sortBy", "categoryId", "brandId", "minRating", "stockStatus"].includes(
        name
      )
    ) {
      onFilterChange(newFilters);
      setOpenDropdown(null); // Close dropdown after selection
    }
  };

  const handlePriceChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    const filtersToApply = { ...filters };
    if (filters.maxPrice >= priceRange.maxPrice) filtersToApply.maxPrice = "";
    if (filters.minPrice <= priceRange.minPrice) filtersToApply.minPrice = "";
    onFilterChange(filtersToApply);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: "",
      brandId: "",
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      sortBy: "newest",
      minRating: "",
      stockStatus: "",
    };
    setFilters(defaultFilters);
    onFilterChange({ ...defaultFilters, minPrice: "", maxPrice: "" });
  };

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "price-desc", label: "Giá: Cao → Thấp" },
    { value: "sold", label: "Bán chạy" },
    { value: "name-asc", label: "Tên: A-Z" },
  ];

  const ratingOptions = [
    { value: "", label: "Tất cả", stars: "" },
    { value: "5", label: "5 sao", stars: "★★★★★" },
    { value: "4", label: "4 sao trở lên", stars: "★★★★" },
    { value: "3", label: "3 sao trở lên", stars: "★★★" },
  ];

  // Horizontal layout
  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-4 flex-wrap pt-5 pb-5 rounded-lg">
        {/* Sort Dropdown */}
        <div className="relative" ref={(el) => (dropdownRefs.current["sort"] = el)}>
          <button
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            className="min-w-[160px] px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#00a85a] flex items-center justify-between gap-3 transition-all"
          >
            <span>{sortOptions.find((opt) => opt.value === filters.sortBy)?.label || "Sắp xếp"}</span>
            <FaChevronDown size={10} className={`transition-transform ${openDropdown === "sort" ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg min-w-[200px] transition-all z-50 ${
            openDropdown === "sort" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}>
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange("sortBy", opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all first:rounded-t-lg last:rounded-b-lg ${
                  filters.sortBy === opt.value
                    ? "bg-green-50 text-[#00a85a] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Dropdown */}
        <div className="relative" ref={(el) => (dropdownRefs.current["price"] = el)}>
          <button
            onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
            className="min-w-[160px] px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#00a85a] flex items-center justify-between gap-3 transition-all"
          >
            <span>Khoảng giá</span>
            <FaChevronDown size={10} className={`transition-transform ${openDropdown === "price" ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-4 min-w-[280px] transition-all z-50 ${
            openDropdown === "price" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}>
            <div className="text-xs font-medium mb-3 flex justify-between text-gray-700">
              <span>{filters.minPrice.toLocaleString("vi-VN")}₫</span>
              <span>{filters.maxPrice.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">
                  Tối thiểu
                </label>
                <input
                  type="range"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  step="10000"
                  value={filters.minPrice}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value <= filters.maxPrice)
                      handlePriceChange("minPrice", value);
                  }}
                  onMouseUp={applyPriceFilter}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a85a]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">
                  Tối đa
                </label>
                <input
                  type="range"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  step="10000"
                  value={filters.maxPrice}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= filters.minPrice)
                      handlePriceChange("maxPrice", value);
                  }}
                  onMouseUp={applyPriceFilter}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a85a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Dropdown */}
        <div className="relative" ref={(el) => (dropdownRefs.current["rating"] = el)}>
          <button
            onClick={() => setOpenDropdown(openDropdown === "rating" ? null : "rating")}
            className="min-w-[160px] px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#00a85a] flex items-center justify-between gap-3 transition-all"
          >
            <span>Đánh giá</span>
            <FaChevronDown size={10} className={`transition-transform ${openDropdown === "rating" ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg min-w-[200px] transition-all z-50 ${
            openDropdown === "rating" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}>
            {ratingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange("minRating", opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                  filters.minRating === opt.value
                    ? "bg-green-50 text-[#00a85a] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.stars && (
                  <span className="text-yellow-500 text-sm">{opt.stars}</span>
                )}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stock Status Dropdown */}
        <div className="relative" ref={(el) => (dropdownRefs.current["stock"] = el)}>
          <button
            onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
            className="min-w-[160px] px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#00a85a] flex items-center justify-between gap-3 transition-all"
          >
            <span>Tình trạng</span>
            <FaChevronDown size={10} className={`transition-transform ${openDropdown === "stock" ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg min-w-[180px] transition-all z-50 ${
            openDropdown === "stock" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}>
            {[
              { value: "", label: "Tất cả" },
              { value: "inStock", label: "Còn hàng" },
              { value: "outOfStock", label: "Hết hàng" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange("stockStatus", opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all first:rounded-t-lg last:rounded-b-lg ${
                  filters.stockStatus === opt.value
                    ? "bg-green-50 text-[#00a85a] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout
  return (
    <div className="space-y-4">
      {/* Sort */}
      <Accordion title="Sắp xếp" defaultOpen={true}>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={filters.sortBy === opt.value}
                onChange={(e) => handleChange("sortBy", e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-sm ${
                  filters.sortBy === opt.value
                    ? "text-[#00a85a] font-medium"
                    : "text-gray-700 font-normal"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* Category */}
      {!hideCategories && categories.length > 0 && (
        <Accordion
          title={`Danh mục (${categories.length})`}
          defaultOpen={true}
        >
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.categoryId === ""}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700 font-normal">
                Tất cả
              </span>
            </label>
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.categoryId == cat.id}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    filters.categoryId == cat.id
                      ? "text-[#00a85a] font-medium"
                      : "text-gray-700 font-normal"
                  }`}
                >
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </Accordion>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <Accordion title="Thương hiệu" defaultOpen={true}>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group">
              <input
                type="radio"
                name="brand"
                value=""
                checked={filters.brandId === ""}
                onChange={(e) => handleChange("brandId", e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700 font-normal">
                Tất cả
              </span>
            </label>
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand.id}
                  checked={filters.brandId == brand.id}
                  onChange={(e) => handleChange("brandId", e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    filters.brandId == brand.id
                      ? "text-[#00a85a] font-medium"
                      : "text-gray-700 font-normal"
                  }`}
                >
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </Accordion>
      )}

      {/* Rating */}
      <Accordion title="Đánh giá" defaultOpen={true}>
        <div className="space-y-1">
          {ratingOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group"
            >
              <input
                type="radio"
                name="rating"
                value={opt.value}
                checked={filters.minRating === opt.value}
                onChange={(e) => handleChange("minRating", e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              {opt.stars ? (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm">{opt.stars}</span>
                  <span
                    className={`text-sm ${
                      filters.minRating === opt.value
                        ? "text-[#00a85a] font-medium"
                        : "text-gray-700 font-normal"
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-700 font-normal">
                  {opt.label}
                </span>
              )}
            </label>
          ))}
        </div>
      </Accordion>

      {/* Stock Status */}
      <Accordion title="Tình trạng" defaultOpen={true}>
        <div className="space-y-1">
          {[
            { value: "", label: "Tất cả" },
            { value: "inStock", label: "Còn hàng" },
            { value: "outOfStock", label: "Hết hàng" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2.5 rounded-lg transition-all duration-200 group"
            >
              <input
                type="radio"
                name="stock"
                value={opt.value}
                checked={filters.stockStatus === opt.value}
                onChange={(e) => handleChange("stockStatus", e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-sm ${
                  filters.stockStatus === opt.value
                    ? "text-[#00a85a] font-medium"
                    : "text-gray-700 font-normal"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* Price Range */}
      <Accordion title="Khoảng giá" defaultOpen={true}>
        <div className="text-sm font-medium mb-4 flex justify-between text-gray-700">
          <span>{filters.minPrice.toLocaleString("vi-VN")}₫</span>
          <span>{filters.maxPrice.toLocaleString("vi-VN")}₫</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-normal text-gray-600 mb-2 block">
              Tối thiểu
            </label>
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="10000"
              value={filters.minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= filters.maxPrice)
                  handlePriceChange("minPrice", value);
              }}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a85a] transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-xs font-normal text-gray-600 mb-2 block">
              Tối đa
            </label>
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="10000"
              value={filters.maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= filters.minPrice)
                  handlePriceChange("maxPrice", value);
              }}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a85a] transition-all duration-300"
            />
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default ProductFilter;