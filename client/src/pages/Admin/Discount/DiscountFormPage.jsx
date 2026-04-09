import { useNavigate } from 'react-router-dom';
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
    uploading,
    productOptions, productSearching, productSearch, productFilters, categories,
    handleFilterChange, handleProductSearchChange,
    handleClearSearch, toggleProduct, clearAllProducts,
    handleGenerateCode,
  } = useDiscountForm();

  if (isEdit && fetchLoading && !discount) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1500px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DiscountFormHeader
            isEdit={isEdit}
            isFlashSaleCreate={isFlashSaleCreate}
            discountCode={discount?.code}
            onBack={() => navigate(isFlashSaleCreate ? '/admin-flash-sales' : '/admin-discounts')}
            loading={loading}
            uploading={uploading}
          />

          <fieldset disabled={isSubmitting} className="w-full disabled:pointer-events-none disabled:opacity-80">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-7">
                <DiscountBasicFields
                  formData={formData}
                  isEdit={isEdit}
                  lockFlashSale={isFlashSaleCreate}
                  flashSaleMode={isFlashSaleCreate ? 'flash' : 'regular'}
                  onChange={handleFieldChange}
                  onGenerateCode={handleGenerateCode}
                  realtimeValidation={realtimeValidation}
                  realtimeStatus={realtimeStatus}
                  previewData={previewData}
                  isSubmitting={isSubmitting}
                />
              </div>

              <aside className="space-y-6 xl:col-span-5 xl:sticky xl:top-6 self-start">
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

                <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('isActive', !formData.isActive)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 sm:text-base">Trạng thái mã giảm giá</p>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">Mã tắt sẽ không hiển thị cho khách hàng</p>
                    </div>
                    <span
                      className={`relative h-8 w-14 rounded-full transition-colors ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                          formData.isActive ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </span>
                  </button>
                </section>
              </aside>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default DiscountFormPage;
