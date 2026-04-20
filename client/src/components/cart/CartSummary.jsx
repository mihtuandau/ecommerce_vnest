import Button from "../common/Button";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const CartSummary = ({
  total,
  selectedCount,
  totalCount,
  formatPrice,
  onCheckout,
  discount = 0,
  promotionTitle = "Khuyến mãi",
}) => {
  const totalBeforeDiscount = total + discount;

  return (
    <div className="bg-white border border-gray-100 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="p-8">
        {selectedCount !== undefined && totalCount !== undefined && (
          <div className="mb-8 pb-4 border-b border-gray-50 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-800">Sản phẩm đã chọn</span>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-slate-800">{selectedCount}</span>{" "}
              / {totalCount}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="pt-2">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-base font-semibold text-slate-800">
                Tổng thanh toán
              </span>
              <span className="text-3xl font-semibold text-slate-800 font-inter tracking-tighter">
                {total === 0 ? "0 đ" : formatPrice(total)}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 text-right mb-1">* Chưa bao gồm phí vận chuyển và thuế VAT</p>
            <div className={`text-[11px] font-semibold text-center py-2 px-3 rounded sm ${total >= 500000 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-gray-400'}`}>
              {total >= 500000 
                ? 'Đơn hàng của bạn đã được MIỄN PHÍ VẬN CHUYỂN' 
                : `Mua thêm ${formatPrice(Math.max(0, 500000 - total))} để được MIỄN PHÍ VẬN CHUYỂN`}
            </div>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0}
          className="w-full bg-black hover:bg-neutral-800 text-white py-4 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 rounded-none h-14"
        >
          Tiến hành thanh toán
        </Button>

      
      </div>
    </div>
  );
};

export default CartSummary;






