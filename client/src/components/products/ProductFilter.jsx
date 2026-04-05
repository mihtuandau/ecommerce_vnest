import { useState, useEffect, useRef } from "react";
import { Select, Space, Button, Popover, Slider, InputNumber } from "antd";
import { StarFilled, SyncOutlined, DollarOutlined } from "@ant-design/icons";
import Accordion from "../common/Accordion";

const { Option } = Select;

const ProductFilter = ({
  categories = [],
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 100000000 },
  onFilterChange,
  currentFilters = {},
  hideCategories = false,
  layout = "vertical", 
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
      setOpenDropdown(null);
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
    { value: "5", label: "5 sao", stars: "⭐⭐⭐⭐⭐" },
    { value: "4", label: "4 sao trở lên", stars: "⭐⭐⭐⭐" },
    { value: "3", label: "3 sao trở lên", stars: "⭐⭐⭐" },
  ];

  // Horizontal layout
  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-4 text ">
        {/* Filter label */}
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-sm uppercase">Bộ lọc</span>
        </div>

        {/* Category filter */}
        {!hideCategories && categories.length > 0 && (
          <Select
            placeholder="Danh mục"
            style={{ width: 180, borderRadius: 0 }}
            value={filters.categoryId ? String(filters.categoryId) : undefined}
            onChange={(value) => handleChange("categoryId", value || "")}
            allowClear
            popupClassName="no-border-radius"
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </Option>
            ))}
          </Select>
        )}

        {/* Brand filter */}
        {brands.length > 0 && (
          <Select
            placeholder="Thương hiệu"
            style={{ width: 180, borderRadius: 0 }}
            value={filters.brandId ? String(filters.brandId) : undefined}
            onChange={(value) => handleChange("brandId", value || "")}
            allowClear
            popupClassName="no-border-radius"
          >
            {brands.map((brand) => (
              <Option key={brand.id} value={String(brand.id)}>
                {brand.name}
              </Option>
            ))}
          </Select>
        )}

        {/* Price filter */}
        <Select
          placeholder="Giá sản phẩm"
          style={{ width: 180, borderRadius: 0 }}
          popupClassName="no-border-radius"
          value={filters.minPrice !== priceRange.minPrice || filters.maxPrice !== priceRange.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : undefined}
          onChange={(value) => {
            if (!value) {
              handleChange('minPrice', priceRange.minPrice);
              handleChange('maxPrice', priceRange.maxPrice);
              onFilterChange({ ...filters, minPrice: priceRange.minPrice, maxPrice: priceRange.maxPrice });
            } else {
              const [min, max] = value.split('-').map(Number);
              const newFilters = { ...filters, minPrice: min, maxPrice: max };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }
          }}
          allowClear
        >
          <Option value="0-500000">Dưới 500,000₫</Option>
          <Option value="500000-1000000">500,000₫ - 1,000,000₫</Option>
          <Option value="1000000-2000000">1,000,000₫ - 2,000,000₫</Option>
          <Option value="2000000-5000000">2,000,000₫ - 5,000,000₫</Option>
          <Option value="5000000-999999999">Trên 5,000,000₫</Option>
        </Select>

        {/* Rating filter */}
        <Select
          placeholder="Đánh giá"
          style={{ width: 150, borderRadius: 0 }}
          value={filters.minRating || undefined}
          onChange={(value) => handleChange("minRating", value || "")}
          allowClear
          popupClassName="no-border-radius"
        >
          {ratingOptions.filter(opt => opt.value !== "").map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.stars} {opt.label}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Tình trạng"
          style={{ width: 150, borderRadius: 0 }}
          value={filters.stockStatus || undefined}
          onChange={(value) => handleChange("stockStatus", value || "")}
          allowClear
          popupClassName="no-border-radius"
        >
          <Option value="inStock">Còn hàng</Option>
          <Option value="outOfStock">Hết hàng</Option>
        </Select>

        <div className="ml-auto">
          <Select
            value={filters.sortBy}
            onChange={(value) => handleChange("sortBy", value)}
            style={{ width: 200, borderRadius: 0 }}
            popupClassName="no-border-radius"
          >
            {sortOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }

  const stockOptions = [
    { value: "", label: "Tất cả" },
    { value: "inStock", label: "Còn hàng" },
    { value: "outOfStock", label: "Hết hàng" },
  ];

  return (
    <div className="space-y-4">
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
                key={cat.name}
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