import { ArrowLeft, Save } from 'lucide-react';

/**
 * Top header cho form tạo/chỉnh sửa mã giảm giá.
 */
const DiscountFormHeader = ({ isEdit, isFlashSaleCreate, discountCode, onBack, loading, uploading }) => (
  <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:px-6">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          aria-label="Quay lại"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
            {isEdit
              ? `Chỉnh sửa mã: ${discountCode ?? ''}`
              : (isFlashSaleCreate ? 'Tạo Flash Sale mới' : 'Tạo mã giảm giá mới')}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end lg:self-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="h-10 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {loading ? 'Đang lưu...' : isEdit ? 'Lưu mã' : (isFlashSaleCreate ? 'Tạo Flash Sale' : 'Tạo mã')}
        </button>
      </div>
    </div>
  </div>
);

export default DiscountFormHeader;
