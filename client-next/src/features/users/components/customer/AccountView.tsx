"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CardContent } from "@/components/ui/Card";
import { 
  User, MapPin, Lock, Camera, ShoppingBag, Wallet, 
  Phone, Trash2, CheckCircle2, X, Plus, Loader2
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  useUpdateProfile, useAddresses, useDeleteAddress, 
  useSetDefaultAddress, useCreateAddress 
} from "@/features/users/hooks";
import { useMyOrders } from "@/features/orders/hooks";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { shippingApi } from "@/features/shipping/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { useSearchParams } from "next/navigation";
import { productsApi } from "@/features/products/api";
import { Order, Address } from "@/types/models";

type Tab = "info" | "address" | "security";

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

export function AccountView() {
  const { user } = useAuthStore();
  const { success, error } = useToast();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync activeTab with URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (tab && ["info", "address", "security"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Hooks
  const updateProfile = useUpdateProfile();
  const { data: addressData, isLoading: isLoadingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const { data: myOrders } = useMyOrders();

  // Stats
  // Lọc ra các đơn hàng thành công (Đã giao VÀ Đã thanh toán)
  const completedOrders = myOrders?.filter((order: Order) => {
    const isPaid = order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' || order.payment?.status === 'PAID' || order.payment?.status === 'SUCCESS';
    const isDelivered = order.status === 'DELIVERED';
    return isDelivered && isPaid && order.status !== 'CANCELLED';
  }) || [];

  // Tổng số đơn: Chỉ đếm đơn thành công
  const totalOrders = completedOrders.length;
  
  // Tổng chi tiêu: Tổng tiền của đơn thành công
  const totalSpending = completedOrders.reduce((acc: number, order: Order) => acc + ((order as { total?: number }).total || 0), 0);

  // Profile Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Address Form State
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
    street: "",
    isDefault: false
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Sync user data to form when user is available
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: (user as { phone?: string }).phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
    // Fetch provinces for the address form
    shippingApi.getProvinces().then(res => setProvinces(res.data || []));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await productsApi.uploadImage(file);
      updateProfile.mutate({ avatar: url });
    } catch (err) {
      error("Không thể tải ảnh đại diện lên");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name: form.name,
      phone: form.phone
    });
  };

  const handleProvinceChange = async (id: string) => {
    setNewAddress(prev => ({ ...prev, provinceId: id, districtId: "", wardCode: "" }));
    const res = await shippingApi.getDistricts(Number(id));
    setDistricts(res.data || []);
    setWards([]);
  };

  const handleDistrictChange = async (id: string) => {
    setNewAddress(prev => ({ ...prev, districtId: id, wardCode: "" }));
    const res = await shippingApi.getWards(Number(id));
    setWards(res.data || []);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const provinceName = provinces.find(p => String(p.ProvinceID) === String(newAddress.provinceId))?.ProvinceName;
    const districtName = districts.find(d => String(d.DistrictID) === String(newAddress.districtId))?.DistrictName;
    const wardName = wards.find(w => String(w.WardCode) === String(newAddress.wardCode))?.WardName;

    createAddress.mutate({
      fullName: newAddress.fullName,
      phone: newAddress.phone,
      street: newAddress.street,
      ward: wardName,
      city: districtName, // Mapping City -> District
      state: provinceName, // Mapping State -> Province
      wardCode: newAddress.wardCode,
      districtCode: newAddress.districtId,
      provinceCode: newAddress.provinceId,
      isDefault: newAddress.isDefault
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewAddress({
          fullName: "",
          phone: "",
          provinceId: "",
          districtId: "",
          wardCode: "",
          street: "",
          isDefault: false
        });
      }
    });
  };

  if (!mounted || !user) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "info", label: "Thông tin", icon: <User size={13} /> },
    { key: "address", label: "Địa chỉ", icon: <MapPin size={13} /> },
    { key: "security", label: "Bảo mật", icon: <Lock size={13} /> },
  ];

  const addresses = [...(addressData?.addresses || [])].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Breadcrumbs Only */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-primary font-bold">Tài khoản</span>
        </div>

        {/* ── Profile Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || "User"} 
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md" 
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "User")}&background=0D8ABC&color=fff&size=128`;
                }}
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-lg font-medium border border-slate-200">
                {user.name?.charAt(0)}
              </div>
            )}
            <label 
              htmlFor="avatar-upload"
              className="absolute -bottom-0.5 -right-0.5 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm cursor-pointer"
            >
              {updateProfile.isPending ? <Loader2 size={11} className="animate-spin" /> : <Camera size={11} />}
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                disabled={updateProfile.isPending}
              />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-slate-900 truncate tracking-tight">{user.name}</h1>
            <p className="text-sm text-slate-600 truncate font-normal">{user.email}</p>
          </div>

          <div className="flex gap-2">
            <span className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full font-medium">
              {user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
            </span>
            <span className="text-[11px] text-primary bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-medium">
              Thành viên Minh Tuấn Shop
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors duration-200 whitespace-nowrap",
                activeTab === tab.key
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-slate-500 hover:text-primary",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Thông tin ── */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-400">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                <User size={14} className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Thông tin cá nhân</span>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-normal text-slate-500 ml-0.5">Họ và tên</label>
                      <Input
                        className="h-11 rounded-xl border-slate-200 text-sm focus-visible:ring-primary/10 transition-all font-medium"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        disabled={updateProfile.isPending}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-normal text-slate-500 ml-0.5">Email liên hệ</label>
                      <Input
                        className="h-10 rounded-xl border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
                        value={form.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-normal text-slate-500 ml-0.5">Số điện thoại</label>
                    <Input
                      className="h-11 rounded-xl border-slate-200 text-sm focus-visible:ring-primary/10 transition-all font-medium max-w-[240px]"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      disabled={updateProfile.isPending}
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="h-10 px-8 rounded-full text-sm font-bold bg-primary hover:bg-primary/90 text-white transition-all active:scale-95 shadow-md shadow-blue-500/10"
                    >
                      {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Đơn hàng</p>
                    <p className="text-base font-bold text-slate-900 leading-none mt-1">{totalOrders} đơn</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Chi tiêu</p>
                    <p className="text-base font-bold text-slate-900 leading-none mt-1">{formatCurrency(totalSpending)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Địa chỉ ── */}
        {activeTab === "address" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-400">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Sổ địa chỉ nhận hàng</span>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="outline"
                size="sm"
                className="h-9 px-6 text-xs rounded-full border-slate-200 text-slate-600 hover:bg-primary hover:text-white font-bold transition-all shadow-sm"
              >
                <Plus size={14} className="mr-1.5" /> Thêm địa chỉ mới
              </Button>
            </div>
            
            <div className="p-6">
              {isLoadingAddresses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    <MapPin size={28} className="text-slate-200" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800">Bạn chưa lưu địa chỉ nào</p>
                    <p className="text-sm text-slate-500 mt-1 font-normal">Thêm địa chỉ để nhận hàng thuận tiện hơn.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address: Address) => (
                    <div 
                      key={address.id} 
                      className={cn(
                        "group bg-white p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 h-full",
                        address.isDefault ? "border-primary bg-blue-50/20" : "border-slate-100"
                      )}
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                            address.isDefault ? "bg-primary border-primary text-white" : "bg-slate-50 border-slate-100 text-slate-400"
                          )}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          {address.isDefault && (
                            <Badge className="bg-primary text-white text-[9px] font-semibold tracking-wider h-5 px-2 rounded-lg">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-x-2 text-sm">
                            <span className="font-bold text-slate-900">{address.fullName}</span>
                            <span className="text-slate-300">|</span>
                            <span className="font-medium text-slate-600">{address.phone}</span>
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed space-y-0.5">
                            <p className="font-medium text-slate-700">{address.street}</p>
                            <p>
                              {address.ward || ""}{address.ward ? ", " : ""}
                              {address.city || address.district || ""}{(address.city || address.district) ? ", " : ""}
                              {address.state || address.province || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-auto">
                        {!address.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDefaultAddress.mutate(address.id)}
                            disabled={setDefaultAddress.isPending}
                            className="h-8 px-3 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-primary hover:bg-blue-50"
                          >
                            Thiết lập mặc định
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteAddress.mutate(address.id)}
                          disabled={deleteAddress.isPending}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 p-0"
                        >
                          {deleteAddress.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Bảo mật ── */}
        {activeTab === "security" && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-400">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <Lock size={15} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Bảo mật & Đổi mật khẩu</span>
            </div>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 ml-0.5">Mật khẩu hiện tại</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 text-sm focus-visible:ring-primary/10 transition-all font-medium"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 ml-0.5">Mật khẩu mới</label>
                    <Input
                      className="h-11 rounded-xl border-slate-200 text-sm focus-visible:ring-primary/10 transition-all font-medium"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 ml-0.5">Xác nhận mật khẩu</label>
                    <Input
                      className="h-11 rounded-xl border-slate-200 text-sm focus-visible:ring-primary/10 transition-all font-medium"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="h-10 px-10 rounded-full text-sm font-bold bg-primary hover:bg-primary/90 text-white transition-all active:scale-95 shadow-md shadow-blue-500/10"
                  >
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        )}

      </div>

      {/* ── Add Address Modal ── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Thêm địa chỉ giao hàng mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAddress}>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Họ và tên người nhận</label>
                  <Input 
                    required
                    placeholder="Nguyễn Văn A"
                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/10"
                    value={newAddress.fullName}
                    onChange={e => setNewAddress({...newAddress, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Số điện thoại</label>
                  <Input 
                    required
                    placeholder="09xx xxx xxx"
                    className="h-11 rounded-xl border-slate-200 focus:ring-primary/10"
                    value={newAddress.phone}
                    onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Tỉnh / Thành</label>
                  <Select value={newAddress.provinceId} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
                      <SelectValue placeholder="Chọn Tỉnh" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {provinces.map(p => (
                        <SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>
                          {p.ProvinceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Quận / Huyện</label>
                  <Select 
                    value={newAddress.districtId} 
                    onValueChange={handleDistrictChange}
                    disabled={!newAddress.provinceId}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
                      <SelectValue placeholder="Chọn Huyện" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {districts.map(d => (
                        <SelectItem key={d.DistrictID} value={String(d.DistrictID)}>
                          {d.DistrictName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Phường / Xã</label>
                  <Select 
                    value={newAddress.wardCode} 
                    onValueChange={(val) => setNewAddress({...newAddress, wardCode: val})}
                    disabled={!newAddress.districtId}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm">
                      <SelectValue placeholder="Chọn Xã" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {wards.map(w => (
                        <SelectItem key={w.WardCode} value={String(w.WardCode)}>
                          {w.WardName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Địa chỉ cụ thể</label>
                <Input 
                  required
                  placeholder="Số nhà, tên đường..."
                  className="h-11 rounded-xl border-slate-200 focus:ring-primary/10"
                  value={newAddress.street}
                  onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/10"
                  checked={newAddress.isDefault}
                  onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-slate-600 cursor-pointer">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>

            <DialogFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsAddModalOpen(false)}
                className="h-11 px-8 rounded-full text-slate-500 font-bold"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                disabled={createAddress.isPending}
                className="h-11 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
              >
                {createAddress.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Thêm địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}