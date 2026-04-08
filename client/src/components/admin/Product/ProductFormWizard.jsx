import { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Switch, Tooltip, Checkbox } from 'antd';
import { Save, Image as ImageIcon, Layers, Globe, ChevronRight, ChevronLeft, Info, X, Plus, Search, Trash2, Upload, AlertCircle } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const { TextArea } = Input;
const { Option } = Select;

const ProductFormWizard = ({
  form,
  productImages = [],
  setProductImages,
  removeProductImage,
  updateProductImage,
  handleProductImageSelect,
  variants = [],
  addVariant,
  removeVariant,
  updateVariant,
  handleVariantImageSelect,
  removeVariantImage,
  updateVariantImage,
  categories = [],
  brands = [],
  loading = false,
  submitLabel = 'Lưu sản phẩm',
  onNameChange,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Watch form fields for SEO live preview
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

  const totalStock = variants.length > 0 
    ? variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
    : Number(form.getFieldValue('stock')) || 0;

  const handleNext = async () => {
    try {
      // Có thể add validateFields() tại đây theo step
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
      <Form
        form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ isActive: true }}
      className="flex overflow-hidden min-h-[700px]"
    >
      {/* Left Sidebar Steps */}
      <div className="w-[280px] bg-gray-50 border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">CÁC BƯỚC</div>
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isPast = currentStep > idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-50/80 border border-blue-100 shadow-sm relative' 
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {isActive && <div className="absolute right-2 top-0 bottom-0 w-1 bg-blue-600 rounded-full my-3"></div>}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-blue-100 text-blue-600' : isPast ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <step.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                      {step.title}
                    </div>
                    <div className="text-[11px] text-gray-500">{step.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8">
          <div className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">TÓM TẮT</div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600"><ImageIcon size={14}/> Hình ảnh</span>
              <span className="font-semibold text-gray-900">{productImages.length} ảnh</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600"><Layers size={14}/> Biến thể</span>
              <span className="font-semibold text-gray-900">{variants.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600"><Info size={14}/> Tồn kho</span>
              <span className="font-semibold text-gray-900">{totalStock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Step Header */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon size={20} strokeWidth={2.5} />;
            })()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep].desc}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          
          {/* STEP 0: THÔNG TIN CƠ BẢN */}
          <div className={currentStep === 0 ? 'block' : 'hidden'}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
                <Form.Item
                  name="name"
                  label={<span className="text-sm font-semibold text-gray-700">Tên sản phẩm <span className="text-red-500">*</span></span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input 
                    placeholder="VD: Nike Air Max 270" 
                    size="large" 
                    onChange={(e) => {
                      form.setFieldValue('name', e.target.value);
                      if (onNameChange) onNameChange(e);
                    }} 
                    className="rounded-lg h-12" 
                  />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label={<span className="text-sm font-semibold text-gray-700">Đường dẫn (Slug)</span>}
                  extra={<span className="text-[11px] text-gray-500 block mt-1">URL sẽ là: yourshop.com/products/duong-dan-san-pham</span>}
                >
                  <Input addonBefore="/products/" placeholder="duong-dan-san-pham" size="large" className="rounded-lg" />
                </Form.Item>

                <Form.Item 
                  name="description" 
                  label={<span className="text-sm font-semibold text-gray-700">Mô tả sản phẩm</span>}
                  className="mb-0"
                >
                  <RichTextEditor
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    onChange={(html) => form.setFieldValue('description', html)}
                  />
                </Form.Item>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">$</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Giá & Phân loại</h3>
                    <p className="text-xs text-gray-500">Thiết lập giá cơ bản và danh mục sản phẩm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="basePrice"
                    label={<span className="text-sm font-semibold text-gray-700">Giá cơ bản <span className="text-red-500">*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    className="mb-0"
                  >
                    <InputNumber
                      min={0}
                      placeholder="0"
                      style={{ width: '100%' }}
                      size="large"
                      className="rounded-lg h-12"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
                      addonAfter="VNĐ"
                    />
                  </Form.Item>

                  <Form.Item
                    name="categoryId"
                    label={<span className="text-sm font-semibold text-gray-700">Danh mục <span className="text-red-500">*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    className="mb-0"
                  >
                    <Select placeholder="-- Chọn danh mục --" size="large" className="rounded-lg h-12" showSearch optionFilterProp="children">
                      {categories.map((c) => (
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item 
                  name="brandId" 
                  label={<span className="text-sm font-semibold text-gray-700">Thương hiệu</span>}
                  className="mt-6 mb-0"
                >
                  <Select placeholder="-- Không có thương hiệu --" size="large" className="rounded-lg h-12" allowClear showSearch optionFilterProp="children">
                    {brands.map((b) => (
                      <Option key={b.id} value={b.id}>{b.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP 1: HÌNH ẢNH */}
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 border-l-4 border-pink-500 pl-3">Tải lên hình ảnh</h3>
                <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  Tối đa 10 ảnh
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                <input
                  type="file"
                  id="product-image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleProductImageSelect}
                  disabled={loading}
                  className="hidden"
                />
                <label
                  htmlFor="product-image-upload"
                  className={`cursor-pointer block ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                  <p className="text-base text-gray-900 font-bold mb-1">Click hoặc kéo thả để tải ảnh sản phẩm</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP • Tối đa 5MB mỗi ảnh</p>
                </label>
              </div>

              {productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-6">
                  {productImages.map((img) => (
                    <div key={img.tempId} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                      <img src={img.url || (img.file && URL.createObjectURL(img.file))} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); updateProductImage(img.tempId, { isThumbnail: true }); }}
                            className={`text-[10px] px-2 py-1 rounded font-semibold ${img.isThumbnail ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                          >
                            {img.isThumbnail ? 'Ảnh bìa' : 'Làm ảnh bìa'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeProductImage(img.tempId); }}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      {img.isThumbnail && (
                        <div className="absolute bottom-2 left-2 right-2 text-center bg-blue-600/90 text-white text-[10px] font-bold py-1 rounded backdrop-blur-sm pointer-events-none">
                          ẢNH ĐẠI DIỆN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: BIẾN THỂ */}
          <div className={currentStep === 2 ? 'block' : 'hidden'}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Quản lý biến thể</h3>
                  <p className="text-xs text-gray-500">Thêm các tùy chọn về size, màu sắc, tồn kho và giá</p>
                </div>
                {variants.length > 0 && (
                  <Button type="primary" onClick={addVariant} icon={<Plus size={16}/>} className="rounded-lg">
                    Thêm biến thể
                  </Button>
                )}
              </div>

              {variants.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Layers className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Chưa có biến thể</h4>
                  <p className="text-sm text-gray-500 mb-6">Thêm biến thể để quản lý size, màu sắc, tồn kho</p>
                  <Button type="primary" size="large" onClick={addVariant} className="rounded-lg px-8 font-semibold shadow-sm" icon={<Plus size={18}/>}>
                    Thêm biến thể đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Inline list of variants for simple wizard style or you can use the same map code from Unified form here */}
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} className="border border-gray-200 rounded-xl p-5 bg-white hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">#{idx + 1}</div>
                          Biến thể {idx + 1}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            Trạng thái: 
                            <Switch 
                              checked={v.isActive} 
                              onChange={(checked) => updateVariant(v.id, { isActive: checked })}
                              size="small"
                            />
                          </div>
                          <Button 
                            danger 
                            type="text" 
                            icon={<Trash2 size={16}/>} 
                            onClick={() => removeVariant(v.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Kích thước</label>
                          <Input value={v.size} onChange={(e) => updateVariant(v.id, { size: e.target.value })} placeholder="VD: S, M, L..." className="rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Màu sắc</label>
                          <Input value={v.color} onChange={(e) => updateVariant(v.id, { color: e.target.value })} placeholder="VD: Đen, Trắng..." className="rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Mã SKU</label>
                          <Input value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value })} placeholder="VD: IPH-12-XX" className="rounded-lg font-mono text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Giá bán</label>
                          <InputNumber 
                            min={0} 
                            value={v.price} 
                            onChange={(val) => updateVariant(v.id, { price: val || 0 })} 
                            style={{ width: '100%' }} 
                            className="rounded-lg"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            addonAfter="₫"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Tồn kho</label>
                          <InputNumber min={0} value={v.stock} onChange={(val) => updateVariant(v.id, { stock: val || 0 })} style={{ width: '100%' }} className="rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            Ngưỡng tồn thấp
                            <Tooltip title="Sẽ báo đỏ nếu tồn kho dưới mức này"><AlertCircle size={12} className="text-gray-400"/></Tooltip>
                          </label>
                          <InputNumber min={0} value={v.lowStockThreshold} onChange={(val) => updateVariant(v.id, { lowStockThreshold: val || 5 })} style={{ width: '100%' }} className="rounded-lg" />
                        </div>
                      </div>

                      {/* Variant Images */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-medium text-gray-700">Ảnh riêng của biến thể</label>
                          <label className="cursor-pointer text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded">
                            <Upload size={14}/> Thêm ảnh
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleVariantImageSelect(v.id, e)} 
                              disabled={loading}
                            />
                          </label>
                        </div>
                        
                        {v.images && v.images.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {v.images.map(img => (
                              <div key={img.tempId} className="flex gap-2 items-center bg-white p-2 border border-gray-100 rounded shadow-sm">
                                <img src={img.url || (img.file && URL.createObjectURL(img.file))} className="w-12 h-12 object-cover rounded shadow-sm border border-gray-100"/>
                                <div className="flex-1 flex flex-col gap-1">
                                  <Checkbox 
                                    checked={img.isPrimary} 
                                    onChange={(e) => updateVariantImage(v.id, img.tempId, { isPrimary: e.target.checked })}
                                    className="text-[10px]"
                                  >
                                    Ảnh chính
                                  </Checkbox>
                                </div>
                                <Button type="text" danger size="small" icon={<X size={14}/>} onClick={() => removeVariantImage(v.id, img.tempId)}/>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic text-center py-2">Chưa có ảnh riêng (sẽ dùng ảnh sản phẩm chung)</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-6">
                    <Button type="dashed" block onClick={addVariant} icon={<Plus size={16}/>} className="rounded-lg h-10 border-gray-300">
                      Thêm biến thể khác
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: SEO */}
          <div className={currentStep === 3 ? 'block' : 'hidden'}>
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex flex-shrink-0 items-center justify-center text-blue-500">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">SEO & Meta Tags</h3>
                  <p className="text-xs text-gray-500">Tối ưu hóa sản phẩm cho công cụ tìm kiếm</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Form.Item 
                    name="metaTitle" 
                    label={<div className="flex justify-between w-full"><span className="text-sm font-semibold text-gray-700">Meta Title</span></div>}
                    className="mb-0"
                  >
                    <Input placeholder="Tiêu đề hiển thị trên Google..." size="large" maxLength={60} showCount className="rounded-lg h-12" />
                  </Form.Item>
                </div>
                <div className="h-px bg-gray-100 w-full my-4"></div>
                <div>
                  <Form.Item 
                    name="metaDesc" 
                    label={<div className="flex justify-between w-full"><span className="text-sm font-semibold text-gray-700">Meta Description</span></div>}
                    className="mb-0"
                  >
                    <TextArea rows={3} placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm Google..." maxLength={160} showCount className="rounded-lg p-3" />
                  </Form.Item>
                </div>
                <div className="h-px bg-gray-100 w-full my-4"></div>

                <div>
                  <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">XEM TRƯỚC KẾT QUẢ GOOGLE</div>
                  <div className="border border-gray-200 rounded-xl p-5 bg-white max-w-2xl">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">G</div>
                      <div>
                        <div className="text-[12px] text-gray-800">yourshop.com</div>
                      </div>
                    </div>
                    <div className="text-[18px] text-blue-700 font-medium hover:underline cursor-pointer truncate mb-0.5">
                      {watchedMetaTitle || watchedName || 'Tiêu đề sản phẩm'}
                    </div>
                    <div className="text-[13px] text-emerald-700 font-medium truncate mb-1">
                      https://yourshop.com/products/{watchedSlug || 'duong-dan-san-pham'}
                    </div>
                    <div className="text-[13px] text-gray-600 leading-snug line-clamp-2">
                      {watchedMetaDesc || 'Mô tả sản phẩm sẽ hiển thị tại đây...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-100 px-10 py-5 bg-white flex justify-between items-center z-10 sticky bottom-0">
          <div>
            {currentStep > 0 && (
              <Button size="large" onClick={handlePrev} icon={<ChevronLeft size={16}/>} className="rounded-xl flex items-center font-medium bg-gray-50 border-0 hover:bg-gray-100">
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <Button type="primary" size="large" onClick={handleNext} className="rounded-xl flex items-center font-bold px-6 bg-blue-600 shadow-sm hover:shadow-md">
                Tiếp theo: {steps[currentStep + 1].title} <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<Save size={18}/>} className="rounded-xl flex items-center font-bold px-8 bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md border-0">
                {submitLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFormWizard;
