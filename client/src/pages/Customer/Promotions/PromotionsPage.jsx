import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowRight, Tag } from "lucide-react";
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
    { key: "flash", label: ` Flash Sale (${flashList.length})` },
    { key: "regular", label: `🎟 Khuyến mãi thường (${regularList.length})` },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white font-inter pb-24">
        
        {}
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
           <div className="max-w-7xl mx-auto flex flex-col items-center">
              <p className="text-[11px] md:text-[13px] text-gray-500 tracking-[0.25em] uppercase font-semibold mb-3">
                 Ư U Đ Ã I & V O U C H E R
              </p>
              <h1 className="font-heading text-3xl md:text-[42px] font-semibold text-black uppercase tracking-tight mb-7">
                 TẤT CẢ VOUCHER
              </h1>
              <div className="w-16 h-[2px] bg-black"></div>
           </div>
        </div>

        {}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          
          {}
          <div className="flex flex-wrap justify-center gap-2 mb-10 mx-auto max-w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 border ${
                  tab === t.key
                    ? "bg-black border-black !text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((v) => (
              <VoucherCard
                key={v.id}
                voucher={v}
                onCopy={handleCopyCode}
                copiedCode={copiedCode}
              />
            ))}

            {!displayed.length && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-gray-100 rounded-2xl mt-4">
                <Tag size={40} className="text-gray-300 mb-4" />
                <p className="text-base font-semibold text-slate-600">
                  Chưa có voucher nào trong danh mục này
                </p>
                <p className="text-sm mt-1">Vui lòng quay lại kiểm tra sau nhé!</p>
              </div>
            )}
          </div>

          {}
          {displayed.length > 0 && (
            <div className="mt-16 flex justify-center">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2.5 bg-black text-white px-9 py-3.5 rounded-full font-semibold text-[13px] tracking-wide transition-all hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5 uppercase"
              >
                <ShoppingCart size={16} />
                Tiếp tục mua sắm
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






