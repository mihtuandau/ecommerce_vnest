import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Button, Badge, Spin, Empty, Modal, Space } from "antd";
import {
  ReloadOutlined,
  ExclamationCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { notify } from "../../../utils/notification";
import Loading from "../../../components/common/Loading";
import Layout from "../../../components/layouts/Layout";
import Breadcrumb from "../../../components/common/Breadcrumb";
import PageTitle from "../../../components/common/PageTitle";
import orderService from "../../../services/orderService";
import reviewService from "../../../services/reviewService";
import {
  OrderStatusFilter,
  OrderCard,
  EmptyOrder,
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
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadOrders();

    const urlParams = new URLSearchParams(location.search);
    const paymentSuccess = urlParams.get("paymentSuccess");
    const refreshOrders = urlParams.get("refresh");

    const paymentCompleted = localStorage.getItem("paymentCompleted");

    if (
      paymentSuccess === "true" ||
      refreshOrders === "true" ||
      paymentCompleted === "true"
    ) {
      setIsAutoRefreshing(true);

      setTimeout(() => {
        loadOrders();
        setIsAutoRefreshing(false);
      }, 3000);

      localStorage.removeItem("paymentCompleted");
      if (urlParams.has("paymentSuccess") || urlParams.has("refresh")) {
        navigate("/orders", { replace: true });
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (orders.length > 0) {
      checkReviewedProducts();
    }
  }, [orders]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();

      const ordersList = response?.orders || response?.data?.orders || [];

      const transformedOrders = (
        Array.isArray(ordersList) ? ordersList : []
      ).map((order) => ({
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
      const canReviewOrder =
        order.status === "DELIVERED" && order.payment?.status === "SUCCESS";

      if (canReviewOrder && order.items) {
        for (const item of order.items) {
          const productId =
            item.variant?.product?.id || item.variant?.productId;
          const productName = item.variant?.product?.name;

          if (productId) {
            try {
              const response = await reviewService.canUserReview(
                productId,
                order.id,
              );
              const result = response.data || response;

              if (result.hasReviewed === true) {
                const reviewKey = `${productId}-${order.id}`;
                reviewed.add(reviewKey);
              } else {
              }
            } catch (error) {}
          }
        }
      }
    }
    setReviewedProducts(reviewed);
  };

  const handleOpenReviewModal = (item, orderId) => {
    const productId = item.variant?.product?.id || item.variant?.productId;
    const productName = item.variant?.product?.name;
    setSelectedProduct({ id: productId, name: productName, orderId });
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    notify.success("Đánh giá thành công!");
    const reviewKey = `${selectedProduct.id}-${selectedProduct.orderId}`;
    setReviewedProducts((prev) => new Set([...prev, reviewKey]));
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
          notify.error(
            error.response?.data?.message || "Không thể hủy đơn hàng",
          );
        }
      },
    });
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders =
    statusFilter === "ALL"
      ? safeOrders
      : safeOrders.filter((order) => order.status === statusFilter);

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
      <div className="min-h-screen bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Đơn hàng của tôi" }]} />

          <PageTitle
            subtitle="Theo dõi"
            title="ĐƠN HÀNG CỦA TÔI"
            count={safeOrders.length}
            countLabel="đơn hàng"
            className="mt-6"
          />

          <div className="mb-6">
            <OrderStatusFilter
              activeStatus={statusFilter}
              onStatusChange={setStatusFilter}
              statusCounts={statusCounts}
            />
          </div>

          {safeOrders.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Empty
                description="Bạn chưa có đơn hàng nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Empty
                description="Không tìm thấy đơn hàng phù hợp"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => setStatusFilter("ALL")}>
                  Xem tất cả đơn hàng
                </Button>
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

      <ReviewModal
        show={showReviewModal}
        product={selectedProduct}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={handleReviewSuccess}
      />
    </Layout>
  );
};

export default OrdersPage;






