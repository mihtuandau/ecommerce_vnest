import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import useDiscountForm from '../../../hooks/useDiscountForm';
import DiscountFormHeader from '../../../components/admin/Discount/DiscountFormHeader';
import DiscountBasicFields from '../../../components/admin/Discount/DiscountBasicFields';
import FlashSaleToggle from '../../../components/admin/Discount/FlashSaleToggle';
import ProductPicker from '../../../components/admin/Discount/ProductPicker';

const DiscountFormPage = () => {
  const navigate = useNavigate();
  const {
    isEdit, discount, fetchLoading,
    formData, loading, handleFieldChange, handleSubmit,
    imagePreview, uploading, handleImageUpload, handleImageRemove,
    productOptions, productSearching, productSearch, productFilters, categories,
    handleFlashSaleToggle, handleFilterChange, handleProductSearchChange,
    handleClearSearch, handleResetFilters, toggleProduct, clearAllProducts,
  } = useDiscountForm();

  if (isEdit && fetchLoading && !discount) {
    return <Loading fullScreen text="Đang tải..." variant="admin" />;
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full">
      <DiscountFormHeader
        isEdit={isEdit}
        discountCode={discount?.code}
        onBack={() => navigate('/admin-discounts')}
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <DiscountBasicFields
          formData={formData}
          isEdit={isEdit}
          imagePreview={imagePreview}
          uploading={uploading}
          onChange={handleFieldChange}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />

        <FlashSaleToggle
          isFlashSale={formData.isFlashSale}
          onToggle={handleFlashSaleToggle}
        />

        <ProductPicker
          products={productOptions}
          loadingProducts={productSearching}
          search={productSearch}
          onSearchChange={handleProductSearchChange}
          onClearSearch={handleClearSearch}
          filters={productFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          categories={categories}
          selectedIds={formData.applicableToProducts}
          onToggle={toggleProduct}
          onClearAll={clearAllProducts}
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-4 flex items-center justify-end gap-3">
          <Button
            type="button" variant="secondary"
            onClick={() => navigate('/admin-discounts')}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading || uploading} className="min-w-[140px]">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} />
                {isEdit ? 'Lưu thay đổi' : 'Tạo mã mới'}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiscountFormPage;
