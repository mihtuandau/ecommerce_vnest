import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClock, FaBox } from "react-icons/fa";
import { notify } from "../../../utils/notification";
import Loading from "../../../components/common/Loading";
import Layout from "../../../components/layouts/Layout";
import Breadcrumb from "../../../components/common/Breadcrumb";
import orderService from "../../../services/orderService";
import { formatDateTime } from "../../../utils/formatters";
import {
  OrderStatusBadge,
  OrderShippingInfo,
  OrderItemsList,
  OrderPriceSummary,
} from "../../../components/order";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderDetail();
    }
  }, [id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);

      if (!response || !response.id) {
        throw new Error("Invalid order data");
      }

      const transformedOrder = {
        ...response,
        items: response.orderItems || [],
        paymentMethod: response.paymentMethod || "CASH",
      };

      setOrder(transformedOrder);
    } catch (error) {

      notify.error("Không tìm thấy hoặc không thể tải thông tin đơn hàng");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      await orderService.cancelOrder(id);
      notify.success("Đã hủy đơn hàng thành công!");
      loadOrderDetail();
    } catch (error) {
      notify.error(error.response?.data?.message || "Không thể hủy đơn hàng");
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
        <div className="min-h-screen bg-white pb-8 pt-21">
          <div className="container mx-auto px-4 lg:px-30">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Không tìm thấy đơn hàng
              </h3>
              <button
                onClick={() => navigate("/orders")}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white transition-colors"
              >
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-8">
        <div className="container mx-auto px-4 lg:px-20">
          <Breadcrumb
            items={[
              { label: "Đơn hàng của tôi", path: "/orders" },
              { label: "Chi tiết đơn hàng" },
            ]}
          />
          <div className="mb-4">
            <div className="border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">
                    Đơn hàng {order.orderCode || `#${order.id}`}
                  </h1>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock size={14} />
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <OrderShippingInfo order={order} />

            <OrderItemsList items={order.items} />

            <OrderPriceSummary order={order} />

            {(order.status === "PENDING" ||
              order.status === "AWAITING_PAYMENT") && (
              <div className="border border-gray-200 bg-white p-4 sm:p-5">
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;






