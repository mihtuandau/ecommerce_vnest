import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Spin, Empty, Modal } from "antd";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { notify } from "../../../utils/notification";
import Layout from "../../../components/layouts/Layout";
import Breadcrumb from "../../../components/common/Breadcrumb";
import PageTitle from "../../../components/common/PageTitle";
import orderService from "../../../services/orderService";
import reviewService from "../../../services/reviewService";
import {
  OrderStatusFilter,
  OrderCard,
  ReviewModal,
} from "../../../components/order";

const { confirm } = Modal;

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set()); 
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadOrders();
  }, [location.search]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      const ordersList = response?.orders || response?.data?.orders || [];
      const transformedOrders = (Array.isArray(ordersList) ? ordersList : []).map((order) => ({
        ...order,
        items: order.orderItems || [],
      }));
      setOrders(transformedOrders);
    } catch (error) {
      notify.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const checkReviewedProducts = async () => {
    const reviewed = new Set();
    for (const order of orders) {
      if (order.status === "DELIVERED" && order.items) {
        for (const item of order.items) {
          const productId = item.variant?.product?.id || item.variant?.productId;
          if (productId) {
            try {
              const response = await reviewService.canUserReview(productId, order.id);
              if (response.data?.hasReviewed || response.hasReviewed) {
                reviewed.add(`${productId}-${order.id}`);
              }
            } catch (error) {}
          }
        }
      }
    }
    setReviewedProducts(reviewed);
  };

  useEffect(() => {
    if (orders.length > 0) checkReviewedProducts();
  }, [orders]);

  const handleOpenReviewModal = (item, orderId) => {
    const productId = item.variant?.product?.id || item.variant?.productId;
    const productName = item.variant?.product?.name;
    setSelectedProduct({ id: productId, name: productName, orderId });
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    notify.success("Đánh giá thành công!");
    setReviewedProducts((prev) => new Set([...prev, `${selectedProduct.id}-${selectedProduct.orderId}`]));
    setSelectedProduct(null);
  };

  const handleCancelOrder = async (orderId) => {
    confirm({
      title: "Xác nhận hủy đơn hàng",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Hủy đơn hàng",
      okType: "danger",
      cancelText: "Đóng",
      async onOk() {
        try {
          await orderService.cancelOrder(orderId);
          notify.success("Hủy đơn hàng thành công!");
          loadOrders();
        } catch (error) {
          notify.error(error.response?.data?.message || "Không thể hủy đơn hàng");
        }
      },
    });
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = statusFilter === "ALL" ? safeOrders : safeOrders.filter((order) => order.status === statusFilter);

  const statusCounts = {
    ALL: safeOrders.length,
    PENDING: safeOrders.filter((o) => o.status === "PENDING").length,
    PROCESSING: safeOrders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: safeOrders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: safeOrders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: safeOrders.filter((o) => o.status === "CANCELLED").length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-7xl mx-auto"> 
          <div className="px-6 py-2">
            <Breadcrumb items={[{ label: "Đơn hàng của tôi" }]} />
          </div>

          <div className="sticky top-[64px] sm:top-[80px] z-30">
            <OrderStatusFilter
              activeStatus={statusFilter}
              onStatusChange={setStatusFilter}
              statusCounts={statusCounts}
            />
          </div>

          <div className="px-6 mt-6">
            {safeOrders.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Empty description="Bạn chưa có đơn hàng nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Empty description="Không tìm thấy đơn hàng phù hợp" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                <Button type="primary" onClick={() => setStatusFilter("ALL")}>Xem tất cả đơn hàng</Button>
              </Empty>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  reviewedProducts={reviewedProducts}
                  onReviewClick={handleOpenReviewModal}
                  onCancelClick={handleCancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      <ReviewModal
        show={showReviewModal}
        product={selectedProduct}
        onClose={() => { setShowReviewModal(false); setSelectedProduct(null); }}
        onSuccess={handleReviewSuccess}
      />
    </Layout>
  );
};

export default OrdersPage;
