import { Tag, Upload, X } from 'lucide-react';

/**
 * Card 1 — thông tin cơ bản:
 * - Left: mã giảm giá, mô tả, loại + giá trị, thời gian
 * - Right: ảnh banner upload
 *
 * Props:
 *  formData   – object chứa toàn bộ giá trị form
 *  isEdit     – boolean edit mode
 *  imagePreview – string | null (data URL hoặc URL ảnh)
 *  uploading  – boolean đang upload
 *  onChange   – (field, value) => void
 *  onImageUpload – (event) => void
 *  onImageRemove – () => void
 */
const DiscountBasicFields = ({
  formData,
  isEdit,
  imagePreview,
  uploading,
  onChange,
  onImageUpload,
  onImageRemove,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
    <div className="grid grid-cols-5 gap-8">

      {/* ── LEFT — thông tin cơ bản ───────────────────────────────────── */}
      <div className="col-span-3 space-y-5">

        {/* Mã giảm giá */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Mã giảm giá <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.code}
              onChange={(e) => onChange('code', e.target.value)}
              placeholder="VD: SUMMER2024"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none uppercase tracking-widest font-mono text-sm"
              disabled={isEdit}
            />
          </div>
          {isEdit && (
            <p className="text-xs text-gray-400 mt-1">Mã không thể thay đổi sau khi tạo</p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Mô tả về chương trình khuyến mãi..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm resize-none"
          />
        </div>

        {/* Loại + giá trị */}
        <div className="grid grid-cols-2 gap-4">
          {/* Loại giảm giá */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại giảm giá <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'percentage',  label: 'Phần trăm (%)',    desc: 'Theo tỉ lệ %' },
                { value: 'fixedAmount', label: 'Số tiền cố định',  desc: 'Trực tiếp (VNĐ)' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.discountType === opt.value
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="discountType"
                    value={opt.value}
                    checked={formData.discountType === opt.value}
                    onChange={(e) => onChange('discountType', e.target.value)}
                    className="accent-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Giá trị */}
          <div>
            {formData.discountType === 'percentage' ? (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phần trăm <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => onChange('percentage', e.target.value)}
                    placeholder="10"
                    min="1" max="100" step="0.01"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                  <span className="text-2xl font-bold text-gray-300">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Từ 1% đến 100%</p>
              </>
            ) : (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số tiền giảm <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.fixedAmount}
                    onChange={(e) => onChange('fixedAmount', e.target.value)}
                    placeholder="50000"
                    min="1" step="1000"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  />
                  <span className="text-sm font-bold text-gray-400">VNĐ</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày kết thúc</label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Để trống = không giới hạn</p>
          </div>
        </div>

      </div>{/* end LEFT */}

      {/* ── RIGHT — ảnh banner ────────────────────────────────────────── */}
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Ảnh banner khuyến mãi
        </label>

        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow"
              disabled={uploading}
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors h-64 flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                  <p className="text-sm text-gray-500">Đang tải lên...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-300" />
                  <p className="text-sm text-gray-500">Click để chọn ảnh</p>
                  <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
                </>
              )}
            </label>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-1.5">Hiển thị trên card khuyến mãi trang chủ</p>
      </div>{/* end RIGHT */}

    </div>
  </div>
);

export default DiscountBasicFields;
