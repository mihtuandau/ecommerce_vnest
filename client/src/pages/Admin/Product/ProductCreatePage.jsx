import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "antd";
import Loading from "../../../components/common/Loading";
import ProductFormWizard from "../../../components/admin/Product/ProductFormWizard";
import { useProductForm } from "../../../hooks/useProductForm";

const ProductCreatePage = () => {
  const {
    form, isEdit, loading, loadingProduct, productImages, setProductImages,
    removeProductImage, handleProductImageSelect, variants, addVariant,
    removeVariant, updateVariant, handleVariantImageSelect, removeVariantImage,
    categories, brands, handleNameChange, handleSubmit, handleCancel
  } = useProductForm();

  if (loadingProduct) return <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <nav className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
                <Link to="/admin-products" className="hover:text-gray-700 transition-colors">Sản phẩm</Link>
                <span>›</span>
                <span className="text-gray-700 font-medium">{isEdit ? "Chỉnh sửa" : "Thêm mới"}</span>
              </nav>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:text-sm">
              <Eye size={14} /> Đang hiển thị
            </span>
            <Button onClick={handleCancel} className="h-10 rounded-lg border-gray-200 px-4 text-sm font-semibold text-gray-700 shadow-none">Hủy</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
              className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-semibold shadow-sm hover:bg-blue-700"
            >
              {isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
        <ProductFormWizard
          form={form}
          productImages={productImages}
          setProductImages={setProductImages}
          removeProductImage={removeProductImage}
          handleProductImageSelect={handleProductImageSelect}
          variants={variants}
          addVariant={addVariant}
          removeVariant={removeVariant}
          updateVariant={updateVariant}
          handleVariantImageSelect={handleVariantImageSelect}
          removeVariantImage={removeVariantImage}
          categories={categories}
          brands={brands}
          loading={loading}
          submitLabel={isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
          onNameChange={handleNameChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ProductCreatePage;
