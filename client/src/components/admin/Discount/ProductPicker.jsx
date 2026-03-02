import { Package, Search, X } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

// ─── Filter Bar ────────────────────────────────────────────────────────────────
const FilterBar = ({
  search,
  onSearchChange,
  productSearching,
  onClearSearch,
  filters,
  onFilterChange,
  categories,
  onResetFilters,
  totalProducts,
}) => {
  const hasActiveFilters =
    filters.categoryId !== '' || filters.sortBy !== 'sold' || filters.inStock;

  return (
    <div className="px-6 py-3 bg-gray-50/60 border-b border-gray-100 flex flex-wrap items-center gap-3">

      {/* Tìm kiếm */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={onSearchChange}
          placeholder="Tìm theo tên..."
          className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none bg-white"
        />
        {productSearching ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={12} />
            </button>
          )
        )}
      </div>

      {/* Danh mục */}
      <select
        value={filters.categoryId}
        onChange={(e) => onFilterChange('categoryId', e.target.value ? Number(e.target.value) : '')}
        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-orange-300 outline-none text-gray-700 cursor-pointer min-w-[140px]"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Sắp xếp */}
      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-orange-300 outline-none text-gray-700 cursor-pointer"
      >
        <option value="sold">Bán chạy nhất</option>
        <option value="newest">Mới nhất</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
        <option value="name-asc">Tên A → Z</option>
        <option value="rating">Đánh giá cao</option>
      </select>

      {/* Còn hàng */}
      <button
        type="button"
        onClick={() => onFilterChange('inStock', !filters.inStock)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
          filters.inStock
            ? 'bg-green-50 border-green-300 text-green-700 font-medium'
            : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${filters.inStock ? 'bg-green-500' : 'bg-gray-300'}`} />
        Còn hàng
      </button>

      {/* Reset + counter */}
      <div className="ml-auto flex items-center gap-3">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
        <span className="text-xs text-gray-400">{totalProducts} sản phẩm</span>
      </div>
    </div>
  );
};

// ─── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, selected, onToggle }) => (
  <button
    key={product.id}
    type="button"
    onClick={() => onToggle(product.id)}
    className={`relative rounded-xl border-2 overflow-hidden text-left transition-all group ${
      selected
        ? 'border-orange-400 shadow-md shadow-orange-100'
        : 'border-gray-100 hover:border-orange-200 hover:shadow-sm'
    }`}
  >
    {/* Ảnh */}
    <div className="aspect-square overflow-hidden bg-gray-50">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package size={24} className="text-gray-200" />
        </div>
      )}
    </div>

    {/* Thông tin */}
    <div className={`px-2 py-1.5 ${selected ? 'bg-orange-50' : 'bg-white'}`}>
      <p className={`text-[11px] font-medium leading-tight line-clamp-2 ${
        selected ? 'text-orange-800' : 'text-gray-800'
      }`}>
        {product.name}
      </p>
      <p className="text-[11px] text-orange-500 font-semibold mt-0.5">
        {formatPrice(product.price)}
      </p>
    </div>

    {/* Checkmark */}
    <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      selected
        ? 'bg-orange-500 border-orange-500'
        : 'bg-white/80 border-gray-200 opacity-0 group-hover:opacity-100'
    }`}>
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </button>
);

// ─── Selected Sidebar ─────────────────────────────────────────────────────────
const SelectedSidebar = ({ selectedIds, products, onToggle }) => (
  <div className="col-span-1 flex flex-col">
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Đã chọn</p>
    </div>
    <div className="flex-1 overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: 420 }}>
      {selectedIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 py-12 text-gray-200">
          <Package size={28} />
          <p className="text-xs text-center text-gray-300">
            Chưa chọn sản phẩm<br />Click card để thêm
          </p>
        </div>
      ) : (
        selectedIds.map((pid, idx) => {
          const p = products.find((o) => o.id === pid);
          return (
            <div key={pid} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50/40 group">
              <span className="text-[10px] text-gray-300 w-4 flex-shrink-0 font-mono tabular-nums">
                {idx + 1}
              </span>
              {p?.image ? (
                <img
                  src={p.image}
                  alt={p?.name}
                  className="w-8 h-8 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Package size={12} className="text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-700 truncate">{p?.name || `SP #${pid}`}</p>
                {p?.price && (
                  <p className="text-[10px] text-gray-400">{formatPrice(p.price)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onToggle(pid)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);

// ─── ProductPicker (main export) ───────────────────────────────────────────────
/**
 * Card 3 — chọn sản phẩm áp dụng tự động
 *
 * Cho phép chọn sản phẩm cụ thể để discount tự động áp dụng (không cần nhập mã).
 * Hoạt động với cả discount thường lẫn Flash Sale.
 *
 * Props:
 *  products          – array product options
 *  loadingProducts   – boolean
 *  search            – string
 *  onSearchChange    – (event) => void
 *  filters           – { categoryId, sortBy, inStock }
 *  onFilterChange    – (key, value) => void
 *  onResetFilters    – () => void
 *  categories        – array { id, name }
 *  selectedIds       – number[]
 *  onToggle          – (pid) => void
 *  onClearAll        – () => void
 */
const ProductPicker = ({
  products,
  loadingProducts,
  search,
  onSearchChange,
  onClearSearch,
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  selectedIds,
  onToggle,
  onClearAll,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Package size={16} className="text-orange-500" />
        <span className="text-sm font-semibold text-gray-800">Sản phẩm áp dụng tự động</span>
        {selectedIds.length > 0 && (
          <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
            {selectedIds.length} đã chọn
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">
          Để trống = khách hàng phải nhập mã &middot; Chọn sản phẩm = tự động áp dụng (không cần nhập mã)
        </span>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            Bỏ chọn tất cả
          </button>
        )}
      </div>
    </div>

    {/* Filter bar */}
    <FilterBar
      search={search}
      onSearchChange={onSearchChange}
      productSearching={loadingProducts}
      onClearSearch={onClearSearch}
      filters={filters}
      onFilterChange={onFilterChange}
      categories={categories}
      onResetFilters={onResetFilters}
      totalProducts={products.length}
    />

    {/* Body: grid thư viện + sidebar đã chọn */}
    <div className="grid grid-cols-4 divide-x divide-gray-100">

      {/* Product grid — 3 cols */}
      <div className="col-span-3 p-5">
        <div
          className="grid gap-3 overflow-y-auto pr-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            maxHeight: 420,
          }}
        >
          {products.length === 0 && !loadingProducts && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-300">
              <Package size={32} />
              <p className="text-sm mt-2">Không tìm thấy sản phẩm</p>
            </div>
          )}
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              selected={selectedIds.includes(p.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>

      {/* Selected sidebar */}
      <SelectedSidebar
        selectedIds={selectedIds}
        products={products}
        onToggle={onToggle}
      />

    </div>
  </div>
);

export default ProductPicker;
