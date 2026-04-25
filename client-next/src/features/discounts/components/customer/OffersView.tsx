  "use client";

  import React from "react";
  import { useDiscounts } from "@/features/discounts/hooks";
  import { formatCurrency } from "@/utils/formatCurrency";
  import { Button } from "@/components/ui/Button";
  import { cn } from "@/utils/cn";
  import { Ticket, Clock, Copy, ChevronLeft, Tag, ArrowRight } from "lucide-react";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { useToast } from "@/hooks/useToast";
  import { Skeleton } from "@/components/ui/Skeleton";

  // --- Internal Components ---

  function VoucherCard({ voucher }: { voucher: any }) {
    const { success } = useToast();
    
    const copyToClipboard = (code: string) => {
      if (!code) return;
      navigator.clipboard.writeText(code);
      success(`Đã sao chép mã ưu đãi`);
    };

    const isExpired = voucher.endDate ? new Date(voucher.endDate) < new Date() : false;
    const isActive = voucher.isActive && new Date(voucher.startDate) <= new Date() && !isExpired;

    const displayValue = voucher.percentage 
      ? `${voucher.percentage}%` 
      : formatCurrency(voucher.fixedAmount || 0);

    return (
      <div className={cn(
        "group relative flex flex-col md:flex-row items-stretch transition-all duration-500 bg-white border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/5",
        !isActive && "opacity-60 grayscale"
      )}>
        {/* Left Section: Value */}
        <div className="w-full md:w-[28%] bg-primary/[0.03] p-6 md:p-8 flex flex-col items-center justify-center text-center shrink-0 border-b md:border-b-0 md:border-r border-dashed border-slate-200 relative">
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 border border-slate-200 hidden md:block" />
          <div className="absolute -bottom-3 left-1/2 w-6 h-6 bg-[#f8fafc] rounded-full -translate-x-1/2 border border-slate-200 block md:hidden" />
          
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider">Giảm ngay</span>
            <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
              {displayValue}
            </div>
          </div>
        </div>

        {/* Right Section: Content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-primary animate-pulse" : "bg-slate-400")} />
              <span className={cn("text-[10px] md:text-xs font-bold", isActive ? "text-primary" : "text-slate-500")}>
                {isActive ? "Đang diễn ra" : isExpired ? "Đã hết hạn" : "Sắp tới"}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-tight">
                {voucher.name || "Mã giảm giá Studio"}
              </h3>
              <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">
                {voucher.description || `Áp dụng cho đơn hàng từ ${formatCurrency(voucher.minOrderAmount || 0)}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5 group/code transition-all hover:bg-white hover:border-primary/30">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Mã:</span>
                  <code className="text-base font-black text-slate-900">
                    {voucher.code}
                  </code>
                </div>
                <button onClick={() => copyToClipboard(voucher.code)} className="text-slate-400 hover:text-primary transition-all ml-4">
                  <Copy size={16} />
                </button>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hạn dùng</span>
                  <span className="text-xs text-slate-700 font-bold">
                    {voucher.endDate ? new Date(voucher.endDate).toLocaleDateString("vi-VN") : "Vĩnh viễn"}
                  </span>
                </div>
                <Button asChild className="h-11 px-6 rounded-xl bg-primary text-white font-bold text-xs hover:bg-slate-900 transition-all shadow-md">
                  <Link href="/shop">Dùng ngay</Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main View ---

  export function OffersView() {
    const { data: discountsData, isLoading } = useDiscounts({ limit: 100 });
    const router = useRouter();

    const rawData = React.useMemo(() => {
      if (!discountsData) return [];
      const items = (discountsData as any)?.data || (Array.isArray(discountsData) ? discountsData : []);
      return items;
    }, [discountsData]);
    
    const vouchers = rawData.filter((d: any) => d.code);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-32">
        {/* Header Section */}
        <header className="bg-white border-b border-slate-200 pt-12 md:pt-16 pb-10 md:pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto relative">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-2">
                  <button 
                    onClick={() => router.back()}
                    className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/5 border border-primary/10">
                      <Tag size={12} className="text-primary" />
                      <span className="text-[9px] md:text-[11px] font-bold text-primary uppercase tracking-wider">Ưu đãi độc quyền</span>
                  </div>
              </div>
              
              <div className="space-y-1 md:space-y-2">
                  <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter">
                    Mã giảm giá
                  </h1>
                  <p className="text-slate-600 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                    Tiết kiệm nhiều hơn với danh sách ưu đãi đặc biệt từ VNest Studio.
                  </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12 md:space-y-16">
          
          {/* Featured Voucher */}
          {vouchers.length > 0 && (
            <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110" />
              <div className="relative z-10 space-y-6 md:space-y-10">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-lg text-[10px] font-bold inline-block border border-white/20 uppercase tracking-widest">Hot Deal</div>
                  <div className="space-y-2 md:space-y-4">
                    <p className="text-white/80 text-base md:text-xl font-medium">Giảm ngay cực khủng cho đơn hàng tới</p>
                    <p className="text-5xl md:text-9xl font-black tracking-tighter leading-none">
                      {vouchers[0].percentage ? `${vouchers[0].percentage}%` : formatCurrency(vouchers[0].fixedAmount)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-8 pt-2 md:pt-4">
                    <div className="px-6 md:px-10 py-3 md:py-5 bg-white text-primary rounded-xl md:rounded-2xl font-black text-xl md:text-3xl tracking-widest shadow-xl text-center">
                      {vouchers[0].code}
                    </div>
                    <Button asChild className="h-14 md:h-16 px-10 md:px-12 rounded-xl md:rounded-2xl bg-slate-900 text-white font-bold hover:bg-white hover:text-slate-900 transition-all shadow-xl text-sm md:text-base uppercase tracking-widest">
                      <Link href="/shop">MUA SẮM NGAY</Link>
                    </Button>
                  </div>
              </div>
            </div>
          )}

          {/* Voucher List */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-200 pb-6 md:pb-10 gap-4">
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Tất cả ưu đãi</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] md:text-sm text-slate-600 font-bold">{(vouchers?.length || 0)} mã khả dụng</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
              {vouchers.length === 0 ? (
                <div className="col-span-full py-20 md:py-32 text-center bg-white border-2 border-slate-200 border-dashed rounded-[2rem] md:rounded-[3rem]">
                  <Ticket className="text-slate-200 mx-auto mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                  <p className="text-slate-500 font-bold text-sm md:text-lg">Hiện tại chưa có mã giảm giá nào.</p>
                </div>
              ) : (
                vouchers.map((voucher, idx) => (
                  <div key={voucher.id || idx} className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                    <VoucherCard voucher={voucher} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 pb-12 md:pb-20">
            {[
              { title: "Workspace", off: "Giảm 20%", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" },
              { title: "Essentials", off: "Giảm 15%", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop" },
              { title: "Smart Home", off: "Giảm 10%", img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop" }
            ].map((cat, i) => (
              <Link href="/shop" key={i} className="group relative aspect-[4/3] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-md hover:shadow-2xl transition-all">
                  <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                  <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 text-white space-y-1 md:space-y-2">
                    <p className="text-primary text-[10px] md:text-sm font-black uppercase tracking-widest">{cat.off}</p>
                    <h3 className="text-xl md:text-3xl font-black tracking-tight">{cat.title}</h3>
                  </div>
                  <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 h-10 w-10 md:h-14 md:w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20">
                    <ArrowRight size={20} />
                  </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }
