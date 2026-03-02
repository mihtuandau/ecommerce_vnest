import { ArrowLeft } from 'lucide-react';

/**
 * Header section của DiscountFormPage:
 * - Nút back
 * - Breadcrumb
 * - Tiêu đề trang
 */
const DiscountFormHeader = ({ isEdit, discountCode, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button
      onClick={onBack}
      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft size={20} />
    </button>

    <div className="flex-1">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-0.5">
        <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>
          Mã giảm giá
        </span>
        <span>/</span>
        <span className="text-gray-700 font-medium">
          {isEdit ? `Chỉnh sửa: ${discountCode ?? '…'}` : 'Tạo mã mới'}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
      </h1>
    </div>
  </div>
);

export default DiscountFormHeader;
