import { useNavigate } from 'react-router-dom';
import { Save, RefreshCw } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import useDiscountForm from '../../../hooks/useDiscountForm';
import DiscountFormHeader from '../../../components/admin/Discount/DiscountFormHeader';
import DiscountBasicFields from '../../../components/admin/Discount/DiscountBasicFields';
import ProductPicker from '../../../components/admin/Discount/ProductPicker';

const DiscountFormPage = () => {
  const navigate = useNavigate();
  const {
    isEdit, isFlashSaleCreate, discount, fetchLoading,
    formData, loading, isSubmitting, handleFieldChange, handleSubmit,
    realtimeValidation, realtimeStatus, previewData,
    imagePreview, uploading, handleImageUpload, handleImageRemove,
    productOptions, productSearching, productSearch, productFilters, categories,
    handleFilterChange, handleProductSearchChange,
    handleClearSearch, toggleProduct, clearAllProducts,
    handleGenerateCode,
  } = useDiscountForm();

  const isFlashSaleMode = isFlashSaleCreate || formData.isFlashSale;
  const backPath = isFlashSaleMode ? '/admin-flash-sales' : '/admin-discounts';

  if (isEdit && fetchLoading && !discount) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <DiscountFormHeader
          isEdit={isEdit}
          isFlashSaleCreate={isFlashSaleCreate}
          isFlashSaleMode={isFlashSaleMode}
          discountCode={discount?.code}
          onBack={() => navigate(backPath)}
          loading={loading}
          uploading={uploading}
        />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6 disabled:opacity-60">

            {}
            <DiscountBasicFields
              formData={formData}
              isEdit={isEdit}
              lockFlashSale={isFlashSaleMode}
              onChange={handleFieldChange}
              onGenerateCode={handleGenerateCode}
              realtimeValidation={realtimeValidation}
              realtimeStatus={realtimeStatus}
              previewData={previewData}
              isSubmitting={isSubmitting}
              imagePreview={imagePreview}
              uploading={uploading}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
            />

            {}
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Sản phẩm áp dụng
                  {formData.applicableToProducts?.length > 0 && (
                    <span className="ml-2 text-blue-600 font-bold">({formData.applicableToProducts.length} đã chọn)</span>
                  )}
                </span>
              </div>
              <div className="p-2">
                <ProductPicker
                  products={productOptions}
                  loadingProducts={productSearching}
                  search={productSearch}
                  onSearchChange={handleProductSearchChange}
                  onClearSearch={handleClearSearch}
                  filters={productFilters}
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  selectedIds={formData.applicableToProducts}
                  onToggle={toggleProduct}
                  onClearAll={clearAllProducts}
                  isSubmitting={isSubmitting}
                  isFlashSale={formData.isFlashSale}
                />
              </div>
            </div>

            {}
            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500">Kích hoạt:</span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('isActive', !formData.isActive)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${formData.isActive ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className={`text-xs font-semibold ${formData.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {formData.isActive ? 'Đang bật' : 'Đang tắt'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(backPath)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-md hover:bg-gray-100 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                >
                  {isSubmitting
                    ? <RefreshCw size={14} className="animate-spin" />
                    : <Save size={14} />
                  }
                  {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
      </div>
    </div>
  );
};

export default DiscountFormPage;






