import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaBox, FaArrowLeft } from "react-icons/fa";
import Layout from "../../../components/layouts/Layout";
import Loading from "../../../components/common/Loading";
import Breadcrumb from "../../../components/common/Breadcrumb";
import OrderStatusBadge from "../../../components/order/OrderStatusBadge";
import { formatPrice, formatDateTime } from "../../../utils/formatters";
import orderService from "../../../services/orderService";
import { notify } from "../../../utils/notification";

const GuestOrderDetailPage = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState("");

  useEffect(() => {
    const guestOrders = JSON.parse(
      localStorage.getItem("guest_orders") || "[]",
    );
    const savedOrder = guestOrders.find((o) => o.orderCode === orderCode);

    if (savedOrder) {
      setContact(savedOrder.contact);
      loadOrder(savedOrder.contact);
    } else {
      navigate("/order-lookup");
    }
  }, [orderCode]);

  const loadOrder = async (contactInfo) => {
    try {
      setLoading(true);
      const response = await orderService.lookupGuestOrder(
        orderCode,
        contactInfo,
      );
      setOrder(response);
    } catch (error) {
      notify.error("Không thể tải thông tin đơn hàng");
      navigate("/order-lookup");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải đơn hàng..." />
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen bg-white pt-21 flex items-center justify-center">
          <div className="text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h2>
            <Link to="/order-lookup" className="text-black hover:underline">
              Quay lại tra cứu
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const items = order.orderItems || order.items || [];

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-28">
          <Breadcrumb
            items={[
              { label: "Tra cứu đơn hàng", path: "/order-lookup" },
              { label: `Đơn hàng ${order.orderCode}` },
            ]}
          />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                CHI TIẾT ĐƠN HÀNG #{order.orderCode}
              </h1>
              <p className="text-gray-600 mt-1">
                Đặt lúc: {formatDateTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    Sản phẩm đã đặt
                  </h2>
                </div>
                <div className="space-y-3 p-4 sm:p-5">
                  {items.map((item, index) => {
                    const imageUrl =
                      item.variant?.images?.[0]?.url ||
                      item.variant?.product?.images?.[0]?.url ||
                      "/placeholder-product.jpg";

                    return (
                      <div
                        key={index}
                        className="flex gap-3 border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                      >
                        <img
                          src={imageUrl}
                          alt={item.variant?.product?.name}
                          className="h-16 w-16 border border-gray-200 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.variant?.product?.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            {item.variant?.size && (
                              <span>Size: {item.variant.size}</span>
                            )}
                            {item.variant?.color && (
                              <span>Màu: {item.variant.color}</span>
                            )}
                            <span>× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatPrice(item.price)} / sp
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Người nhận:</span>{" "}
                      {order.shippingSnapshot?.fullName ||
                        order.shippingInfo?.fullName ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {order.shippingSnapshot?.phone ||
                        order.guestPhone ||
                        order.shippingInfo?.phone ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.guestEmail || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {order.shippingSnapshot?.addressString ||
                        order.shippingAddress ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    Tổng quan đơn hàng
                  </h2>
                </div>
                <div className="space-y-2.5 p-4 sm:p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="text-gray-900">
                      {formatPrice(order.subtotal || order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-gray-900">
                      {formatPrice(order.shippingFee || 0)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-black">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    Thanh toán
                  </h2>
                </div>
                <div className="space-y-2 p-4 text-sm sm:p-5">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức</span>
                    <span className="text-gray-900 font-medium">
                      {order.paymentMethod === "PAYOS"
                        ? "PayOS - QR"
                        : "Tiền mặt"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái</span>
                    <span
                      className={`font-medium ${
                        order.payment?.status === "SUCCESS"
                          ? "text-black font-bold"
                          : order.payment?.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-gray-600"
                      }`}
                    >
                      {order.payment?.status === "SUCCESS"
                        ? "Đã thanh toán"
                        : order.payment?.status === "PENDING"
                          ? "Chờ thanh toán"
                          : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuestOrderDetailPage;
