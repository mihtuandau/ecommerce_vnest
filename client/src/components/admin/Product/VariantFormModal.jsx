import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';
import VariantFormFields from './VariantFormFields';
import VariantImageManager from './VariantImageManager';

const VariantFormModal = ({ isOpen, onClose, variant, productId, onSuccess }) => {
  const isEditing = !!variant?.id;
  const [mode, setMode] = useState('single'); // single | bulk (bulk chỉ dùng khi tạo mới)
  const [formData, setFormData] = useState({
    size: '',
    color: '',
    sku: '',
    price: '',
    stock: '',
  });
  const [productBasePrice, setProductBasePrice] = useState(null);

  // Bulk mode fields
  const [bulkSizes, setBulkSizes] = useState('');
  const [bulkColors, setBulkColors] = useState('');
  const [bulkSkuPrefix, setBulkSkuPrefix] = useState('');
  const [bulkMode, setBulkMode] = useState('rows'); // rows | matrix
  const [bulkRowsText, setBulkRowsText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingImages, setDeletingImages] = useState([]);
  const [selectedExistingImages, setSelectedExistingImages] = useState([]);
  const [selectedNewImages, setSelectedNewImages] = useState([]);

  // Initialize form data
  useEffect(() => {
    // editing variant -> luôn single mode
    setMode(variant?.id ? 'single' : 'single');
    if (variant) {
      setFormData({
        size: variant.size || '',
        color: variant.color || '',
        sku: variant.sku || '',
        price: variant.price ?? '',
        stock: variant.stock ?? '',
      });
      setExistingImages(variant.images || []);
    } else {
      setFormData({
        size: '',
        color: '',
        sku: '',
        price: '',
        stock: '',
      });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSelectedExistingImages([]);
    setSelectedNewImages([]);
    setBulkSizes('');
    setBulkColors('');
    setBulkSkuPrefix('');
    setBulkMode('rows');
    setBulkRowsText('');
  }, [variant, isOpen]);

  // Fetch basePrice để default giá biến thể nếu user bỏ trống
  useEffect(() => {
    const run = async () => {
      if (!isOpen || !productId) return;
      try {
        const res = await productService.getOne(productId);
        const p = res?.data || res;
        setProductBasePrice(p?.basePrice ?? null);
      } catch {
        setProductBasePrice(null);
      }
    };
    run();
  }, [isOpen, productId]);

  const parseList = (text) =>
    String(text || '')
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const parseRows = (text) => {
    const lines = String(text || '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));

    // Format mỗi dòng:
    // size,color,sku,price,stock  (csv)
    // cho phép thiếu cột ở cuối
    return lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      const [size, color, sku, price, stock] = parts;
      return {
        size: size || '',
        color: color || '',
        sku: sku || '',
        price: price ?? '',
        stock: stock ?? '',
      };
    });
  };

  const bulkSizeList = parseList(bulkSizes);
  const bulkColorList = parseList(bulkColors);
  const bulkPreviewCount = Math.min(1000, (bulkSizeList.length || 1) * (bulkColorList.length || 1));

  const buildSku = (prefix, size, color) => {
    const p = String(prefix || '').trim();
    if (!p) return '';
    const safe = (v) => String(v || '').trim().replace(/\s+/g, '-');
    const parts = [p, safe(size), safe(color)].filter(Boolean);
    return parts.join('-').toUpperCase();
  };

  const toNumberOrDefault = (value, defaultValue, label) => {
    if (value === '' || value === null || value === undefined) {
      if (defaultValue === undefined) return undefined;
      const d = Number(defaultValue);
      if (!Number.isFinite(d) || d < 0) throw new Error(`${label} không hợp lệ`);
      return d;
    }
    const v = Number(value);
    if (!Number.isFinite(v) || v < 0) throw new Error(`${label} không hợp lệ`);
    return v;
  };

  // Handle file select
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = selectedFiles.length + existingImages.length;
    const availableSlots = 5 - currentTotal;
    
    if (files.length === 0) return;
    
    if (currentTotal >= 5) {
      notify.error('Đã đủ 5 ảnh, vui lòng xóa bớt để thêm mới');
      e.target.value = '';
      return;
    }
    
    if (files.length > availableSlots) {
      notify.warning(`Chỉ có thể thêm ${availableSlots} ảnh nữa (tối đa 5 ảnh)`);
      const allowedFiles = files.slice(0, availableSlots);
      setSelectedFiles(prev => [...prev, ...allowedFiles]);
      const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    } else {
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      notify.success(`Đã thêm ${files.length} ảnh`);
    }
    
    e.target.value = '';
  };

  // Remove new image
  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Delete existing image
  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;

    setDeletingImages(prev => [...prev, imageId]);
    try {
      await productService.deleteVariantImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedExistingImages(prev => prev.filter(id => id !== imageId));
      notify.success('Đã xóa ảnh');
    } catch (error) {
      notify.error('Xóa ảnh thất bại');
    } finally {
      setDeletingImages(prev => prev.filter(id => id !== imageId));
    }
  };

  // Delete selected existing images
  const handleDeleteSelectedExisting = async () => {
    if (selectedExistingImages.length === 0) return;
    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedExistingImages.length} ảnh đã chọn?`)) return;

    setDeletingImages(selectedExistingImages);
    try {
      await Promise.all(
        selectedExistingImages.map(id => productService.deleteVariantImage(id))
      );
      setExistingImages(prev => prev.filter(img => !selectedExistingImages.includes(img.id)));
      notify.success(`Đã xóa ${selectedExistingImages.length} ảnh`);
      setSelectedExistingImages([]);
    } catch (error) {
      notify.error('Có lỗi khi xóa ảnh');
    } finally {
      setDeletingImages([]);
    }
  };

  // Delete selected new images
  const handleDeleteSelectedNew = () => {
    if (selectedNewImages.length === 0) return;
    
    selectedNewImages.forEach(index => {
      URL.revokeObjectURL(previewUrls[index]);
    });
    
    setSelectedFiles(prev => prev.filter((_, i) => !selectedNewImages.includes(i)));
    setPreviewUrls(prev => prev.filter((_, i) => !selectedNewImages.includes(i)));
    setSelectedNewImages([]);
    notify.success(`Đã xóa ${selectedNewImages.length} ảnh`);
  };

  // Toggle select existing image
  const toggleSelectExisting = (imageId) => {
    setSelectedExistingImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Toggle select new image
  const toggleSelectNew = (index) => {
    setSelectedNewImages(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Select all existing images
  const selectAllExisting = () => {
    if (selectedExistingImages.length === existingImages.length) {
      setSelectedExistingImages([]);
    } else {
      setSelectedExistingImages(existingImages.map(img => img.id));
    }
  };

  // Select all new images
  const selectAllNew = () => {
    if (selectedNewImages.length === selectedFiles.length) {
      setSelectedNewImages([]);
    } else {
      setSelectedNewImages(selectedFiles.map((_, i) => i));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bulk mode: tạo nhiều variants theo size/màu
    if (!isEditing && mode === 'bulk') {
      let variantsToCreate = [];

      if (bulkMode === 'rows') {
        const rows = parseRows(bulkRowsText);
        if (rows.length === 0) {
          return notify.error('Vui lòng nhập ít nhất 1 dòng biến thể');
        }
        variantsToCreate = rows.map((r) => ({
          size: r.size,
          color: r.color,
          sku: r.sku,
          price: r.price,
          stock: r.stock,
        }));
      } else {
        const sizes = parseList(bulkSizes);
        const colors = parseList(bulkColors);

        // Theo yêu cầu: size/màu có thể nhập hoặc không
        const normalizedSizes = sizes.length ? sizes : [''];
        const normalizedColors = colors.length ? colors : [''];

        variantsToCreate = [];
        for (const s of normalizedSizes) {
          for (const c of normalizedColors) {
            variantsToCreate.push({
              size: s,
              color: c,
              sku: buildSku(bulkSkuPrefix, s, c),
              price: formData.price,
              stock: formData.stock,
            });
          }
        }
      }

      if (variantsToCreate.length > 100) {
        return notify.error('Tối đa 100 biến thể/lần. Vui lòng giảm số lượng size/màu.');
      }

      setLoading(true);
      try {
        let successCount = 0;
        const errors = [];

        for (const item of variantsToCreate) {
          let price, stock;
          try {
            // rows mode: từng dòng có thể có price/stock riêng, nếu trống thì default
            price = toNumberOrDefault(item.price, productBasePrice ?? 0, 'Giá');
            stock = toNumberOrDefault(item.stock, 0, 'Tồn kho');
          } catch (err) {
            errors.push(
              `${item.size || '—'} - ${item.color || '—'}: ${err?.message || 'Dữ liệu không hợp lệ'}`
            );
            continue;
          }

          const payload = {
            size: item.size?.trim() ? item.size.trim() : undefined,
            color: item.color?.trim() ? item.color.trim() : undefined,
            price,
            stock,
            sku: item.sku?.trim() ? item.sku.trim() : undefined,
          };

          try {
            await productService.addVariant(productId, payload);
            successCount += 1;
          } catch (error) {
            const msg =
              error?.response?.data?.message ||
              error?.message ||
              'Tạo biến thể thất bại';
            errors.push(`${payload.size || '—'} - ${payload.color || '—'}: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
          }
        }

        if (successCount > 0) notify.success(`Đã tạo ${successCount}/${variantsToCreate.length} biến thể`);
        if (errors.length > 0) {
          notify.warning(`Có ${errors.length} biến thể lỗi (thường do trùng size/màu). Mở console để xem chi tiết.`);
          // eslint-disable-next-line no-console
          console.warn('Bulk add variant errors:', errors);
        }

        onSuccess();
        onClose();
      } finally {
        setLoading(false);
      }

      return;
    }

    // Single mode: size/màu không bắt buộc

    setLoading(true);
    try {
      let variantId = variant?.id;

      const payload = {
        ...formData,
        size: formData.size?.trim() ? formData.size.trim() : undefined,
        color: formData.color?.trim() ? formData.color.trim() : undefined,
        sku: formData.sku?.trim() ? formData.sku.trim() : undefined,
        price: toNumberOrDefault(formData.price, productBasePrice ?? 0, 'Giá'),
        stock: toNumberOrDefault(formData.stock, 0, 'Tồn kho'),
      };

      // Create or update variant
      if (variant) {
        await productService.updateVariant(variant.id, payload);
        notify.success('Đã cập nhật biến thể');
      } else {
        const response = await productService.addVariant(productId, payload);
        variantId = response?.data?.id || response?.id;
        notify.success('Đã thêm biến thể');
      }

      // Upload new images if any
      if (selectedFiles.length > 0 && variantId) {
        await productService.uploadVariantImages(variantId, selectedFiles, {
          isPrimary: existingImages.length === 0 && selectedFiles.length === 1,
        });
        notify.success('Đã upload ảnh');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      notify.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {variant ? 'Chỉnh sửa biến thể' : (mode === 'bulk' ? 'Thêm biến thể hàng loạt' : 'Thêm biến thể mới')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!isEditing && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'single' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white'
                }`}
              >
                Thêm 1 biến thể
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'bulk' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white'
                }`}
              >
                Thêm hàng loạt
              </button>
            </div>
          )}

          {/* Form Fields */}
          {mode === 'single' && (
            <VariantFormFields formData={formData} onChange={handleChange} />
          )}

          {!isEditing && mode === 'bulk' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
                <button
                  type="button"
                  onClick={() => setBulkMode('rows')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    bulkMode === 'rows' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  Nhập từng dòng
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMode('matrix')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    bulkMode === 'matrix' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  Tạo theo tổ hợp (Size × Màu)
                </button>
              </div>

              {bulkMode === 'rows' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh sách biến thể (mỗi dòng)
                  </label>
                  <textarea
                    value={bulkRowsText}
                    onChange={(e) => setBulkRowsText(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder={
                      "Format: size,color,sku,price,stock\n" +
                      "Ví dụ:\n" +
                      "S,Xanh,LV-S-XANH,200000,10\n" +
                      "M,Xanh,LV-M-XANH,,20   # để trống price sẽ lấy basePrice\n" +
                      "L,Đen,LV-L-DEN,250000,5"
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Bạn có thể bỏ trống size/màu/sku/price/stock. Price trống sẽ lấy basePrice, stock trống mặc định 0.
                  </p>
                </div>
              )}

              {bulkMode === 'matrix' && (
                <>
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh sách Size (tuỳ chọn)
                  </label>
                  <textarea
                    value={bulkSizes}
                    onChange={(e) => setBulkSizes(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: S, M, L, XL hoặc mỗi dòng 1 size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh sách Màu (tuỳ chọn)
                  </label>
                  <textarea
                    value={bulkColors}
                    onChange={(e) => setBulkColors(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Đen, Trắng, Xanh hoặc mỗi dòng 1 màu"
                  />
                </div>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU prefix (tuỳ chọn)</label>
                <input
                  type="text"
                  value={bulkSkuPrefix}
                  onChange={(e) => setBulkSkuPrefix(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: VNEST-TSHIRT (hệ thống sẽ tự ghép size/màu)"
                />
                <p className="mt-1 text-xs text-gray-500">Nếu để trống thì SKU sẽ không tự tạo.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá chung (để trống sẽ lấy giá sản phẩm)
                  </label>
                  <input
                    type="number"
                    value={formData.price ?? ''}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={productBasePrice != null ? String(productBasePrice) : '0'}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn kho chung (để trống mặc định 0)
                  </label>
                  <input
                    type="number"
                    value={formData.stock ?? ''}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                <div>
                  Sẽ tạo khoảng <span className="font-semibold">{bulkPreviewCount}</span> biến thể (Size × Màu).
                </div>
                <div>
                  Nếu bạn để trống Size hoặc Màu, hệ thống sẽ tạo biến thể không có thuộc tính đó.
                </div>
                <div>
                  Nếu trùng Size/Màu đã tồn tại, backend sẽ báo lỗi cho biến thể đó.
                </div>
              </div>
                </>
              )}
            </div>
          )}

          {/* Image Manager */}
          {mode === 'single' && (
            <VariantImageManager
              existingImages={existingImages}
              previewUrls={previewUrls}
              selectedExistingImages={selectedExistingImages}
              selectedNewImages={selectedNewImages}
              deletingImages={deletingImages}
              onSelectExisting={toggleSelectExisting}
              onSelectNew={toggleSelectNew}
              onSelectAllExisting={selectAllExisting}
              onSelectAllNew={selectAllNew}
              onDeleteExisting={handleDeleteExistingImage}
              onDeleteSelectedExisting={handleDeleteSelectedExisting}
              onDeleteNew={handleRemoveNewImage}
              onDeleteSelectedNew={handleDeleteSelectedNew}
              onFileSelect={handleFileSelect}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : variant ? 'Cập nhật' : (mode === 'bulk' ? 'Tạo biến thể' : 'Thêm biến thể')}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default VariantFormModal;
