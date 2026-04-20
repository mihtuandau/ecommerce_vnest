import { Zap } from 'lucide-react';


const FlashSaleToggle = ({ isFlashSale, onToggle }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
    <div
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none ${
        isFlashSale
          ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-red-50'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      {}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isFlashSale ? 'bg-orange-400' : 'bg-gray-200'
          }`}
        >
          <Zap
            size={18}
            className={isFlashSale ? 'text-white fill-white' : 'text-gray-400'}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Flash Sale</p>
          <p className="text-xs text-gray-500">
            Hiển thị section Flash Sale nổi bật trên trang chủ kèm đếm ngược thời gian
          </p>
        </div>
      </div>

      {}
      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          isFlashSale ? 'bg-orange-400' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            isFlashSale ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  </div>
);

export default FlashSaleToggle;






