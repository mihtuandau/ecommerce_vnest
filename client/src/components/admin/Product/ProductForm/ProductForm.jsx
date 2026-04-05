import { Form } from 'antd';
import BasicInfoSection from './BasicInfoSection';
import VariantsSection from './VariantsSection';
import ImagesSection from './ImagesSection';
import CategoriesSection from './CategoriesSection';
import FormFooter from './FormFooter';

/**
 * ProductForm - Unified form component for creating and editing products
 * 
 * Refactored from ProductFormUnified.jsx (767 lines → modular components)
 * Each section is now a separate, reusable component
 */
const ProductForm = ({
  form,
  productImages,
  setProductImages,
  removeProductImage,
  updateProductImage,
  handleProductImageSelect,
  variants,
  addVariant,
  addVariantsBulk,
  removeVariant,
  updateVariant,
  handleVariantImageSelect,
  removeVariantImage,
  updateVariantImage,
  clearVariantImages,
  setColorImageSource,
  categories = [],
  brands = [],
  loading = false,
  isEdit = false,
  submitLabel = 'Lưu sản phẩm',
  onCancel,
  onNameChange,
  onSubmit,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ isActive: true }}
      className="block"
    >
      <div className="bg-[#F7F8FA] rounded-t-2xl py-4 lg:py-6 px-3 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoSection onNameChange={onNameChange} />
            <VariantsSection
              variants={variants}
              addVariant={addVariant}
              addVariantsBulk={addVariantsBulk}
              removeVariant={removeVariant}
              updateVariant={updateVariant}
              handleVariantImageSelect={handleVariantImageSelect}
              removeVariantImage={removeVariantImage}
              updateVariantImage={updateVariantImage}
              clearVariantImages={clearVariantImages}
              loading={loading}
            />
          </div>

          <div className="space-y-6">
            <ImagesSection
              productImages={productImages}
              setProductImages={setProductImages}
              removeProductImage={removeProductImage}
              updateProductImage={updateProductImage}
              handleProductImageSelect={handleProductImageSelect}
            />
            <CategoriesSection categories={categories} brands={brands} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#F7F8FA] rounded-b-2xl border-t border-[#E6E8EC] px-3 lg:px-6 py-4">
        <FormFooter
          isEdit={isEdit}
          submitLabel={submitLabel}
          loading={loading}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </Form>
  );
};

export default ProductForm;
