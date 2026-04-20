import {
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaQrcode,
} from "react-icons/fa";
import Input from "../common/Input";

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div className="bg-white p-2 sm:p-0">
      <div className="space-y-4">
        {/* COD Method - PRIORITIZED */}
        <label className={`flex items-center gap-4 p-5 border transition-all cursor-pointer rounded-none ${paymentMethod === "CASH" ? "border-black bg-neutral-50" : "border-gray-100 hover:border-gray-300"}`}>
          <div className="flex-shrink-0 flex items-center justify-center">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH"
              checked={paymentMethod === "CASH"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="w-4 h-4 text-black focus:ring-black accent-black"
            />
          </div>
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-none border border-gray-100 shrink-0">
             <FaMoneyBillWave className="text-xl text-black" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-black leading-none mb-1.5">
              Thanh toán khi nhận hàng (COD)
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              Bạn chỉ thanh toán khi đơn hàng đã được giao đến nơi an toàn.
            </div>
          </div>
        </label>

        {/* VNPay Method */}
        <label className={`flex items-center gap-4 p-5 border transition-all cursor-pointer rounded-none ${paymentMethod === "VNPAY" ? "border-black bg-neutral-50" : "border-gray-100 hover:border-gray-300"}`}>
          <div className="flex-shrink-0 flex items-center justify-center">
            <input
              type="radio"
              name="paymentMethod"
              value="VNPAY"
              checked={paymentMethod === "VNPAY"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="w-4 h-4 text-black focus:ring-black accent-black"
            />
          </div>
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-none border border-gray-100 shrink-0 p-1">
             <img 
               src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" 
               alt="VNPay" 
               className="w-full h-full object-contain"
             />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-black leading-none mb-1.5">
              Thanh toán qua VNPay
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              Cổng thanh toán VNPay / Thẻ ATM / Thẻ quốc tế.
            </div>
          </div>
        </label>

        {/* MoMo Method */}
        <label className={`flex items-center gap-4 p-5 border transition-all cursor-pointer rounded-none ${paymentMethod === "MOMO" ? "border-black bg-neutral-50" : "border-gray-100 hover:border-gray-300"}`}>
          <div className="flex-shrink-0 flex items-center justify-center">
            <input
              type="radio"
              name="paymentMethod"
              value="MOMO"
              checked={paymentMethod === "MOMO"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="w-4 h-4 text-black focus:ring-black accent-black"
            />
          </div>
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-none border border-gray-100 shrink-0 p-1">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/MoMo_Logo_App.svg/250px-MoMo_Logo_App.svg.png" 
               alt="MoMo" 
               className="w-full h-full object-contain"
             />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[14px] text-black leading-none mb-1.5">
              Ví MoMo
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              Thanh toán nhanh chóng qua ví điện tử MoMo.
            </div>
          </div>
        </label>

        {/* Coming Soon Section */}
        <div className="pt-4 px-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px bg-gray-100 flex-1"></span>
              <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest whitespace-nowrap">Đang mở rộng thêm</span>
              <span className="h-px bg-gray-100 flex-1"></span>
            </div>
            <div className="grid grid-cols-1 gap-3 opacity-30 grayscale pointer-events-none">
                <div className="flex items-center justify-center gap-3 py-3 border border-gray-100 bg-gray-50/30">
                    <FaCreditCard size={12} className="text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">ShopeePay</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;






