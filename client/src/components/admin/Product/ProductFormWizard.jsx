import { useState } from 'react';
import { Form, Button } from 'antd';
import { Save, ImageIcon, Layers, Globe, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import StepBasicInfo from './wizard-steps/StepBasicInfo';
import StepProductImages from './wizard-steps/StepProductImages';
import StepProductVariants from './wizard-steps/StepProductVariants';
import StepProductSEO from './wizard-steps/StepProductSEO';

const ProductFormWizard = ({
  form, productImages = [], setProductImages, removeProductImage, updateProductImage, handleProductImageSelect,
  variants = [], addVariant, removeVariant, updateVariant, handleVariantImageSelect, removeVariantImage, updateVariantImage,
  categories = [], brands = [], loading = false, submitLabel = 'Lưu sản phẩm', onNameChange, onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const watchedName = Form.useWatch('name', form);
  const watchedSlug = Form.useWatch('slug', form);
  const watchedMetaTitle = Form.useWatch('metaTitle', form);
  const watchedMetaDesc = Form.useWatch('metaDesc', form);

  const steps = [
    { id: 'basic', icon: Info, title: 'Thông tin cơ bản', desc: 'Tên, mô tả, giá, danh mục' },
    { id: 'images', icon: ImageIcon, title: 'Hình ảnh', desc: 'Ảnh sản phẩm và gallery' },
    { id: 'variants', icon: Layers, title: 'Biến thể', desc: 'Size, màu sắc, tồn kho' },
    { id: 'seo', icon: Globe, title: 'SEO & Meta', desc: 'Tối ưu tìm kiếm' },
  ];

  const totalStock = variants.length > 0 ? variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0) : Number(form.getFieldValue('stock')) || 0;
  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={{ isActive: true }} className="flex min-h-[620px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Sidebar - Desktop */}
      <div className="hidden w-[240px] shrink-0 border-r border-gray-200 bg-gray-50 p-4 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">CÁC BƯỚC</div>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <button key={step.id} type="button" onClick={() => setCurrentStep(idx)} className={`relative flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${currentStep === idx ? 'border-blue-100 bg-blue-50/80 shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                {currentStep === idx && <div className="absolute bottom-1.5 right-1.5 top-1.5 w-1 rounded-full bg-blue-600"></div>}
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${currentStep === idx ? 'bg-blue-100 text-blue-600' : currentStep > idx ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-500'}`}>
                  <step.icon size={15} strokeWidth={currentStep === idx ? 2.5 : 2} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${currentStep === idx ? 'text-blue-900' : 'text-gray-700'}`}>{step.title}</div>
                  <div className="text-[11px] text-gray-500">{step.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">TÓM TẮT</div>
          <div className="space-y-2.5 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-600"><ImageIcon size={13}/> Hình ảnh</span><span className="font-semibold text-gray-900">{productImages.length}</span></div>
            <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-600"><Layers size={13}/> Biến thể</span><span className="font-semibold text-gray-900">{variants.length}</span></div>
            <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-gray-600"><Info size={13}/> Tồn kho</span><span className="font-semibold text-gray-900">{totalStock}</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {/* Header - Mobile */}
        <div className="border-b border-gray-100 px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {steps.map((step, idx) => (
              <button key={step.id} type="button" onClick={() => setCurrentStep(idx)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left ${currentStep === idx ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                <step.icon size={14} /><span className="text-xs font-semibold">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Title Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
            {(() => { const Icon = steps[currentStep].icon; return <Icon size={18} strokeWidth={2.5} />; })()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{steps[currentStep].title}</h2>
            <p className="text-xs text-gray-500 sm:text-sm">{steps[currentStep].desc}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          {currentStep === 0 && <StepBasicInfo form={form} categories={categories} brands={brands} onNameChange={onNameChange} />}
          {currentStep === 1 && <StepProductImages productImages={productImages} handleProductImageSelect={handleProductImageSelect} removeProductImage={removeProductImage} />}
          {currentStep === 2 && <StepProductVariants variants={variants} addVariant={addVariant} removeVariant={removeVariant} updateVariant={updateVariant} handleVariantImageSelect={handleVariantImageSelect} removeVariantImage={removeVariantImage} />}
          {currentStep === 3 && <StepProductSEO form={form} watchedName={watchedName} watchedSlug={watchedSlug} watchedMetaTitle={watchedMetaTitle} watchedMetaDesc={watchedMetaDesc} />}
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div>{currentStep > 0 && <Button size="middle" onClick={handlePrev} icon={<ChevronLeft size={16}/>} className="flex items-center rounded-lg border-0 bg-gray-50 font-medium hover:bg-gray-100">Quay lại</Button>}</div>
          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <Button type="primary" size="middle" onClick={handleNext} className="flex items-center rounded-lg bg-blue-600 px-4 font-bold shadow-sm hover:shadow-md sm:px-6">Tiếp theo <ChevronRight size={16} className="ml-1" /></Button>
            ) : (
              <Button type="primary" size="middle" htmlType="submit" loading={loading} icon={<Save size={18}/>} className="flex items-center rounded-lg border-0 bg-emerald-600 px-5 font-bold shadow-sm hover:bg-emerald-700 hover:shadow-md sm:px-8">{submitLabel}</Button>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFormWizard;
