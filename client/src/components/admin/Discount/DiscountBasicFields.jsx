import { Percent, DollarSign, RefreshCw } from 'lucide-react';

const DiscountBasicFields = ({
  formData,
  isEdit,
  lockFlashSale,
  flashSaleMode = 'regular',
  onChange,
  onGenerateCode,
  realtimeValidation,
  previewData,
  realtimeStatus,
  isSubmitting,
}) => {
  const formatPreview = (value) => {
    const num = Number(value);
    if (!num) return null;
    return `${num.toLocaleString('vi-VN')} đ`;
  };

  const isDedicatedFlash = flashSaleMode === 'flash';
  const showFlashPanel = !lockFlashSale && (flashSaleMode === 'flash' || formData.isFlashSale);

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {isDedicatedFlash ? 'Thông tin Flash Sale' : 'Thông tin cơ bản'}
            </h2>
            {isDedicatedFlash && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">FLASH</span>
            )}
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            realtimeStatus === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : realtimeStatus === 'UPCOMING'
                ? 'bg-blue-100 text-blue-700'
                : realtimeStatus === 'EXPIRED'
                  ? 'bg-red-100 text-red-700'
                  : realtimeStatus === 'INACTIVE'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-amber-100 text-amber-700'
          }`}>
            {realtimeStatus}
          </span>
        </div>

        {isDedicatedFlash && (
          <p className="mb-4 text-xs text-gray-600">Thiết lập chương trình Flash Sale với thời gian và phạm vi sản phẩm cụ thể.</p>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className={`space-y-5 ${showFlashPanel ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {isDedicatedFlash ? 'Mã Flash Sale' : 'Mã giảm giá'} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-2.5">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => onChange('code', e.target.value.toUpperCase())}
                  placeholder="VD: TBV2UI4Z"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm font-medium uppercase outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                  disabled={isEdit}
                />
                {!isEdit && (
                  <button
                    type="button"
                    onClick={onGenerateCode}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50"
                    aria-label="Sinh mã tự động"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder={isDedicatedFlash ? 'Mô tả chương trình Flash Sale...' : 'Mô tả về mã giảm giá này...'}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {showFlashPanel && (
            <div className="lg:col-span-4">
              <div className="h-full rounded-xl border border-amber-300 bg-amber-50/80 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Flash Sale</p>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">ON</span>
                </div>

                {lockFlashSale ? (
                  <div className="rounded-lg border border-amber-300 bg-white/80 px-3 py-2 text-sm font-medium text-amber-900">
                    Bạn đang ở chế độ tạo Flash Sale.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChange('isFlashSale', !formData.isFlashSale)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                    disabled={isSubmitting}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Bật/tắt chế độ Flash Sale</p>
                      <p className="text-xs text-gray-600 mt-1">Dùng cho chiến dịch giảm giá ngắn hạn.</p>
                    </div>
                    <span
                      className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
                        formData.isFlashSale ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                          formData.isFlashSale ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Loại giảm giá</h2>

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => onChange('discountType', 'percentage')}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
              formData.discountType === 'percentage'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="w-9 h-9 rounded-xl bg-gray-100 inline-flex items-center justify-center">
              <Percent size={18} className="text-gray-500" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">Phần trăm (%)</span>
              <span className="block text-xs text-gray-500 mt-1">VD: Giảm 10%</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChange('discountType', 'fixedAmount')}
            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
              formData.discountType === 'fixedAmount'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="w-9 h-9 rounded-xl bg-gray-100 inline-flex items-center justify-center">
              <DollarSign size={18} className="text-blue-600" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">Số tiền cố định</span>
              <span className="block text-xs text-gray-500 mt-1">VD: Giảm 50.000đ</span>
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formData.discountType === 'percentage' ? 'Phần trăm giảm' : 'Số tiền giảm'} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-[1fr_auto] rounded-xl border border-gray-300 overflow-hidden">
              <input
                type="number"
                value={formData.discountType === 'percentage' ? formData.percentage : formData.fixedAmount}
                onChange={(e) => onChange(formData.discountType === 'percentage' ? 'percentage' : 'fixedAmount', e.target.value)}
                min="0"
                step="1"
                className="h-10 px-3 outline-none text-sm"
                disabled={isSubmitting}
              />
              <span className="h-10 min-w-14 px-3 border-l border-gray-300 inline-flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                {formData.discountType === 'percentage' ? '%' : 'VND'}
              </span>
            </div>
            {formData.discountType === 'fixedAmount' && Boolean(formatPreview(formData.fixedAmount)) && (
              <p className="text-xs text-gray-500 mt-1">= {formatPreview(formData.fixedAmount)}</p>
            )}
            {realtimeValidation.errors.percentage && (
              <p className="text-xs text-red-600 mt-1">{realtimeValidation.errors.percentage}</p>
            )}
            {realtimeValidation.errors.fixedAmount && (
              <p className="text-xs text-red-600 mt-1">{realtimeValidation.errors.fixedAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Giảm tối đa</label>
            <div className="grid grid-cols-[1fr_auto] rounded-xl border border-gray-300 overflow-hidden">
              <input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => onChange('maxDiscountAmount', e.target.value)}
                min="0"
                step="1"
                placeholder="Không giới hạn"
                className="h-10 px-3 outline-none text-sm"
                disabled={isSubmitting}
              />
              <span className="h-10 min-w-14 px-3 border-l border-gray-300 inline-flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                VND
              </span>
            </div>
            {realtimeValidation.errors.maxDiscountAmount && (
              <p className="text-xs text-red-600 mt-1">{realtimeValidation.errors.maxDiscountAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Đơn hàng tối thiểu</label>
            <div className="grid grid-cols-[1fr_auto] rounded-xl border border-gray-300 overflow-hidden">
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => onChange('minOrderAmount', e.target.value)}
                min="0"
                step="1"
                className="h-10 px-3 outline-none text-sm"
                disabled={isSubmitting}
              />
              <span className="h-10 min-w-14 px-3 border-l border-gray-300 inline-flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                VND
              </span>
            </div>
            {realtimeValidation.warnings.minOrderAmount && (
              <p className="text-xs text-amber-700 mt-1">{realtimeValidation.warnings.minOrderAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Giới hạn sử dụng</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => onChange('usageLimit', e.target.value)}
              min="1"
              step="1"
              placeholder="Không giới hạn"
              className="h-10 w-full px-3 rounded-xl border border-gray-300 outline-none text-sm"
              disabled={isSubmitting}
            />
            {realtimeValidation.errors.usageLimit && (
              <p className="text-xs text-red-600 mt-1">{realtimeValidation.errors.usageLimit}</p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-sm font-semibold text-blue-900 mb-1">Preview kết quả giảm giá</p>
          <p className="text-xs text-blue-800">Đơn hàng mẫu {previewData.sampleSubtotal.toLocaleString('vi-VN')}đ</p>
          <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100">
              <p className="text-xs text-gray-500">Giảm</p>
              <p className="font-semibold text-slate-900">{previewData.discountAmount.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 border border-blue-100 sm:col-span-2">
              <p className="text-xs text-gray-500">Thanh toán</p>
              <p className="font-semibold text-slate-900">{previewData.finalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Thời gian hiệu lực</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="h-10 w-full px-3 rounded-xl border border-gray-300 outline-none text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày kết thúc <span className="text-gray-400 font-semibold">(tùy chọn)</span>
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="h-10 w-full px-3 rounded-xl border border-gray-300 outline-none text-sm"
              disabled={isSubmitting}
            />
            {realtimeValidation.errors.endDate && (
              <p className="text-xs text-red-600 mt-1">{realtimeValidation.errors.endDate}</p>
            )}
            {formData.isFlashSale && realtimeValidation.warnings.flashSale && !realtimeValidation.errors.endDate && (
              <p className="text-xs text-amber-700 mt-1">{realtimeValidation.warnings.flashSale}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DiscountBasicFields;
