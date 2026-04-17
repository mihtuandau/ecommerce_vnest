import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Sparkles, Tag, ArrowRight } from "lucide-react";
import Layout from "../../../components/layouts/Layout";
import Loading from "../../../components/common/Loading";
import { notify } from "../../../utils/notification";
import discountService from "../../../services/discountService";
import VoucherCard from "../../../components/promotions/VoucherCard";

const PromotionsPage = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [tab, setTab] = useState("all");

  const { data: voucherData, isLoading } = useQuery({
    queryKey: ["public-discounts"],
    queryFn: () => discountService.getPublicDiscounts(),
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    notify.success(`Đã lưu mã: ${code}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (isLoading) return <Loading fullScreen text="Đang tải ưu đãi..." />;

  const vouchers = voucherData?.data || voucherData || [];
  const flashList = vouchers.filter((v) => v.isFlashSale);
  const regularList = vouchers.filter((v) => !v.isFlashSale);

  const displayed =
    tab === "flash" ? flashList : tab === "regular" ? regularList : vouchers;

  const TABS = [
    { key: "all", label: `Tất cả (${vouchers.length})` },
    { key: "flash", label: `⚡ Flash Sale (${flashList.length})` },
    { key: "regular", label: `🎟 Khuyến mãi thường (${regularList.length})` },
  ];

  return (
    <Layout>
      {/* 
        Container with a specific light blue-gray background to make the white
        cards and the overlapping banner look great.
      */}
      <div className="min-h-screen bg-[#F4F6F8] font-inter pb-20">
        
        {/* Modern E-commerce Banner Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white pt-[72px] pb-[72px] px-5 relative overflow-hidden">
           {/* Decorative elements behind the text */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-20 w-80 h-80 bg-white rounded-full blur-[80px]"></div>
              <div className="absolute bottom-[-100px] right-[-50px] w-72 h-72 bg-blue-300 rounded-full blur-[90px]"></div>
           </div>

           <div className="max-w-[1100px] mx-auto relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm shadow-sm">
                <Sparkles size={13} className="text-amber-300 fill-amber-300" /> Ưu đãi độc quyền
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
                Kho Voucher & Khuyến Mãi
              </h1>
              <p className="text-blue-100 max-w-xl mx-auto text-sm md:text-base leading-relaxed drop-shadow-sm">
                Hàng ngàn mã giảm giá và ưu đãi miễn phí vận chuyển hấp dẫn đang chờ bạn.
                Sưu tầm ngay để tiết kiệm tối đa cho đơn hàng!
              </p>
           </div>
        </div>

        {/* Main Content Area - overlaps the banner slightly for depth */}
        <div className="max-w-[1100px] mx-auto px-5 -mt-8 relative z-20">
          
          {/* Floating Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-gray-100 mx-auto max-w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  tab === t.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-transparent text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map((v) => (
              <VoucherCard
                key={v.id}
                voucher={v}
                onCopy={handleCopyCode}
                copiedCode={copiedCode}
              />
            ))}

            {!displayed.length && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400 bg-white border border-gray-100 rounded-2xl shadow-sm mt-4">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                   <Tag size={36} className="text-gray-300" />
                </div>
                <p className="text-base font-bold text-gray-600">
                  Chưa có voucher nào trong danh mục này
                </p>
                <p className="text-sm mt-1">Vui lòng quay lại kiểm tra sau nhé!</p>
              </div>
            )}
          </div>

          {/* Call To Action */}
          {displayed.length > 0 && (
            <div className="mt-14 flex justify-center">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40 hover:-translate-y-0.5"
              >
                <ShoppingCart size={18} className="drop-shadow-sm" />
                Dùng Voucher Mua Sắm Ngay
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PromotionsPage;
