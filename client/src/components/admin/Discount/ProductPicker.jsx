import { useEffect, useMemo, useState } from 'react';
import { Search, X, CheckCheck, SquareMinus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

const ProductPicker = ({
  products,
  loadingProducts,
  search,
  onSearchChange,
  onClearSearch,
  filters,
  onFilterChange,
  categories,
  selectedIds,
  onToggle,
  onClearAll,
  isSubmitting,
  isFlashSale,
}) => {
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [currentPage, products]);

  const allCurrentPageSelected =
    pagedProducts.length > 0 && pagedProducts.every((p) => selectedIds.includes(p.id));

  const selectAllCurrentPage = () => {
    pagedProducts.forEach((p) => {
      if (!selectedIds.includes(p.id)) onToggle(p.id);
    });
  };

  const clearCurrentPage = () => {
    pagedProducts.forEach((p) => {
      if (selectedIds.includes(p.id)) onToggle(p.id);
    });
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900">Phạm vi áp dụng</h2>
        <p className="mt-1.5 text-xs text-gray-500">
          {selectedIds.length === 0
            ? 'Chưa chọn sản phẩm: mã sẽ áp dụng toàn bộ sản phẩm.'
            : `Đã chọn ${selectedIds.length} sản phẩm.`}
        </p>
        {isFlashSale && selectedIds.length === 0 && (
          <p className="mt-1 text-xs text-amber-700">Flash Sale nên chọn sản phẩm cụ thể.</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[170px_1fr] sm:items-center">
          <label className="text-sm font-semibold text-slate-700">Lọc theo danh mục</label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => onFilterChange('categoryId', e.target.value ? Number(e.target.value) : '')}
            className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
            disabled={isSubmitting}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[360px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={onSearchChange}
                placeholder="Tìm theo tên sản phẩm..."
                className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-8 pr-8 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                disabled={isSubmitting}
              />
              {search && !loadingProducts && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-xl border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={selectAllCurrentPage}
                  className="inline-flex h-10 w-10 items-center justify-center border-r border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={isSubmitting || pagedProducts.length === 0 || allCurrentPageSelected}
                  title="Chọn hết sản phẩm trong trang"
                  aria-label="Chọn hết sản phẩm trong trang"
                >
                  <CheckCheck size={16} />
                </button>

                <button
                  type="button"
                  onClick={clearCurrentPage}
                  className="inline-flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={isSubmitting || pagedProducts.length === 0 || !allCurrentPageSelected}
                  title="Bỏ chọn sản phẩm trong trang"
                  aria-label="Bỏ chọn sản phẩm trong trang"
                >
                  <SquareMinus size={16} />
                </button>
              </div>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  disabled={isSubmitting}
                  title="Bỏ chọn tất cả sản phẩm"
                  aria-label="Bỏ chọn tất cả sản phẩm"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-300">
          <div className="grid h-10 grid-cols-[1fr_auto] items-center border-b border-gray-200 bg-gray-50 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>Sản phẩm</span>
            <span>Giá</span>
          </div>

          <div className="max-h-[340px] overflow-y-auto dark-scrollbar">
            {products.length === 0 && !loadingProducts && (
              <div className="px-4 py-8 text-center text-sm text-gray-500">Không có sản phẩm phù hợp</div>
            )}

            {pagedProducts.map((p) => {
              const checked = selectedIds.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex h-11 cursor-pointer items-center justify-between border-b border-gray-200 px-3 last:border-b-0 ${
                    checked ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(p.id)}
                      className="h-4 w-4 accent-blue-600"
                      disabled={isSubmitting}
                    />
                    <span className="truncate text-sm font-medium text-slate-700">{p.name}</span>
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{formatPrice(p.price)}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Trang {currentPage}/{totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 rounded border border-gray-300 px-2 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 rounded border border-gray-300 px-2 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPicker;






