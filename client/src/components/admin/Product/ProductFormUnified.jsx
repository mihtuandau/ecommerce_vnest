import { Upload, X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { Form, Input, InputNumber, Select, Button, Card, Switch, Checkbox, Tag, Tooltip } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
  
const ProductFormUnified = ({
  form,
  productImages,
  setProductImages,
  removeProductImage,
  updateProductImage,
  handleProductImageSelect,
  variants,
  addVariant,
  removeVariant,
  updateVariant,
  handleVariantImageSelect,
  removeVariantImage,
  updateVariantImage,
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
    >
      <div className="max-full w-full py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Thông tin cơ bản (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin cơ bản */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-900">Thông tin cơ bản</span>
                </div>
              }
              className="shadow-sm hover:shadow-md transition-all duration-200 border-0 rounded-xl overflow-hidden"
            >
              <div className="space-y-4">
                <Form.Item
                  name="name"
                  label={<span className="text-sm font-medium text-gray-700">Tên sản phẩm</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                    size="large"
                    onChange={onNameChange}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label={<span className="text-sm font-medium text-gray-700">Slug (URL thân thiện)</span>}
                  extra={<span className="text-xs text-gray-500">Để trống để tự động tạo từ tên sản phẩm</span>}
                >
                  <Input placeholder="iphone-15-pro-max" size="large" className="rounded-lg font-mono text-sm" />
                </Form.Item>

                <Form.Item 
                  name="description" 
                  label={<span className="text-sm font-medium text-gray-700">Mô tả sản phẩm</span>}
                >
                  <TextArea
                    rows={5}
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    className="rounded-lg"
                    showCount
                    maxLength={2000}
                  />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="basePrice"
                    label={<span className="text-sm font-medium text-gray-700">Giá cơ bản</span>}
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                  >
                    <InputNumber
                      min={0}
                      placeholder="0"
                      style={{ width: '100%' }}
                      size="large"
                      className="rounded-lg"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
                      addonAfter="₫"
                    />
                  </Form.Item>

                  <Form.Item
                    name="categoryId"
                    label={<span className="text-sm font-medium text-gray-700">Danh mục</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      size="large"
                      showSearch
                      className="rounded-lg"
                      optionFilterProp="children"
                      notFoundContent={
                        <div className="p-2 text-center">
                          <Button type="link" size="small">+ Thêm danh mục mới</Button>
                        </div>
                      }
                    >
                      {categories.map((c) => (
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item 
                  name="brandId" 
                  label={<span className="text-sm font-medium text-gray-700">Thương hiệu</span>}
                >
                  <Select
                    placeholder="Chọn thương hiệu"
                    size="large"
                    allowClear
                    showSearch
                    className="rounded-lg"
                    optionFilterProp="children"
                    notFoundContent={
                      <div className="p-2 text-center">
                        <Button type="link" size="small">+ Thêm thương hiệu mới</Button>
                      </div>
                    }
                  >
                    {brands.map((b) => (
                      <Option key={b.id} value={b.id}>{b.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Card>

            {/* SEO */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-900">SEO & tối ưu tìm kiếm</span>
                </div>
              }
              className="shadow-sm hover:shadow-md transition-all duration-200 border-0 rounded-xl overflow-hidden"
            >
              <div className="space-y-4">
                <Form.Item 
                  name="metaTitle" 
                  label={<span className="text-sm font-medium text-gray-700">Meta Title</span>}
                  tooltip="Tiêu đề hiển thị trên Google (tối đa 60 ký tự)"
                >
                  <Input 
                    placeholder="Tiêu đề SEO" 
                    size="large" 
                    maxLength={60} 
                    showCount 
                    className="rounded-lg"
                  />
                </Form.Item>
                
                <Form.Item 
                  name="metaDesc" 
                  label={<span className="text-sm font-medium text-gray-700">Meta Description</span>}
                  tooltip="Mô tả hiển thị trên Google (tối đa 160 ký tự)"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Mô tả SEO" 
                    maxLength={160} 
                    showCount 
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Biến thể */}
            <Card
              id="variants"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                    <span className="text-lg font-semibold text-gray-900">Biến thể sản phẩm</span>
                    {variants.length > 0 && (
                      <Tag color="purple" className="ml-2">{variants.length} biến thể</Tag>
                    )}
                  </div>
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={addVariant}
                    disabled={loading}
                    className="rounded-lg"
                  >
                    Thêm biến thể
                  </Button>
                </div>
              }
              className="shadow-sm hover:shadow-md transition-all duration-200 border-0 rounded-xl overflow-hidden"
            >
              {variants.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-purple-500" size={32} />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">Chưa có biến thể nào</p>
                  <p className="text-sm text-gray-500 mb-4">Thêm các biến thể khác nhau cho sản phẩm của bạn</p>
                  <Button type="primary" icon={<Plus size={16} />} onClick={addVariant}>
                    Thêm biến thể đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, idx) => (
                    <div 
                      key={variant.id} 
                      className="border-2 border-gray-200 rounded-xl p-5 bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Header biến thể */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">#{idx + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {variant.size || variant.color ? (
                                <>
                                  {variant.size && <span className="text-blue-600">{variant.size}</span>}
                                  {variant.size && variant.color && <span className="text-gray-400 mx-1">•</span>}
                                  {variant.color && <span className="text-green-600">{variant.color}</span>}
                                </>
                              ) : (
                                <span className="text-gray-400">Chưa có thông tin</span>
                              )}
                            </h4>
                            {variant.sku && (
                              <p className="text-xs text-gray-500 mt-0.5">SKU: {variant.sku}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={variant.isActive}
                            onChange={(checked) => updateVariant(variant.id, { isActive: checked })}
                            checkedChildren="Bán"
                            unCheckedChildren="Tắt"
                            size="small"
                          />
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => removeVariant(variant.id)}
                            className="hover:bg-red-50"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>

                      {/* Thông tin biến thể */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Kích thước</label>
                          <Input
                            value={variant.size}
                            onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
                            placeholder="Ví dụ: 256GB"
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Màu sắc</label>
                          <Input
                            value={variant.color}
                            onChange={(e) => updateVariant(variant.id, { color: e.target.value })}
                            placeholder="Ví dụ: Đen"
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">SKU</label>
                          <Input
                            value={variant.sku}
                            onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                            placeholder="Mã sản phẩm"
                            className="rounded-lg font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Giá bán</label>
                          <InputNumber
                            min={0}
                            value={variant.price}
                            onChange={(val) => updateVariant(variant.id, { price: val || 0 })}
                            style={{ width: '100%' }}
                            className="rounded-lg"
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
                            addonAfter="₫"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Tồn kho</label>
                          <InputNumber
                            min={0}
                            value={variant.stock}
                            onChange={(val) => updateVariant(variant.id, { stock: val || 0 })}
                            style={{ width: '100%' }}
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            <Tooltip title="Cảnh báo khi tồn kho thấp hơn ngưỡng này">
                              <span className="flex items-center gap-1">
                                Ngưỡng cảnh báo
                                <AlertCircle size={12} className="text-gray-400" />
                              </span>
                            </Tooltip>
                          </label>
                          <InputNumber
                            min={0}
                            value={variant.lowStockThreshold}
                            onChange={(val) => updateVariant(variant.id, { lowStockThreshold: val || 5 })}
                            style={{ width: '100%' }}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Ảnh biến thể */}
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <label className="block text-xs font-medium text-gray-700 mb-3">Ảnh cho biến thể này</label>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-all mb-3 cursor-pointer">
                          <input
                            type="file"
                            id={`variant-image-${variant.id}`}
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantImageSelect(variant.id, e)}
                            disabled={loading}
                            className="hidden"
                          />
                          <label
                            htmlFor={`variant-image-${variant.id}`}
                            className={`cursor-pointer block ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Upload className="mx-auto mb-1 text-gray-400" size={20} />
                            <p className="text-xs text-gray-600 font-medium">Thêm ảnh</p>
                          </label>
                        </div>

                        {variant.images && variant.images.length > 0 && (
                          <div className="space-y-2">
                            {variant.images.map((img) => (
                              <div
                                key={img.tempId}
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all"
                              >
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-300 shadow-sm flex-shrink-0">
                                  <img
                                    src={img.url || (img.file && URL.createObjectURL(img.file))}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                  <Checkbox
                                    checked={img.isPrimary}
                                    onChange={(e) =>
                                      updateVariantImage(variant.id, img.tempId, {
                                        isPrimary: e.target.checked,
                                      })
                                    }
                                  >
                                    <span className="text-xs">Ảnh chính</span>
                                  </Checkbox>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Thứ tự:</span>
                                    <InputNumber
                                      min={0}
                                      value={img.displayOrder}
                                      onChange={(val) =>
                                        updateVariantImage(variant.id, img.tempId, {
                                          displayOrder: val || 0,
                                        })
                                      }
                                      size="small"
                                      style={{ width: 60 }}
                                    />
                                  </div>
                                </div>
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<X size={14} />}
                                  onClick={() => removeVariantImage(variant.id, img.tempId)}
                                  className="hover:bg-red-50"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Cột phải: Trạng thái, Hình ảnh (1 col) */}
          <div className="space-y-6">
            {/* Trạng thái */}
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-900">Trạng thái</span>
                </div>
              }
              className="shadow-sm hover:shadow-md transition-all duration-200 border-0 rounded-xl overflow-hidden"
            >
              <Form.Item name="isActive" label="Trạng thái bán hàng" valuePropName="checked" className="mb-2">
                <Switch 
                  checkedChildren="Đang bán" 
                  unCheckedChildren="Ngừng bán"
                  className="bg-gray-300"
                />
              </Form.Item>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                💡 Sản phẩm đang bán sẽ hiển thị trên website cho khách hàng
              </p>
            </Card>

            {/* Hình ảnh sản phẩm */}
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
                    <span className="text-lg font-semibold text-gray-900">Hình ảnh</span>
                    {productImages.length > 0 && (
                      <Tag color="pink">{productImages.length} ảnh</Tag>
                    )}
                  </div>
                </div>
              }
              className="shadow-sm hover:shadow-md transition-all duration-200 border-0 rounded-xl overflow-hidden"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 hover:bg-pink-50 transition-all mb-4 cursor-pointer">
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
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="text-pink-500" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {productImages.length > 0 ? 'Thêm ảnh khác' : 'Tải ảnh lên'}
                  </p>
                  <p className="text-xs text-gray-500">Click hoặc kéo thả file</p>
                </label>
              </div>

              {productImages.length > 0 && (
                <div className="space-y-3">
                  {productImages.map((img) => (
                    <div 
                      key={img.tempId} 
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm flex-shrink-0">
                        <img
                          src={img.url || (img.file && URL.createObjectURL(img.file))}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {img.isThumbnail && (
                          <div className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl">
                            Chính
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Checkbox
                            checked={img.isThumbnail}
                            onChange={(e) =>
                              updateProductImage(img.tempId, { isThumbnail: e.target.checked })
                            }
                          >
                            <span className="text-xs">Ảnh đại diện</span>
                          </Checkbox>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-600">Thứ tự:</span>
                            <InputNumber
                              min={0}
                              value={img.displayOrder}
                              onChange={(val) =>
                                updateProductImage(img.tempId, { displayOrder: val || 0 })
                              }
                              size="small"
                              style={{ width: 60 }}
                            />
                          </div>
                        </div>
                        <Input
                          placeholder="Alt text (mô tả ảnh cho SEO)"
                          value={img.altText}
                          onChange={(e) =>
                            updateProductImage(img.tempId, { altText: e.target.value })
                          }
                          size="small"
                          className="text-xs"
                        />
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<X size={16} />}
                        onClick={() => removeProductImage(img.tempId)}
                        className="hover:bg-red-50 flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick tips */}
            <Card className="shadow-sm border-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <AlertCircle size={16} className="text-blue-500" />
                  Mẹo nhỏ
                </h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Tên sản phẩm nên rõ ràng, dễ hiểu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Ảnh chất lượng cao giúp tăng chuyển đổi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Cập nhật tồn kho thường xuyên</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>SEO giúp sản phẩm dễ tìm kiếm hơn</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer: Sticky bottom bar */}
        <div className="sticky bottom-0 left-0 right-0 mt-6 bg-white border-t-2 border-gray-200 shadow-lg rounded-t-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div className="text-sm text-gray-600">
              {isEdit ? 'Đang chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
            </div>
            <div className="flex gap-3">
              <Button 
                size="large" 
                onClick={onCancel} 
                disabled={loading} 
                className="min-w-[100px] rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                icon={isEdit ? <Save size={18} /> : <Plus size={18} />}
                htmlType="submit"
                loading={loading}
                className="min-w-[150px] font-semibold shadow-md hover:shadow-lg rounded-lg"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFormUnified;