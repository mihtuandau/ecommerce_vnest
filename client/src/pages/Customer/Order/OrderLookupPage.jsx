import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaSearch, FaBox, FaCheckCircle, FaEye } from "react-icons/fa";
import { notify } from "../../../utils/notification";
import Layout from "../../../components/layouts/Layout";
import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import orderService from "../../../services/orderService";

const OrderLookupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState(location.state?.orderCode || "");
  const [contact, setContact] = useState(location.state?.contact || "");
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const guestOrders = JSON.parse(
      localStorage.getItem("guest_orders") || "[]",
    );
    setRecentOrders(guestOrders.reverse());
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderCode.trim() || !contact.trim()) {
      notify.error("Vui lòng nhập đầy đủ mã đơn hàng và email/số điện thoại");
      return;
    }

    try {
      setSearching(true);
      const response = await orderService.lookupGuestOrder(orderCode, contact);
      const guestOrders = JSON.parse(
        localStorage.getItem("guest_orders") || "[]",
      );
      const newOrder = {
        orderCode: orderCode.trim(),
        contact: contact.trim(),
        date: new Date().toISOString(),
      };

      const filtered = guestOrders.filter(
        (o) => o.orderCode !== orderCode.trim(),
      );
      filtered.unshift(newOrder);
      localStorage.setItem(
        "guest_orders",
        JSON.stringify(filtered.slice(0, 5)),
      );
      setOrder(response);
      setRecentOrders(filtered.slice(0, 5));
      notify.success("Tìm thấy đơn hàng!");

      setTimeout(() => {
        navigate(`/guest-order/${response.orderCode}`);
      }, 500);
    } catch (error) {
      notify.error(error.response?.data?.message || "Không tìm thấy đơn hàng");
      setOrder(null);
    } finally {
      setSearching(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
      PROCESSING: { text: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
      SHIPPED: { text: "Đang giao", color: "bg-purple-100 text-purple-800" },
      DELIVERED: { text: "Đã giao", color: "bg-zinc-800 text-white" },
      CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-8 pt-21">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <FaSearch className="text-2xl text-black" />
            </div>
            <h1 className="pb-2 pt-2 text-2xl font-bold text-gray-900">
              TRA CỨU ĐƠN HÀNG
            </h1>
            <p className="text-gray-600">
              Nhập mã đơn hàng và email/số điện thoại để tra cứu
            </p>
          </div>

          {recentOrders.length > 0 && !order && (
            <div className="mb-5 border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                Đơn hàng gần đây
              </h2>
              <div className="space-y-2">
                {recentOrders.map((recentOrder, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setOrderCode(recentOrder.orderCode);
                      setContact(recentOrder.contact);
                    }}
                    className="w-full border border-gray-200 p-2.5 text-left transition-colors hover:border-black hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {recentOrder.orderCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          {recentOrder.contact}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(recentOrder.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 border border-gray-200 bg-white p-4 sm:p-5">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đơn hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="Ví dụ: ORD-A1B2C3"
                  className="w-full border border-gray-300 px-3.5 py-2.5 focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email hoặc Số điện thoại{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="example@email.com hoặc 0901234567"
                  className="w-full border border-gray-300 px-3.5 py-2.5 focus:border-gray-900 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={searching}
                className="w-full flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <Loading size="sm" />
                    Đang tìm kiếm...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Tra cứu đơn hàng
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderLookupPage;






