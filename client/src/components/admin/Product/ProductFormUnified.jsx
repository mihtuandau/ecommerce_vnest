import { Upload, X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { Form, Input, InputNumber, Select, Button, Card, Switch, Checkbox, Tag } from 'antd';
import { useMemo, useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;
const CONTROL_SIZE = 'large';
const PRIMARY_BTN_CLASS = '!bg-[#37A76B] !border-[#37A76B] hover:!bg-[#2E955F] hover:!border-[#2E955F] text-white rounded-lg';
const CARD_CLASS = 'shadow-none border border-[#E6E8EC] rounded-xl overflow-hidden bg-white';
  
const ProductFormUnified = ({
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
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [bulkSizesInput, setBulkSizesInput] = useState('');
  const [bulkColorsInput, setBulkColorsInput] = useState('');
  const [bulkSkuPrefix, setBulkSkuPrefix] = useState('');
  const [bulkDefaultPrice, setBulkDefaultPrice] = useState('');
  const [bulkDefaultStock, setBulkDefaultStock] = useState('0');
  const [variantKeyword, setVariantKeyword] = useState('');
  const [expandedImageRows, setExpandedImageRows] = useState([]);

  const sizePresets = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorPresets = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Hồng', 'Be'];

  const parseList = (text) =>
    String(text || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  const appendPreset = (prevText, value) => {
    const list = parseList(prevText);
    if (list.includes(value)) return prevText;
    return list.length ? `${list.join(', ')}, ${value}` : value;
  };

  const existingVariantKeys = useMemo(
    () =>
      new Set(
        variants.map(
          (v) => `${(v.size || '').trim().toLowerCase()}|${(v.color || '').trim().toLowerCase()}`,
        ),
      ),
    [variants],
  );

  const bulkPreviewRows = useMemo(() => {
    const sizes = parseList(bulkSizesInput);
    const colors = parseList(bulkColorsInput);
    const normalizedSizes = sizes.length ? sizes : [''];
    const normalizedColors = colors.length ? colors : [''];
    const rows = [];

    for (const size of normalizedSizes) {
      for (const color of normalizedColors) {
        const key = `${String(size).trim().toLowerCase()}|${String(color).trim().toLowerCase()}`;
        rows.push({ size, color, exists: existingVariantKeys.has(key) });
      }
    }

    return rows;
  }, [bulkSizesInput, bulkColorsInput, existingVariantKeys]);

  const bulkPreviewCount = useMemo(() => {
    const sizes = parseList(bulkSizesInput);
    const colors = parseList(bulkColorsInput);
    return (sizes.length || 1) * (colors.length || 1);
  }, [bulkSizesInput, bulkColorsInput]);

  const bulkNewCount = useMemo(
    () => bulkPreviewRows.filter((r) => !r.exists).length,
    [bulkPreviewRows],
  );

  const bulkPreviewChips = useMemo(() => bulkPreviewRows.slice(0, 6), [bulkPreviewRows]);
  const bulkPreviewExtraCount = Math.max(0, bulkPreviewRows.length - bulkPreviewChips.length);

  const variantRows = useMemo(
    () => variants.map((variant, index) => ({ variant, index })),
    [variants],
  );

  const filteredVariantRows = useMemo(() => {
    const keyword = String(variantKeyword || '').trim().toLowerCase();

    return variantRows.filter(({ variant }) => {
      if (!keyword) return true;

      return [variant.size, variant.color, variant.sku]
        .map((v) => String(v || '').toLowerCase())
        .some((v) => v.includes(keyword));
    });
  }, [variantRows, variantKeyword]);

  const colorGroupCount = useMemo(
    () =>
      new Set(
        filteredVariantRows.map(({ variant }) => (variant.color || '').trim() || 'Không màu'),
      ).size,
    [filteredVariantRows],
  );

  const handleBulkCreate = () => {
    addVariantsBulk?.(bulkSizesInput, bulkColorsInput, {
      skuPrefix: bulkSkuPrefix,
      defaultPrice: bulkDefaultPrice,
      defaultStock: bulkDefaultStock,
    });
  };

  const toggleImageRow = (variantId) => {
    setExpandedImageRows((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId],
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ isActive: true }}
    >
      <div className="w-full max-w-[1600px] mx-auto py-4 lg:py-6 bg-[#F7F8FA] rounded-2xl px-3 lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
          {/* Cột trái: Thông tin cơ bản (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin cơ bản */}
            <Card 
              title={
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-gray-900">Basic Details</span>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
              }
              className={CARD_CLASS}
            >
              <div className="space-y-4">
                <Form.Item
                  name="name"
                  label={<span className="text-sm font-medium text-gray-700">Tên sản phẩm</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input
                    placeholder="Ví dụ: iPhone 15 Pro Max"
                    size={CONTROL_SIZE}
                    onChange={onNameChange}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label={<span className="text-sm font-medium text-gray-700">Slug (URL thân thiện)</span>}
                  extra={<span className="text-xs text-gray-500">Để trống để tự động tạo từ tên sản phẩm</span>}
                >
                  <Input placeholder="iphone-15-pro-max" size={CONTROL_SIZE} className="rounded-lg font-mono text-sm" />
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
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-gray-900">Pricing</span>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
              }
              className={CARD_CLASS}
            >
              <Form.Item
                name="basePrice"
                label={<span className="text-sm font-medium text-gray-700">Product Price</span>}
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              >
                <InputNumber
                  min={0}
                  placeholder="0"
                  style={{ width: '100%' }}
                  size={CONTROL_SIZE}
                  className="rounded-lg"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
                  addonAfter="₫"
                />
              </Form.Item>
            </Card>

            <Card
              title={
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-gray-900">Inventory</span>
                  <span className="text-xs text-gray-500">Theo biến thể</span>
                </div>
              }
              className={CARD_CLASS}
            >
              <p className="text-sm text-gray-600">
                Stock được quản lý theo từng biến thể trong bảng bên dưới.
              </p>
            </Card>

            {/* Biến thể */}
            <Card
              id="variants"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-900">Biến thể sản phẩm</span>
                    {variants.length > 0 && (
                      <Tag color="purple" className="ml-2">{variants.length} biến thể</Tag>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="primary"
                      icon={<Plus size={16} />}
                      onClick={addVariant}
                      disabled={loading}
                      className={PRIMARY_BTN_CLASS}
                    >
                      {variants.length > 0 ? 'Thêm biến thể' : 'Thêm biến thể đầu tiên'}
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setShowQuickCreate((prev) => !prev)}
                      disabled={loading}
                      className="rounded-lg"
                    >
                      {showQuickCreate ? 'Ẩn tạo nhanh' : 'Tạo nhanh'}
                    </Button>
                  </div>
                </div>
              }
              className={CARD_CLASS}
            >
              <div className="px-6 pt-5 pb-1">
                <p className="text-sm text-gray-600 mb-4">
                  Mỗi biến thể chỉ cần nhập thông tin cơ bản. Nếu cần tạo nhiều biến thể cùng lúc, mở phần tạo nhanh bên dưới.
                </p>

                {variants.length > 0 && (
                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <Input
                        size={CONTROL_SIZE}
                        value={variantKeyword}
                        onChange={(e) => setVariantKeyword(e.target.value)}
                        placeholder="Tìm theo size, màu, SKU"
                        allowClear
                      />
                      <div className="text-xs text-gray-500 flex items-center md:justify-end">
                        Nhóm màu: <span className="font-semibold text-gray-700 ml-1">{colorGroupCount}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Đang hiển thị <span className="font-semibold">{filteredVariantRows.length}</span> / {variants.length} biến thể.
                    </p>
                  </div>
                )}
              </div>

              {showQuickCreate && (
                <div className="mx-6 mb-5 p-4 rounded-lg border border-purple-200 bg-purple-50/50">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-medium text-gray-800">Tạo nhanh theo size / màu</p>
                    <Button size="small" onClick={handleBulkCreate} disabled={loading} type="primary" className={PRIMARY_BTN_CLASS}>
                      Tạo biến thể từ danh sách
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Size</label>
                      <Input
                        size={CONTROL_SIZE}
                        value={bulkSizesInput}
                        onChange={(e) => setBulkSizesInput(e.target.value)}
                        placeholder="S, M, L, XL"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Màu sắc</label>
                      <Input
                        size={CONTROL_SIZE}
                        value={bulkColorsInput}
                        onChange={(e) => setBulkColorsInput(e.target.value)}
                        placeholder="Đen, Trắng, Xanh"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sizePresets.map((size) => (
                      <Button
                        key={size}
                        size="small"
                        type="default"
                        onClick={() => setBulkSizesInput((prev) => appendPreset(prev, size))}
                      >
                        {size}
                      </Button>
                    ))}
                    {colorPresets.map((color) => (
                      <Button
                        key={color}
                        size="small"
                        type="default"
                        onClick={() => setBulkColorsInput((prev) => appendPreset(prev, color))}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Tiền tố SKU</label>
                      <Input
                        size={CONTROL_SIZE}
                        value={bulkSkuPrefix}
                        onChange={(e) => setBulkSkuPrefix(e.target.value)}
                        placeholder="VD: TSHIRT"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Giá mặc định</label>
                      <Input
                        size={CONTROL_SIZE}
                        value={bulkDefaultPrice}
                        onChange={(e) => setBulkDefaultPrice(e.target.value)}
                        placeholder="Để trống = giá cơ bản"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Tồn kho mặc định</label>
                      <Input
                        size={CONTROL_SIZE}
                        value={bulkDefaultStock}
                        onChange={(e) => setBulkDefaultStock(e.target.value)}
                        placeholder="0"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  {bulkPreviewRows.length > 0 && (
                    <div className="rounded-lg border border-purple-100 bg-white p-3">
                      <p className="text-[11px] text-gray-600 mb-2">
                        Sẽ tạo <span className="font-semibold text-gray-700">{bulkPreviewCount}</span> tổ hợp, thêm mới <span className="font-semibold text-purple-700">{bulkNewCount}</span> biến thể.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {bulkPreviewChips.map((row, idx) => (
                          <span
                            key={`${row.size}-${row.color}-${idx}`}
                            className={`px-2 py-1 text-[11px] rounded border ${
                              row.exists
                                ? 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {(row.size || '—') + ' / ' + (row.color || '—')}
                          </span>
                        ))}
                        {bulkPreviewExtraCount > 0 && (
                          <span className="px-2 py-1 text-[11px] rounded border bg-white text-gray-500 border-gray-200">
                            +{bulkPreviewExtraCount} nữa
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  <div className="mt-3">
                    <Button type="default" onClick={() => setShowQuickCreate(true)}>
                      Hoặc tạo nhanh size / màu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
                    {filteredVariantRows.map(({ variant, index: originalIndex }) => (
                      <div key={variant.id} className="border border-gray-200 rounded-lg bg-white">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-500">Biến thể #{originalIndex + 1}</div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={variant.isActive}
                                onChange={(checked) => updateVariant(variant.id, { isActive: checked })}
                                size="small"
                              />
                              <Button
                                type="text"
                                danger
                                icon={<Trash2 size={15} />}
                                onClick={() => removeVariant(variant.id)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                            <Input
                              size="middle"
                              value={variant.size}
                              onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
                              placeholder="Size"
                            />
                            <Input
                              size="middle"
                              value={variant.color}
                              onChange={(e) => updateVariant(variant.id, { color: e.target.value })}
                              placeholder="Màu"
                            />
                            <Input
                              size="middle"
                              value={variant.sku}
                              onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                              placeholder="SKU"
                            />
                            <InputNumber
                              size="middle"
                              min={0}
                              value={variant.price}
                              onChange={(val) => updateVariant(variant.id, { price: val || 0 })}
                              style={{ width: '100%' }}
                              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(v) => (v || '').replace(/\$\s?|(,*)/g, '')}
                            />
                            <InputNumber
                              size="middle"
                              min={0}
                              value={variant.stock}
                              onChange={(val) => updateVariant(variant.id, { stock: val || 0 })}
                              style={{ width: '100%' }}
                              placeholder="Kho"
                            />
                            <InputNumber
                              size="middle"
                              min={0}
                              value={variant.lowStockThreshold}
                              onChange={(val) => updateVariant(variant.id, { lowStockThreshold: val || 5 })}
                              style={{ width: '100%' }}
                              placeholder="Ngưỡng"
                            />
                          </div>

                          <div className="mt-2">
                            <Button
                              size="small"
                              type="default"
                              onClick={() => toggleImageRow(variant.id)}
                            >
                              {expandedImageRows.includes(variant.id) ? 'Ẩn ảnh' : 'Quản lý ảnh'} ({variant.images?.length || 0})
                            </Button>
                            {!variant.images?.length && (
                              <p className="text-[11px] text-gray-500 mt-1">Đang kế thừa ảnh theo màu/sản phẩm</p>
                            )}
                          </div>
                        </div>

                        {expandedImageRows.includes(variant.id) && (
                          <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex flex-wrap items-center gap-2 mb-2 mt-2">
                              <input
                                type="file"
                                id={`variant-image-${variant.id}`}
                                multiple
                                accept="image/*"
                                onChange={(e) => handleVariantImageSelect(variant.id, e)}
                                disabled={loading}
                                className="hidden"
                              />
                              <label htmlFor={`variant-image-${variant.id}`}>
                                <Button size="small" icon={<Upload size={14} />} disabled={loading} className="rounded-md">
                                  Thêm ảnh
                                </Button>
                              </label>
                              <Button
                                size="small"
                                type="default"
                                disabled={loading || !variant.color || !(variant.images?.length > 0)}
                                onClick={() => setColorImageSource?.(variant.id)}
                              >
                                Đặt ảnh theo màu
                              </Button>
                              <Button
                                size="small"
                                danger
                                type="text"
                                disabled={loading || !(variant.images?.length > 0)}
                                onClick={() => clearVariantImages?.(variant.id)}
                              >
                                Xóa ảnh riêng
                              </Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {variant.images?.map((img) => (
                                <div key={img.tempId} className="inline-flex items-center gap-1 px-1.5 py-1 rounded border bg-white">
                                  <img
                                    src={img.url || (img.file && URL.createObjectURL(img.file))}
                                    alt=""
                                    className="w-7 h-7 object-cover rounded"
                                  />
                                  <Checkbox
                                    checked={img.isPrimary}
                                    onChange={(e) =>
                                      updateVariantImage(variant.id, img.tempId, {
                                        isPrimary: e.target.checked,
                                      })
                                    }
                                  />
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<X size={12} />}
                                    onClick={() => removeVariantImage(variant.id, img.tempId)}
                                  />
                                </div>
                              ))}
                              {!variant.images?.length && (
                                <span className="text-[11px] text-gray-500">Chưa có ảnh riêng cho biến thể này.</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {filteredVariantRows.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600">Không có biến thể phù hợp bộ lọc hiện tại.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Cột phải: Trạng thái, Hình ảnh (1 col) */}
          <div className="space-y-6 lg:sticky lg:top-4">
            {/* Trạng thái */}
            <Card 
              title={
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-gray-900">Trạng thái</span>
                  <span className="text-xs text-gray-500">Hiển thị</span>
                </div>
              }
              className={CARD_CLASS}
            >
              <Form.Item name="isActive" label="Trạng thái bán hàng" valuePropName="checked" className="mb-2">
                <Switch 
                  checkedChildren="Đang bán" 
                  unCheckedChildren="Ngừng bán"
                  className="bg-gray-300"
                />
              </Form.Item>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                Sản phẩm đang bán sẽ hiển thị trên website cho khách hàng.
              </p>
            </Card>

            {/* Hình ảnh sản phẩm */}
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-900">Hình ảnh sản phẩm</span>
                    {productImages.length > 0 && (
                      <Tag color="pink">{productImages.length} ảnh</Tag>
                    )}
                  </div>
                </div>
              }
              className={CARD_CLASS}
            >
              <div className="border border-dashed border-[#D7DBE3] rounded-xl p-6 text-center hover:border-[#37A76B] hover:bg-[#F3FBF6] transition-all mb-4 cursor-pointer">
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
                  <div className="w-12 h-12 bg-[#EAF7EF] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="text-[#37A76B]" size={24} />
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

            <Card
              title={
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-gray-900">Categories</span>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
              }
              className={CARD_CLASS}
            >
              <div className="space-y-4">
                <Form.Item
                  name="categoryId"
                  label={<span className="text-sm font-medium text-gray-700">Product Categories</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select
                    placeholder="Select your product"
                    size={CONTROL_SIZE}
                    showSearch
                    className="rounded-lg"
                    optionFilterProp="children"
                  >
                    {categories.map((c) => (
                      <Option key={c.id} value={c.id}>{c.name}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="brandId"
                  label={<span className="text-sm font-medium text-gray-700">Product Tag</span>}
                >
                  <Select
                    placeholder="Select your product"
                    size={CONTROL_SIZE}
                    allowClear
                    showSearch
                    className="rounded-lg"
                    optionFilterProp="children"
                  >
                    {brands.map((b) => (
                      <Option key={b.id} value={b.id}>{b.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Card>

            {/* Hide unsupported figma sections (tax, discount, expiration, color chips) */}
          </div>
        </div>

        {/* Footer: Sticky bottom bar */}
        <div className="sticky bottom-0 left-0 right-0 mt-6 bg-white/95 backdrop-blur border border-[#E6E8EC] shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
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
                className={`min-w-[150px] font-semibold ${PRIMARY_BTN_CLASS}`}
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