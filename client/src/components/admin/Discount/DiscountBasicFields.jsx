import { RefreshCw, UploadCloud, Trash2, Image as ImageIcon, Flame, Ticket, Percent, DollarSign, Tag } from 'lucide-react';

const Field = ({ label, hint, required, error, children }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}{required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);

const inputCls = 'h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-400';

const DiscountBasicFields = ({
  formData,
  isEdit,
  lockFlashSale,
  onChange,
  onGenerateCode,
  realtimeValidation,
  previewData,
  realtimeStatus,
  isSubmitting,
  imagePreview,
  uploading,
  onImageUpload,
  onImageRemove,
}) => {
  const isFlash = formData.isFlashSale;

  return (
    <div className="space-y-5">

      {}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Loại hình</span>
          {realtimeStatus && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              realtimeStatus === 'ACTIVE'   ? 'bg-green-50 text-green-600 border-green-200' :
              realtimeStatus === 'UPCOMING' ? 'bg-blue-50 text-blue-600 border-blue-200'   :
              realtimeStatus === 'EXPIRED'  ? 'bg-red-50 text-red-500 border-red-200'      :
                                              'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              {realtimeStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100">
          {[
            { value: false, icon: <Ticket size={16} />, label: 'Voucher', sub: 'Khách nhập mã' },
            { value: true,  icon: <Flame  size={16} />, label: 'Flash Sale', sub: 'Tự động áp dụng' },
          ].map(({ value, icon, label, sub }) => {
            const active = formData.isFlashSale === value;
            const disabled = lockFlashSale && formData.isFlashSale !== value;
            return (
              <button
                key={String(value)}
                type="button"
                disabled={isEdit || disabled}
                onClick={() => !isEdit && !lockFlashSale && onChange('isFlashSale', value)}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  active
                    ? value ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <div className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                  active ? (value ? 'bg-orange-100' : 'bg-blue-100') : 'bg-gray-100'
                }`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{label}</p>
                  <p className="text-[11px] mt-0.5 opacity-70">{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin</p>

        <div className="grid grid-cols-12 gap-3">

          {}
          <div className="col-span-12 md:col-span-5">
            <Field label={isFlash ? 'Mã chiến dịch' : 'Mã giảm giá'} required error={realtimeValidation?.errors?.code}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => onChange('code', e.target.value.toUpperCase())}
                  placeholder={isFlash ? 'FLASH-HE-2024' : 'SUMMER2024'}
                  className={`${inputCls} flex-1 font-mono font-semibold`}
                  disabled={isEdit}
                />
                {!isEdit && (
                  <button
                    type="button"
                    onClick={onGenerateCode}
                    title="Tạo mã tự động"
                    className="h-9 w-9 shrink-0 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </Field>
          </div>

          {}
          <div className="col-span-12 md:col-span-7">
            <Field label="Mô tả ngắn">
              <input
                type="text"
                value={formData.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="Giảm 10% cho đơn từ 500k..."
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {}
        <Field label="Ảnh banner">
          <div className="relative h-28 rounded-md border border-dashed border-gray-200 bg-gray-50 overflow-hidden group">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="banner" className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <label className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:text-blue-600 shadow-sm">
                    <UploadCloud size={15} />
                    <input type="file" className="hidden" accept="image}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Giá trị giảm</p>

        {}
        <div className="flex rounded-md border border-gray-200 overflow-hidden w-fit">
          {[
            { key: 'percentage',  icon: <Percent size={13} />, label: 'Phần trăm (%)' },
            { key: 'fixedAmount', icon: <DollarSign size={13} />, label: 'Số tiền (đ)' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange('discountType', key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold transition ${
                formData.discountType === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {}
          <Field label="Mức giảm" required>
            <div className="relative">
              <input
                type="number"
                value={formData.discountType === 'percentage' ? formData.percentage : formData.fixedAmount}
                onChange={(e) => onChange(formData.discountType === 'percentage' ? 'percentage' : 'fixedAmount', e.target.value)}
                min="0"
                placeholder="0"
                className={`${inputCls} pr-10 font-bold`}
                disabled={isSubmitting}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                {formData.discountType === 'percentage' ? '%' : 'đ'}
              </span>
            </div>
          </Field>

          {}
          {!isFlash && (
            <>
              <Field label="Giảm tối đa">
                <div className="relative">
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => onChange('maxDiscountAmount', e.target.value)}
                    placeholder="Không giới hạn"
                    className={`${inputCls} pr-6`}
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-300">đ</span>
                </div>
              </Field>
              <Field label="Đơn tối thiểu">
                <div className="relative">
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => onChange('minOrderAmount', e.target.value)}
                    placeholder="0"
                    className={`${inputCls} pr-6`}
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-300">đ</span>
                </div>
              </Field>
            </>
          )}

          {}
          {isFlash && (
            <div className="md:col-span-2 flex items-center gap-2 rounded-md bg-orange-50 border border-orange-100 px-3 py-2">
              <Flame size={14} className="text-orange-400 shrink-0" />
              <p className="text-[11px] text-orange-600">Flash Sale giảm thẳng vào giá — không cần điều kiện đơn hàng.</p>
            </div>
          )}
        </div>

        {}
        {!isFlash && previewData && (
          <div className="flex items-center justify-between rounded-md bg-gray-900 px-4 py-3 text-white text-sm">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Khách được giảm</p>
              <p className="font-bold text-red-400">−{previewData.discountAmount.toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Thanh toán còn</p>
              <p className="font-bold text-green-400">{previewData.finalAmount.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thời gian & Giới hạn</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Bắt đầu" required>
            <input type="datetime-local" value={formData.startDate} onChange={(e) => onChange('startDate', e.target.value)} className={inputCls} disabled={isSubmitting} />
          </Field>

          <Field label="Kết thúc" required={isFlash} error={realtimeValidation?.errors?.endDate}>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className={`${inputCls} ${realtimeValidation?.errors?.endDate ? 'border-red-300 bg-red-50' : ''}`}
              disabled={isSubmitting}
            />
          </Field>

          <Field label={isFlash ? 'Giới hạn SL bán' : 'Giới hạn lượt dùng'}>
            <div className="relative">
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => onChange('usageLimit', e.target.value)}
                min="0"
                placeholder="Không giới hạn"
                className={`${inputCls} pr-7`}
                disabled={isSubmitting}
              />
              <Tag size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
};

export default DiscountBasicFields;






