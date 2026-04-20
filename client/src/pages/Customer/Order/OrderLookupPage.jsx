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
      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-gray-100 shadow-sm animate-fadeIn">
              <FaSearch className="text-xl text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight uppercase mb-3 text-center">
              Tra cứu đơn hàng
            </h1>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 max-w-xs mx-auto text-center">
              Nhập mã đơn hàng để theo dõi tiến độ
            </p>
          </div>

          <div className="mb-12 border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    Mã đơn hàng
                  </label>
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Ví dụ: ORD-CSL..."
                    className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold tracking-tight focus:border-black focus:outline-none transition-all placeholder:text-gray-200 uppercase"
                  />
                </div>

                <div className="relative group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    Email / Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Nhập thông tin..."
                    className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold tracking-tight focus:border-black focus:outline-none transition-all placeholder:text-gray-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] disabled:bg-gray-200"
              >
                {searching ? "Đang tra cứu..." : "Tra cứu ngay"}
              </button>
            </form>
          </div>

          {recentOrders.length > 0 && (
            <div className="border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
              <h2 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Đơn hàng đã tra cứu
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentOrders.map((recentOrder, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setOrderCode(recentOrder.orderCode);
                      setContact(recentOrder.contact);
                    }}
                    className="border border-gray-100 bg-white p-4 text-left transition-all hover:border-black hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 uppercase tracking-tight">
                          {recentOrder.orderCode}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">
                          {recentOrder.contact}
                        </p>
                      </div>
                      <FaEye size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderLookupPage;
