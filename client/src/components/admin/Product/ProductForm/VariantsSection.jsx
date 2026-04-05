import { Plus, Trash2 } from 'lucide-react';
import { Button, Input, InputNumber, Tag, Switch } from 'antd';
import { useMemo, useState } from 'react';
import { CARD_CLASS, CONTROL_SIZE, PRIMARY_BTN_CLASS, SIZE_PRESETS, COLOR_PRESETS, parseList, appendPreset } from './formConstants';

export const VariantsSection = ({
  variants,
  addVariant,
  addVariantsBulk,
  removeVariant,
  updateVariant,
  handleVariantImageSelect,
  removeVariantImage,
  updateVariantImage,
  clearVariantImages,
  loading,
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [bulkSizesInput, setBulkSizesInput] = useState('');
  const [bulkColorsInput, setBulkColorsInput] = useState('');
  const [bulkSkuPrefix, setBulkSkuPrefix] = useState('');
  const [bulkDefaultPrice, setBulkDefaultPrice] = useState('');
  const [bulkDefaultStock, setBulkDefaultStock] = useState('0');
  const [variantKeyword, setVariantKeyword] = useState('');

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

  const handleBulkCreate = () => {
    addVariantsBulk?.(bulkSizesInput, bulkColorsInput, {
      skuPrefix: bulkSkuPrefix,
      defaultPrice: bulkDefaultPrice,
      defaultStock: bulkDefaultStock,
    });
  };

  const filteredVariantRows = useMemo(() => {
    const keyword = String(variantKeyword || '').trim().toLowerCase();
    const rows = variants.map((variant, index) => ({ variant, index }));

    return rows.filter(({ variant }) => {
      if (!keyword) return true;
      return [variant.size, variant.color, variant.sku]
        .map((v) => String(v || '').toLowerCase())
        .some((v) => v.includes(keyword));
    });
  }, [variants, variantKeyword]);

  const colorGroupCount = useMemo(
    () =>
      new Set(
        filteredVariantRows.map(({ variant }) => (variant.color || '').trim() || 'Không màu'),
      ).size,
    [filteredVariantRows],
  );

  return (
    <div className={CARD_CLASS + ' p-6'}>
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">Biến thể sản phẩm</span>
            {variants.length > 0 && (
              <Tag className="ml-1 border border-[#D7EBDD] bg-[#F3FBF6] text-[#2E7D55] rounded-full">
                {variants.length} biến thể
              </Tag>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Tạo và quản lý size, màu, SKU, giá và tồn kho cho từng biến thể.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            className="rounded-lg border-[#E6E8EC]"
          >
            {showQuickCreate ? 'Ẩn tạo nhanh' : 'Tạo nhanh size/màu'}
          </Button>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="mb-4 rounded-xl border border-[#E6E8EC] bg-[#FAFBFC] p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <Input
              size={CONTROL_SIZE}
              value={variantKeyword}
              onChange={(e) => setVariantKeyword(e.target.value)}
              placeholder="Tìm theo size, màu hoặc SKU"
              allowClear
              className="max-w-xl rounded-lg"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full border border-[#E6E8EC] bg-white px-3 py-1">
                Hiển thị <span className="font-semibold text-gray-700">{filteredVariantRows.length}</span> / {variants.length}
              </span>
              <span className="rounded-full border border-[#E6E8EC] bg-white px-3 py-1">
                Nhóm màu: <span className="font-semibold text-gray-700">{colorGroupCount}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick create section */}
      {showQuickCreate && (
        <QuickCreateVariantsSection
          bulkSizesInput={bulkSizesInput}
          setBulkSizesInput={setBulkSizesInput}
          bulkColorsInput={bulkColorsInput}
          setBulkColorsInput={setBulkColorsInput}
          bulkSkuPrefix={bulkSkuPrefix}
          setBulkSkuPrefix={setBulkSkuPrefix}
          bulkDefaultPrice={bulkDefaultPrice}
          setBulkDefaultPrice={setBulkDefaultPrice}
          bulkDefaultStock={bulkDefaultStock}
          setBulkDefaultStock={setBulkDefaultStock}
          bulkPreviewRows={bulkPreviewRows}
          bulkPreviewCount={bulkPreviewCount}
          bulkNewCount={bulkNewCount}
          bulkPreviewChips={bulkPreviewChips}
          bulkPreviewExtraCount={bulkPreviewExtraCount}
          onCreate={handleBulkCreate}
          loading={loading}
        />
      )}

      {/* Variants list */}
      {variants.length === 0 ? (
        <EmptyVariantsState onAddClick={addVariant} onQuickCreateClick={() => setShowQuickCreate(true)} />
      ) : (
        <VariantsList
          variants={filteredVariantRows}
          onUpdateVariant={updateVariant}
          onRemoveVariant={removeVariant}
          handleVariantImageSelect={handleVariantImageSelect}
          removeVariantImage={removeVariantImage}
        />
      )}
    </div>
  );
};

const QuickCreateVariantsSection = ({
  bulkSizesInput,
  setBulkSizesInput,
  bulkColorsInput,
  setBulkColorsInput,
  bulkSkuPrefix,
  setBulkSkuPrefix,
  bulkDefaultPrice,
  setBulkDefaultPrice,
  bulkDefaultStock,
  setBulkDefaultStock,
  bulkPreviewRows,
  bulkPreviewCount,
  bulkNewCount,
  bulkPreviewChips,
  bulkPreviewExtraCount,
  onCreate,
  loading,
}) => {
  return (
    <div className="mb-5 rounded-xl border border-[#E6E8EC] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-sm font-semibold text-gray-900">Tạo nhanh theo size / màu</p>
        <Button size="small" onClick={onCreate} disabled={loading} type="primary" className={PRIMARY_BTN_CLASS}>
          Tạo biến thể từ danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-1">Size</label>
          <Input
            size={CONTROL_SIZE}
            value={bulkSizesInput}
            onChange={(e) => setBulkSizesInput(e.target.value)}
            placeholder="S, M, L, XL"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-1">Màu sắc</label>
          <Input
            size={CONTROL_SIZE}
            value={bulkColorsInput}
            onChange={(e) => setBulkColorsInput(e.target.value)}
            placeholder="Đen, Trắng, Xanh"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {SIZE_PRESETS.map((size) => (
          <Button
            key={size}
            size="small"
            type="default"
            onClick={() => setBulkSizesInput((prev) => appendPreset(prev, size))}
            className="rounded-full border-[#E6E8EC]"
          >
            {size}
          </Button>
        ))}
        {COLOR_PRESETS.map((color) => (
          <Button
            key={color}
            size="small"
            type="default"
            onClick={() => setBulkColorsInput((prev) => appendPreset(prev, color))}
            className="rounded-full border-[#E6E8EC]"
          >
            {color}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-1">Tiền tố SKU</label>
          <Input
            size={CONTROL_SIZE}
            value={bulkSkuPrefix}
            onChange={(e) => setBulkSkuPrefix(e.target.value)}
            placeholder="VD: TSHIRT"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-1">Giá mặc định</label>
          <Input
            size={CONTROL_SIZE}
            value={bulkDefaultPrice}
            onChange={(e) => setBulkDefaultPrice(e.target.value)}
            placeholder="Để trống = giá cơ bản"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-gray-600 mb-1">Tồn kho mặc định</label>
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
        <div className="rounded-xl border border-[#E6E8EC] bg-[#FAFBFC] p-3">
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
                    : 'bg-[#F3FBF6] text-[#2E7D55] border-[#CDEBD9]'
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
  );
};

const EmptyVariantsState = ({ onAddClick, onQuickCreateClick }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-[#E6E8EC]">
      <div className="w-16 h-16 bg-[#F3FBF6] rounded-full flex items-center justify-center mx-auto mb-4">
        <Plus className="text-[#37A76B]" size={32} />
      </div>
      <p className="text-gray-600 font-medium mb-2">Chưa có biến thể nào</p>
      <p className="text-sm text-gray-500 mb-4">Thêm các biến thể khác nhau cho sản phẩm của bạn</p>
      <Button type="primary" icon={<Plus size={16} />} onClick={onAddClick}>
        Thêm biến thể đầu tiên
      </Button>
      <div className="mt-3">
        <Button type="default" onClick={onQuickCreateClick}>
          Hoặc tạo nhanh size / màu
        </Button>
      </div>
    </div>
  );
};

const VariantsList = ({ variants, onUpdateVariant, onRemoveVariant, handleVariantImageSelect, removeVariantImage }) => {
  return (
    <div className="space-y-3 max-h-[68vh] overflow-y-auto pr-1">
      {variants.map(({ variant, index: originalIndex }) => {
        const uploadInputId = `variant-upload-${String(variant.id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

        return (
        <div key={variant.id} className="rounded-xl border border-[#E6E8EC] bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Biến thể #{originalIndex + 1}</span>
              <Tag className="rounded-full border border-[#E6E8EC] bg-[#FAFBFC] text-gray-600">{variant.isActive ? 'Đang bật' : 'Đang tắt'}</Tag>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={variant.isActive}
                onChange={(checked) => onUpdateVariant(variant.id, { isActive: checked })}
                size="small"
              />
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                onClick={() => onRemoveVariant(variant.id)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Size</label>
              <Input
                size={CONTROL_SIZE}
                value={variant.size || ''}
                onChange={(e) => onUpdateVariant(variant.id, { size: e.target.value })}
                placeholder="Ví dụ: M, L, XL"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Màu</label>
              <Input
                size={CONTROL_SIZE}
                value={variant.color || ''}
                onChange={(e) => onUpdateVariant(variant.id, { color: e.target.value })}
                placeholder="Ví dụ: Đen, Trắng"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">SKU</label>
              <Input
                size={CONTROL_SIZE}
                value={variant.sku || ''}
                onChange={(e) => onUpdateVariant(variant.id, { sku: e.target.value })}
                placeholder="Mã SKU"
                className="rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Giá</label>
              <InputNumber
                min={0}
                size={CONTROL_SIZE}
                value={variant.price}
                onChange={(value) => onUpdateVariant(variant.id, { price: value ?? 0 })}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => (value || '').replace(/\$\s?|(,*)/g, '')}
                addonAfter="₫"
                style={{ width: '100%' }}
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Tồn kho</label>
              <InputNumber
                min={0}
                size={CONTROL_SIZE}
                value={variant.stock}
                onChange={(value) => onUpdateVariant(variant.id, { stock: value ?? 0 })}
                style={{ width: '100%' }}
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Ngưỡng cảnh báo</label>
              <InputNumber
                min={0}
                size={CONTROL_SIZE}
                value={variant.lowStockThreshold ?? 5}
                onChange={(value) => onUpdateVariant(variant.id, { lowStockThreshold: value ?? 5 })}
                style={{ width: '100%' }}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#E6E8EC] bg-[#FAFBFC] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="block text-[11px] font-medium text-gray-600 mb-1">Ảnh biến thể</span>
                <span className="text-xs text-gray-500">
                  {variant.images?.length || 0} ảnh cho biến thể này
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <label htmlFor={uploadInputId} className="inline-flex cursor-pointer">
                  <span className="inline-flex items-center justify-center rounded-lg border border-[#E6E8EC] bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#37A76B] hover:text-[#37A76B] transition-colors">
                    Thêm ảnh
                  </span>
                </label>
                <input
                  id={uploadInputId}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleVariantImageSelect?.(variant.id, e)}
                  className="hidden"
                />
                {variant.images?.length > 0 && (
                  <Button
                    size="small"
                    danger
                    type="text"
                    onClick={() => removeVariantImage?.(variant.id, variant.images[0]?.tempId)}
                  >
                    Xóa ảnh đầu
                  </Button>
                )}
              </div>
            </div>

            {variant.images?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {variant.images.map((img) => (
                  <div key={img.tempId || img.id} className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#E6E8EC] bg-white">
                    <img src={img.preview || img.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeVariantImage?.(variant.id, img.tempId)}
                      className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default VariantsSection;
