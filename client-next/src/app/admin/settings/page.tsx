"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/hooks/useToast";
import {
  Settings as SettingsIcon,
  Store,
  Truck,
  ShieldAlert,
  Save,
  Globe,
  Volume2,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useSystemSettings, useUpdateSystemSettings } from "@/features/settings/hooks";

export default function AdminSettingsPage() {
  const toast = useToast();
  const { data: settings, isLoading: isQueryLoading } = useSystemSettings();
  const updateSettingsMutation = useUpdateSystemSettings();

  // Form State
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const [shippingFee, setShippingFee] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [stockAlert, setStockAlert] = useState(true);
  const [orderNotification, setOrderNotification] = useState(true);

  // Sync settings data to form state
  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || "LUXE E-Commerce");
      setStoreEmail(settings.storeEmail || "contact@luxe.vn");
      setStorePhone(settings.storePhone || "1900 1234");
      setStoreAddress(settings.storeAddress || "LUXE Shop, Hà Nội");
      setShippingFee(String(settings.shippingFee ?? 30000));
      setFreeShippingThreshold(String(settings.freeShippingThreshold ?? 500000));
      setMaintenanceMode(!!settings.maintenanceMode);
      setStockAlert(!!settings.stockAlert);
      setOrderNotification(!!settings.orderNotification);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(
      {
        storeName,
        storeEmail,
        storePhone,
        storeAddress,
        shippingFee: Number(shippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        maintenanceMode,
        stockAlert,
        orderNotification,
      },
      {
        onSuccess: () => {
          toast.success("Đã lưu cấu hình hệ thống thực tế thành công!");
        },
        onError: () => {
          toast.error("Không thể lưu cấu hình hệ thống. Vui lòng thử lại!");
        },
      }
    );
  };

  const isSaving = updateSettingsMutation.isPending;

  if (isQueryLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" variant="slate" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Đang tải cấu hình hệ thống...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Unified Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
          Cấu hình hệ thống
        </h1>
        <p className="text-slate-500 text-sm">
          Quản lý các thiết lập chung, vận chuyển và chế độ hoạt động của cửa hàng.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Settings Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Store Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <Store className="h-5 w-5 text-slate-400" />
              <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider">
                Thông tin cửa hàng
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  Tên cửa hàng
                </label>
                <div className="relative">
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email liên hệ
                </label>
                <Input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Hotline cửa hàng
                </label>
                <Input
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Địa chỉ chính thức
                </label>
                <Input
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Shipping Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <Truck className="h-5 w-5 text-slate-400" />
              <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider">
                Cấu hình vận chuyển
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">
                  Phí vận chuyển mặc định (đ)
                </label>
                <Input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">
                  Ngưỡng miễn phí giao hàng (đ)
                </label>
                <Input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-850 font-medium pl-3 focus:ring-slate-900/5 transition-all text-sm bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: System Switches & Actions */}
        <div className="space-y-6">
          {/* Card 3: System Status Toggle */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <ShieldAlert className="h-5 w-5 text-slate-400" />
              <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider">
                Trạng thái hệ thống
              </h2>
            </div>

            <div className="space-y-5">
              {/* Toggle 1: Maintenance Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-slate-400" /> Chế độ bảo trì
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal">
                    Tạm thời đóng cửa hàng để bảo dưỡng hệ thống.
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                  className="data-[state=checked]:!bg-slate-900"
                />
              </div>

              {/* Toggle 2: Stock Alert */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4 text-slate-400" /> Cảnh báo hết hàng
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal">
                    Gửi thông báo khi sản phẩm trong kho còn dưới 5.
                  </p>
                </div>
                <Switch
                  checked={stockAlert}
                  onCheckedChange={setStockAlert}
                  className="data-[state=checked]:!bg-slate-900"
                />
              </div>

              {/* Toggle 3: Sound Notification */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4 text-slate-400" /> Âm thanh thông báo
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal">
                    Phát âm thanh khi có đơn hàng mới được tạo.
                  </p>
                </div>
                <Switch
                  checked={orderNotification}
                  onCheckedChange={setOrderNotification}
                  className="data-[state=checked]:!bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Action Save Button Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold gap-2 shadow-lg shadow-slate-200 transition-all active:scale-98 cursor-pointer"
              disabled={isSaving}
            >
              {isSaving ? (
                <Spinner size="sm" variant="white" />
              ) : (
                <Save className="h-4.5 w-4.5" />
              )}
              Lưu cấu hình
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full h-11 rounded-xl border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              disabled={isSaving}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
