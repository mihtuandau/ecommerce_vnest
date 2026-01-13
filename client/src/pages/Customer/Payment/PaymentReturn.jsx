import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import paymentService from "../../../services/paymentService";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  useEffect(() => {
    if (status === "pending" && pollAttempts < 10) {
      const timer = setTimeout(() => {
        checkPaymentStatus();
        setPollAttempts((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, pollAttempts]);

  const checkPaymentStatus = async () => {
    try {
      const orderCode = searchParams.get("orderCode") || searchParams.get("id");
      const cancel = searchParams.get("cancel");
      const statusParam = searchParams.get("status");

      if (!orderCode) {
        setStatus("error");
        return;
      }

      if (cancel === "true" || statusParam === "CANCELLED") {
        setStatus("cancelled");
        return;
      }

      const response = await paymentService.verifyPaymentReturn(orderCode);

      if (response.data) {
        const { payment, order } = response.data;

        setPaymentInfo({
          orderCode: payment?.payosOrderCode,
          amount: payment?.amount || order?.total,
          status: payment?.status,
        });

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
      const statusParam = searchParams.get("status");
      setStatus(statusParam === "PAID" ? "success" : "error");
    }
  };

  // Lo
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-gray-900 flex items-center justify-center">
            <FaSpinner className="text-2xl text-gray-900 animate-spin" />
          </div>
          <h2 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
            Đang Xác Nhận Thanh Toán
          </h2>
          <p className="text-sm text-gray-500 font-light">Vui lòng chờ...</p>
        </div>
      </div>
    );
  }

  // Success State
  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg border-2 border-gray-900 p-12">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 border-2 border-gray-900 flex items-center justify-center">
            <FaCheckCircle className="text-4xl text-gray-900" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
              Thanh Toán Thành Công
            </h1>
            <p className="text-gray-600 font-light leading-relaxed">
              Đơn hàng đang được xử lý và sẽ được giao trong 2-3 ngày làm việc
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-light text-gray-600">
                  Mã đơn hàng
                </span>
                <span className="font-normal text-gray-900">
                  #{orderInfo?.order?.orderCode}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-light text-gray-600">
                  Số tiền
                </span>
                <span className="font-normal text-gray-900">
                  {paymentInfo?.amount?.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-sm font-light text-gray-600">
                  Phương thức
                </span>
                <span className="font-normal text-gray-900">PayOS - QR</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">
                  Trạng thái
                </span>
                <span className="px-3 py-1 bg-[#00a85a] text-white text-xs">
                  Đã thanh toán
                </span>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-gray-50 border-l-2 border-gray-900 p-4 mb-8">
            <p className="text-sm text-gray-700 font-light">
              Email xác nhận đã được gửi đến địa chỉ của bạn
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                const isGuest = !orderInfo?.order?.userId;
                if (isGuest) {
                  const guestOrders = JSON.parse(
                    localStorage.getItem("guest_orders") || "[]"
                  );
                  const contact =
                    orderInfo?.order?.guestEmail ||
                    orderInfo?.order?.guestPhone;
                  guestOrders.unshift({
                    orderCode: orderInfo?.order?.orderCode,
                    contact: contact,
                    date: new Date().toISOString(),
                  });
                  localStorage.setItem(
                    "guest_orders",
                    JSON.stringify(guestOrders.slice(0, 5))
                  );
                  navigate(`/guest-order/${orderInfo?.order?.orderCode}`);
                } else {
                  navigate(`/orders/${orderInfo?.order?.id}`);
                }
              }}
              className="w-full bg-[#00a85a] text-white py-3 hover:bg-[#008f4d] transition-colors text-sm font-normal"
            >
              Xem Chi Tiết Đơn Hàng
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border border-gray-300 text-gray-900 py-3 hover:border-gray-900 transition-colors text-sm font-normal"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cancelled State
  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg border-2 border-gray-900 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-8 border-2 border-gray-900 flex items-center justify-center">
            <FaTimesCircle className="text-4xl text-gray-900" />
          </div>

          <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
            Thanh Toán Đã Bị Hủy
          </h1>
          <p className="text-gray-600 mb-8 font-light leading-relaxed">
            Bạn đã hủy giao dịch. Đơn hàng vẫn được giữ trong giỏ hàng
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-[#00a85a] text-white py-3 hover:bg-[#008f4d] transition-colors text-sm font-normal"
            >
              Quay Lại Giỏ Hàng
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full border border-gray-300 text-gray-900 py-3 hover:border-gray-900 transition-colors text-sm font-normal"
            >
              Thử Lại Thanh Toán
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending State
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg border-2 border-gray-900 p-12">
          <div className="w-20 h-20 mx-auto mb-8 border-2 border-gray-900 flex items-center justify-center">
            <FaClock className="text-4xl text-gray-900 animate-pulse" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
              Đang Xử Lý Thanh Toán
            </h1>
            <p className="text-gray-600 font-light leading-relaxed">
              Giao dịch đang được xử lý. Vui lòng kiểm tra lại sau vài phút
            </p>
            {pollAttempts > 0 && (
              <p className="text-sm text-gray-500 mt-2 font-light">
                Đang tự động kiểm tra... ({pollAttempts}/10)
              </p>
            )}
          </div>

          {orderInfo?.order && (
            <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-sm font-light text-gray-600">
                    Mã đơn hàng
                  </span>
                  <span className="font-normal text-gray-900">
                    #{orderInfo?.order?.orderCode}
                  </span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-sm font-light text-gray-600">
                    Số tiền
                  </span>
                  <span className="font-normal text-gray-900">
                    {paymentInfo?.amount?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-gray-600">
                    Trạng thái
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs border border-gray-300">
                    Đang chờ
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={checkPaymentStatus}
              className="w-full bg-[#00a85a] text-white py-3 hover:bg-[#008f4d] transition-colors text-sm font-normal"
            >
              Kiểm Tra Lại
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-900 py-3 hover:border-gray-900 transition-colors text-sm font-normal"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed/Error State
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg border-2 border-gray-900 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-8 border-2 border-gray-900 flex items-center justify-center">
          <FaTimesCircle className="text-4xl text-gray-900" />
        </div>

        <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
          {status === "failed" ? "Thanh Toán Thất Bại" : "Có Lỗi Xảy Ra"}
        </h1>
        <p className="text-gray-600 mb-8 font-light leading-relaxed">
          {status === "failed"
            ? "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ"
            : "Không thể xác nhận trạng thái thanh toán. Vui lòng liên hệ hỗ trợ"}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-[#00a85a] text-white py-3 hover:bg-[#008f4d] transition-colors text-sm font-normal"
          >
            Thử Lại Thanh Toán
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-900 py-3 hover:border-gray-900 transition-colors text-sm font-normal"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
