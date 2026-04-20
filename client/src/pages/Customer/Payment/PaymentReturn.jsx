import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaClock } from "react-icons/fa";
import paymentService from "../../../services/paymentService";

const StatusLayout = ({ icon: Icon, title, description, children, iconColor = "text-black" }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="w-full max-w-lg border-2 border-black p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-8 border-2 border-black flex items-center justify-center">
        <Icon className={`text-4xl ${iconColor}`} />
      </div>
      <h1 className="text-3xl font-semibold text-black mb-3 tracking-tight leading-snug">{title}</h1>
      <p className="text-gray-600 mb-8 font-light leading-relaxed">{description}</p>
      {children}
    </div>
  </div>
);

const OrderSummary = ({ order, amount }) => (
  <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-left">
    <div className="space-y-4">
      <div className="flex justify-between pb-4 border-b border-gray-200">
        <span className="text-sm font-light text-gray-600">Mã đơn hàng</span>
        <span className="font-semibold text-black">#{order?.orderCode}</span>
      </div>
      <div className="flex justify-between pb-4 border-b border-gray-200">
        <span className="text-sm font-light text-gray-600">Số tiền</span>
        <span className="font-semibold text-black">{amount?.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-light text-gray-600">Trạng thái</span>
        <span className="px-3 py-1 bg-black text-white text-xs">Đã thanh toán</span>
      </div>
    </div>
  </div>
);

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  const checkPaymentStatus = async () => {
    try {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      
      // Handle VNPay
      if (vnp_ResponseCode) {
        const vnpParams = Object.fromEntries(searchParams.entries());
        const response = await paymentService.verifyVNPayReturn(vnpParams);
        
        if (response) {
          const { payment, order } = response;
          setPaymentInfo({ 
            orderCode: order?.orderCode, 
            amount: payment?.amount || order?.total, 
            status: payment?.status 
          });
          setOrderInfo({ order });

          if (vnp_ResponseCode === "00" && (payment?.status === "SUCCESS" || payment?.status === "PAID")) {
            setStatus("success");
            localStorage.setItem("paymentCompleted", "true");
          } else if (vnp_ResponseCode === "24") {
            setStatus("cancelled");
          } else {
            setStatus("failed");
          }
        } else {
          setStatus("error");
        }
        return;
      }

      // Handle PayOS / Other
      const orderCode = searchParams.get("orderCode") || searchParams.get("id");
      const cancel = searchParams.get("cancel");
      const statusParam = searchParams.get("status");

      if (!orderCode) return setStatus("error");
      if (cancel === "true" || statusParam === "CANCELLED") return setStatus("cancelled");

      const response = await paymentService.verifyPaymentReturn(orderCode);
      if (response) {
        const { payment, order } = response;
        setPaymentInfo({ orderCode: payment?.payosOrderCode, amount: payment?.amount || order?.total, status: payment?.status });
        setOrderInfo({ order });

        if (payment?.status === "SUCCESS" || statusParam === "PAID") {
          setStatus("success");
          localStorage.setItem("paymentCompleted", "true");
        } else if (payment?.status === "PENDING") {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      // Tuyệt đối không tự xác nhận thành công nếu Backend báo lỗi checksum (400)
      if (vnp_ResponseCode === "24") {
        setStatus("cancelled");
      } else {
        setStatus("error");
      }
    }
  };

  useEffect(() => { checkPaymentStatus(); }, []);

  useEffect(() => {
    if (status === "pending" && pollAttempts < 10) {
      const timer = setTimeout(() => {
        checkPaymentStatus();
        setPollAttempts((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, pollAttempts]);

  const handleViewOrder = () => {
    const order = orderInfo?.order;
    if (!order?.userId) {
      const guestOrders = JSON.parse(localStorage.getItem("guest_orders") || "[]");
      guestOrders.unshift({ orderCode: order?.orderCode, contact: order?.guestEmail || order?.guestPhone, date: new Date().toISOString() });
      localStorage.setItem("guest_orders", JSON.stringify(guestOrders.slice(0, 5)));
      navigate(`/guest-order/${order?.orderCode}`);
    } else {
      navigate(`/orders/${order?.id}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-black flex items-center justify-center">
            <FaSpinner className="text-2xl text-black animate-spin" />
          </div>
          <h1 className="text-3xl font-semibold text-black mb-3 tracking-tight leading-snug">Đang Xác Nhận Thanh Toán..</h1>
          <p className="text-sm text-gray-500 font-light">Vui lòng chờ...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <StatusLayout icon={FaCheckCircle} title="Thanh Toán Thành Công" description="Đơn hàng đang được xử lý và sẽ được giao trong 2-3 ngày làm việc">
        <OrderSummary order={orderInfo?.order} amount={paymentInfo?.amount} />
        <div className="space-y-3">
          <button onClick={handleViewOrder} className="w-full bg-black hover:bg-neutral-800 text-white py-3 transition-colors text-sm">Xem Chi Tiết Đơn Hàng</button>
          <button onClick={() => navigate("/products")} className="w-full border border-gray-300 py-3 hover:border-black text-sm">Tiếp Tục Mua Sắm</button>
        </div>
      </StatusLayout>
    );
  }

  if (status === "cancelled") {
    return (
      <StatusLayout icon={FaTimesCircle} title="Thanh Toán Đã Bị Hủy" description="Bạn đã hủy giao dịch. Đơn hàng vẫn được giữ trong giỏ hàng">
        <div className="space-y-3">
          <button onClick={() => navigate("/cart")} className="w-full bg-black hover:bg-neutral-800 text-white py-3 transition-colors text-sm">Quay Lại Giỏ Hàng</button>
          <button onClick={() => navigate("/checkout")} className="w-full border border-gray-300 py-3 hover:border-black text-sm">Thử Lại Thanh Toán</button>
        </div>
      </StatusLayout>
    );
  }

  if (status === "pending") {
    return (
      <StatusLayout icon={FaClock} title="Đang Xử Lý Thanh Toán" description="Giao dịch đang được xử lý. Vui lòng kiểm tra lại sau vài phút" iconColor="animate-pulse">
        {pollAttempts > 0 && <p className="text-sm text-gray-500 mb-4 font-light">Đang tự động kiểm tra... ({pollAttempts}/10)</p>}
        <div className="space-y-3">
          <button onClick={checkPaymentStatus} className="w-full bg-black hover:bg-neutral-800 text-white py-3 transition-colors text-sm">Kiểm Tra Lại</button>
          <button onClick={() => navigate("/")} className="w-full border border-gray-300 py-3 hover:border-black text-sm">Về Trang Chủ</button>
        </div>
      </StatusLayout>
    );
  }

  return (
    <StatusLayout icon={FaTimesCircle} title={status === "failed" ? "Thanh Toán Thất Bại" : "Có Lỗi Xảy Ra"} description={status === "failed" ? "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ" : "Không thể xác nhận trạng thái thanh toán. Vui lòng liên hệ hỗ trợ"}>
      <div className="space-y-3">
        <button onClick={() => navigate("/checkout")} className="w-full bg-black hover:bg-neutral-800 text-white py-3 transition-colors text-sm">Thử Lại Thanh Toán</button>
        <button onClick={() => navigate("/")} className="w-full border border-gray-300 py-3 hover:border-black text-sm">Về Trang Chủ</button>
      </div>
    </StatusLayout>
  );
};

export default PaymentReturn;
