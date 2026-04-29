"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { shippingApi } from "@/features/shipping/api";
import { ordersApi } from "@/features/orders/api";
import { discountsApi } from "@/features/discounts/api";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Truck, Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useAddresses } from "@/features/users/hooks";
import Link from "next/link";

// Sub-components
import { CheckoutSteps } from "./CheckoutSteps";
import { ShippingForm } from "./ShippingForm";
import { PaymentMethods } from "./PaymentMethods";
import { OrderSummary } from "./OrderSummary";

type AddressOption = {
  fullName?: string;
  phone?: string;
  email?: string;
  street?: string;
  provinceCode?: string | number | null;
  districtCode?: string | number | null;
  wardCode?: string | number | null;
  isDefault?: boolean;
};

type Province = {
  ProvinceID: number;
  ProvinceName: string;
};

type District = {
  DistrictID: number;
  DistrictName: string;
};

type Ward = {
  WardCode: string;
  WardName: string;
};

type CheckoutDiscount = {
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
};


export function CheckoutContainer() {
  const { items, buyNowItem, clearBuyNowItem } = useCartStore();
  const { user } = useAuthStore();
  const { success, error, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [hasAppliedDefault, setHasAppliedDefault] = useState(false);
  const [isSuccessRedirecting, setIsSuccessRedirecting] = useState(false);

  const isBuyNow = searchParams.get("buyNow") === "true";
  const displayItems = React.useMemo(
    () => (isBuyNow && buyNowItem ? [buyNowItem] : items.filter((i) => i.selected)),
    [isBuyNow, buyNowItem, items]
  );

  // Hook lấy địa chỉ đã lưu để tự động áp dụng
  const { data: addressData } = useAddresses();

  const subtotal = React.useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0),
    [displayItems]
  );

  const totalOriginal = React.useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
    [displayItems]
  );

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Discount states
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<CheckoutDiscount | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountChoice, setDiscountChoice] = useState<"FLASH_SALE" | "VOUCHER">("FLASH_SALE");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
    street: "",
    paymentMethod: "COD",
  });

  // Khởi tạo form khi mount và có user
  useEffect(() => {
    setMounted(true);
    shippingApi.getProvinces().then((res) => setProvinces(res.data || []));

    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const applySavedAddress = async (addr: AddressOption) => {
    try {
      const provinceId = addr.provinceCode ? String(addr.provinceCode) : "";
      const districtId = addr.districtCode ? String(addr.districtCode) : "";
      let wardCode = addr.wardCode ? String(addr.wardCode) : "";

      // Tải dữ liệu Quận và Phường trước khi cập nhật form
      if (provinceId) {
        const distRes = await shippingApi.getDistricts(Number(provinceId));
        const dists = distRes.data || [];
        setDistricts(dists);
        
        if (districtId) {
          const wardRes = await shippingApi.getWards(Number(districtId));
          const wrds = wardRes.data || [];
          setWards(wrds);
          
          // Nếu địa chỉ lưu không có phường, lấy phường đầu tiên
          if (!wardCode && wrds.length > 0) {
            wardCode = wrds[0].WardCode;
          }
        }
      }

      // Cập nhật TOÀN BỘ form một lần duy nhất để tránh mất dữ liệu
      setForm((prev) => ({
        ...prev,
        fullName: addr.fullName || prev.fullName,
        phone: addr.phone || prev.phone,
        email: addr.email || prev.email || "",
        provinceId,
        districtId,
        wardCode,
        street: addr.street || "",
      }));

    } catch {
      error("Không thể áp dụng địa chỉ đã lưu");
    }
  };

  useEffect(() => {
    if (user && addressData?.addresses && addressData.addresses.length > 0 && mounted && !hasAppliedDefault) {
      const defaultAddr =
        addressData.addresses.find((a: AddressOption) => a.isDefault) ||
        addressData.addresses[0];
      if (defaultAddr) {
        applySavedAddress(defaultAddr);
        setHasAppliedDefault(true);
      }
    }
  }, [addressData, mounted, hasAppliedDefault, user]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.districtId) {
        setIsCalculatingFee(true);
        try {
          const totalWeight = displayItems.reduce((sum, i) => sum + 1000 * i.quantity, 0);
          const res = await shippingApi.calculateFee({
            to_district_id: Number(form.districtId),
            to_ward_code: form.wardCode || "",
            weight: totalWeight,
          });
          setShippingFee(res.data?.total || 30000);
        } catch {
          setShippingFee(30000);
        } finally {
          setIsCalculatingFee(false);
        }
      } else {
        setShippingFee(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.districtId, form.wardCode, displayItems]);

  // Handle Apply Discount
  const handleApplyDiscount = async () => {
    const codeToValidate = discountCode.trim().toUpperCase();
    if (!codeToValidate) return;
    
    setIsApplyingDiscount(true);
    try {
      const res = await discountsApi.validateDiscount(codeToValidate);
      
      if (!res.isValid) {
        warning(res.message || "Mã giảm giá không hợp lệ");
        return;
      }

      const discount = res.discount;
      
      // LOGIC ĐỒNG BỘ VỚI BACKEND: Chọn mức giảm tốt nhất
      const totalOriginal = displayItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
      const totalFlashSale = displayItems.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
      const flashSaleSaving = totalOriginal - totalFlashSale;

      let voucherSaving = 0;
      const isPercentage = discount.discountType === "PERCENTAGE";
      const val = discount.discountValue || 0;

      if (isPercentage) {
        voucherSaving = Math.round((totalOriginal * val) / 100);
        if (discount.maxDiscountAmount && voucherSaving > discount.maxDiscountAmount) {
          voucherSaving = discount.maxDiscountAmount;
        }
      } else {
        voucherSaving = val;
      }
      voucherSaving = Math.min(voucherSaving, totalOriginal);

      if (discount.minOrderAmount && totalOriginal < discount.minOrderAmount) {
        warning(`Mã chỉ áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(discount.minOrderAmount)}đ`);
        return;
      }

      // So sánh: Nếu Flash Sale tốt hơn hoặc bằng -> Ưu tiên Flash Sale
      if (flashSaleSaving >= voucherSaving && flashSaleSaving > 0) {
        setAppliedDiscount({ ...discount, code: codeToValidate });
        setDiscountAmount(0); // Không cộng dồn
        setDiscountChoice("FLASH_SALE");
        warning("Flash Sale đang có giá tốt hơn mã giảm giá này. Chúng tôi sẽ giữ giá Flash Sale cho bạn.");
      } else {
        // Voucher tốt hơn -> Áp dụng Voucher trên GIÁ GỐC
        setAppliedDiscount({ ...discount, code: codeToValidate });
        setDiscountAmount(voucherSaving);
        setDiscountChoice("VOUCHER");
        success(`Đã áp dụng mã giảm giá: -${new Intl.NumberFormat('vi-VN').format(voucherSaving)}đ`);
      }
    } catch (err: unknown) {
      error("Mã giảm giá không hợp lệ");
      setAppliedDiscount(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode("");
    success("Đã gỡ mã giảm giá");
  };

  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  const handleProvinceChange = async (id: string) => {
    setForm((prev) => ({ ...prev, provinceId: id, districtId: "", wardCode: "" }));
    setDistricts([]);
    setWards([]);
    
    if (id) {
      setIsLoadingDistricts(true);
      try {
        const res = await shippingApi.getDistricts(Number(id));
        const data = res.data || [];
        setDistricts(data);
      } catch {
        error("Không thể tải danh sách Quận/Huyện");
      } finally {
        setIsLoadingDistricts(false);
      }
    }
  };

  const handleDistrictChange = async (id: string) => {
    setForm((prev) => ({ ...prev, districtId: id, wardCode: "" }));
    setWards([]);
    
    if (id) {
      setIsLoadingWards(true);
      try {
        const res = await shippingApi.getWards(Number(id));
        const data = res.data || [];
        setWards(data);
        // Tự động chọn phường đầu tiên nếu có dữ liệu để tránh lỗi "chưa chọn"
        if (data.length > 0) {
          setForm(prev => ({ ...prev, wardCode: data[0].WardCode }));
        }
      } catch {
        error("Không thể tải danh sách Phường/Xã");
      } finally {
        setIsLoadingWards(false);
      }
    }
  };

  const handleWardChange = (code: string) => {
    if (!code) return; // Chặn việc reset về rỗng do lỗi component
    setForm((prev) => ({ ...prev, wardCode: code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra từng trường và báo lỗi cụ thể
    if (!form.fullName) return error("Vui lòng nhập họ và tên người nhận");
    
    // Kiểm tra số điện thoại (Regex cho di động Việt Nam)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!form.phone) return error("Vui lòng nhập số điện thoại");
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      return error("Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 số (ví dụ: 0912345678)");
    }

    if (!form.email) return error("Vui lòng nhập email nhận thông báo");
    if (!form.provinceId) return error("Vui lòng chọn Tỉnh / Thành phố");
    if (!form.districtId) return error("Vui lòng chọn Quận / Huyện");
    if (!form.wardCode) return error("Vui lòng chọn Phường / Xã");
    if (!form.street) return error("Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường)");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isGuest = !user;
      const orderData = {
        items: displayItems.map((i) => ({
          variantId: Number(i.variantId),
          quantity: i.quantity,
        })),
        shippingInfo: {
          fullName: form.fullName,
          phone: form.phone,
          province: provinces.find((p) => String(p.ProvinceID) === String(form.provinceId))?.ProvinceName,
          district: districts.find((d) => String(d.DistrictID) === String(form.districtId))?.DistrictName,
          ward: wards.find((w) => w.WardCode === form.wardCode)?.WardName,
          street: form.street,
          districtCode: form.districtId,
          wardCode: form.wardCode,
        },
        paymentMethod: form.paymentMethod,
        shippingFee: Math.round(shippingFee),
        discountCode: appliedDiscount?.code || undefined,
        guestEmail: form.email,
        guestPhone: form.phone,
      };

      const res = await ordersApi.createOrder(orderData, isGuest);
      const paymentLink = res.paymentLink || res.payment?.paymentLink;

      if (form.paymentMethod === "VNPAY" && !paymentLink) {
        throw new Error("Không thể tạo liên kết thanh toán VNPay. Vui lòng thử lại.");
      }

      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      success("Đặt hàng thành công!");
      setIsSuccessRedirecting(true);
      
      const successParams = new URLSearchParams();
      if (res.orderCode) successParams.set("orderCode", res.orderCode);
      if (res.id) successParams.set("orderId", String(res.id));
      successParams.set("contact", form.phone);

      // Chuyển hướng TRƯỚC khi xoá giỏ hàng để tránh flash UI trống
      router.push(`/checkout/success?${successParams.toString()}`);

      // Xoá giỏ hàng sau khi đã bắt đầu chuyển hướng
      setTimeout(() => {
        if (isBuyNow) clearBuyNowItem();
        else displayItems.forEach((i) => useCartStore.getState().removeItem(i.variantId));
      }, 100);

    } catch (err: unknown) {
      error("Có lỗi xảy ra khi đặt hàng. Vui lòng kiểm tra lại thông tin.");
      setIsSubmitting(false); 
    }
  };

  if (!mounted) {
    return (
      <div className="bg-[#fcfdfe] min-h-screen pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-8 mb-10">
            <div className="flex items-center gap-5">
              <Skeleton className="h-11 w-11 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <Skeleton className="h-10 w-full lg:w-96 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6"><Skeleton className="h-[500px] w-full rounded-2xl" /></div>
            <div className="lg:col-span-4"><Skeleton className="h-[600px] w-full rounded-2xl shadow-sm" /></div>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình xử lý ngay khi nhấn đặt hàng hoặc sau khi thành công (Đơn giản & Đồng bộ)
  if (isSubmitting || isSuccessRedirecting) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-5">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">
              {isSuccessRedirecting ? "Đặt hàng thành công!" : "Đang xử lý đơn hàng"}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {isSuccessRedirecting 
                ? "Vui lòng chờ trong giây lát..." 
                : "Hệ thống đang xác nhận yêu cầu của bạn"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showEmpty = mounted && !isBuyNow && items.filter(i => i.selected).length === 0;
  const showBuyNowEmpty = mounted && isBuyNow && !buyNowItem;

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20">
      {(showEmpty || showBuyNowEmpty) ? (
        <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
            <Truck className="h-10 w-10 text-slate-200" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chưa có sản phẩm nào để thanh toán</h1>
          <Button onClick={() => router.push("/shop")} className="rounded-xl px-10 h-12 font-bold">
            Quay lại cửa hàng
          </Button>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-8 mb-10">
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => router.back()} className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1565C1] hover:border-[#1565C1] hover:bg-blue-50 transition-all shrink-0 shadow-sm"><ArrowLeft size={20} /></button>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Thanh toán</h1>
                <p className="text-slate-500 text-sm font-medium">Hoàn tất thông tin để đặt hàng của bạn</p>
              </div>
            </div>
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0"><CheckoutSteps /></div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <ShippingForm 
                form={form}
                setForm={setForm}
                provinces={provinces}
                districts={districts}
                wards={wards}
                handleProvinceChange={handleProvinceChange}
                handleDistrictChange={handleDistrictChange}
                handleWardChange={handleWardChange}
                isLoadingDistricts={isLoadingDistricts}
                isLoadingWards={isLoadingWards}
                user={user}
              />
              <PaymentMethods paymentMethod={form.paymentMethod} setPaymentMethod={(method) => setForm({ ...form, paymentMethod: method })} />
            </div>
            <div className="lg:col-span-4">
              <OrderSummary 
                items={displayItems} 
                subtotal={subtotal} 
                shippingFee={shippingFee} 
                isSubmitting={isSubmitting} 
                canSubmit={true} 
                isCalculatingFee={isCalculatingFee}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                appliedDiscount={appliedDiscount}
                discountAmount={discountAmount}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
                isApplyingDiscount={isApplyingDiscount}
                totalOriginal={totalOriginal}
                discountChoice={discountChoice}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
