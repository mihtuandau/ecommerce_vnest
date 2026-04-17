import React from 'react';
import { Button, Switch, Input, InputNumber, Tooltip } from 'antd';
import { Plus, Layers, Trash2, Upload, AlertCircle } from 'lucide-react';

const StepProductVariants = ({ 
  variants, 
  addVariant, 
  removeVariant, 
  updateVariant, 
  handleVariantImageSelect, 
  removeVariantImage 
}) => {
  return (
    <div className="min-h-[360px] rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
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
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center sm:p-10">
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
          {variants.map((v, idx) => (
            <div key={v.id || idx} className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 sm:p-5">
              <div className="mb-4 flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs">#{idx + 1}</div>
                  Biến thể {idx + 1}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
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

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-700">Ảnh riêng của biến thể</label>
                  <div className="relative">
                    <Button type="dashed" size="small" icon={<Upload size={14}/>} className="flex items-center gap-1">
                      Thêm ảnh
                    </Button>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleVariantImageSelect(v.id, e)}
                    />
                  </div>
                </div>

                {v.images && v.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {v.images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <img src={img.url || img.preview} alt="V" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(v.id, idx)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepProductVariants;
