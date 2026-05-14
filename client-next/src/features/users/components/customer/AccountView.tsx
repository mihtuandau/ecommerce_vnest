"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  User, MapPin, Lock, Camera, ShoppingBag, 
  Trash2, Plus, Heart, LogOut, ShieldCheck, Edit3
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
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

import { useSearchParams, useRouter } from "next/navigation";
import { productsApi } from "@/features/products/api";
import { Order, Address } from "@/types/models";

type Tab = "info" | "address" | "security" | "orders" | "wishlist";

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
  const { user, logout } = useAuthStore();
  const { success, error } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync activeTab with URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (tab && ["info", "address", "security", "orders", "wishlist"].includes(tab)) {
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

  // Stats logic
  const finalizedOrders = myOrders?.filter((order: Order) => {
    const isPaid = order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' || order.payment?.status === 'PAID' || order.payment?.status === 'SUCCESS';
    const isDelivered = order.status === 'DELIVERED';
    return isDelivered && isPaid;
  }) || [];

  const pendingOrdersCount = myOrders?.filter((o: Order) => o.status === 'PENDING' || o.status === 'PROCESSING').length || 0;
  const totalOrders = finalizedOrders.length;
  const totalSpending = finalizedOrders.reduce((acc: number, order: any) => acc + (order.totalAmount || order.total || 0), 0);

  // Form states
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "", isDefault: false
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
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
    updateProfile.mutate({ name: form.name, phone: form.phone }, {
      onSuccess: () => setIsEditModalOpen(false)
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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const provinceName = provinces.find(p => String(p.ProvinceID) === String(newAddress.provinceId))?.ProvinceName;
    const districtName = districts.find(d => String(d.DistrictID) === String(newAddress.districtId))?.DistrictName;
    const wardName = wards.find(w => String(w.WardCode) === String(newAddress.wardCode))?.WardName;

    createAddress.mutate({
      fullName: newAddress.fullName, phone: newAddress.phone, street: newAddress.street,
      ward: wardName, city: districtName, state: provinceName,
      wardCode: newAddress.wardCode, districtCode: newAddress.districtId, provinceCode: newAddress.provinceId,
      isDefault: newAddress.isDefault
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewAddress({ fullName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "", isDefault: false });
        success("Đã thêm địa chỉ mới");
      }
    });
  };

  if (!mounted || !user) return null;

  interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
  }

  const menuItems: MenuItem[] = [
    { key: "info", label: "Thông tin cá nhân", icon: <User size={18} /> },
    { key: "security", label: "Bảo mật", icon: <ShieldCheck size={18} /> },
    { key: "address", label: "Địa chỉ", icon: <MapPin size={18} /> },
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-64 shrink-0">
            <h2 className="px-4 py-2 text-[11px] font-medium text-slate-400 tracking-wider mb-4 uppercase">Tài khoản</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => item.href ? router.push(item.href) : setActiveTab(item.key as Tab)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                    activeTab === item.key 
                      ? "bg-white text-primary border border-slate-200 shadow-sm font-semibold" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium"
                  )}
                >
                  <span className={activeTab === item.key ? "text-primary" : "text-slate-400"}>{item.icon}</span>
                  <span className="text-[14px]">{item.label}</span>
                </button>
              ))}
              <div className="pt-6 mt-4 border-t border-slate-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut size={18} />
                  <span className="text-[14px]">Đăng xuất</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 space-y-10 w-full">
            {activeTab === "info" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                
                {/* Profile Card */}
                <div className="bg-white border border-slate-200 rounded-[32px] p-10 space-y-10 shadow-sm shadow-slate-100/50">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group/avatar">
                        <div className="h-28 w-28 rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-50 ring-1 ring-slate-200 relative">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name || ""} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary text-4xl font-bold">
                              {user.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <label className="absolute bottom-1 right-1 h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 cursor-pointer hover:text-primary hover:border-primary transition-all shadow-sm">
                          <Camera size={14} />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                      </div>

                      <div className="text-center md:text-left">
                        <h1 className="text-[32px] font-bold text-[#3D2B1A] mb-1 font-serif">{user.name}</h1>
                        <p className="text-[#8A7966] text-sm mb-4 font-medium">{user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-lg px-2.5 py-0.5 text-[10px] font-medium">Đã xác minh</Badge>
                          <span className="px-2.5 py-0.5 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-semibold text-primary uppercase">Khách hàng</span>
                        </div>
                      </div>
                    </div>

                    <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="rounded-xl border-slate-200 px-8 font-semibold h-11 text-xs text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                      <Edit3 size={14} className="mr-2" /> Chỉnh sửa thông tin
                    </Button>
                  </div>

                  {/* Info Details */}
                  <div className="space-y-8">
                    <h2 className="text-[18px] font-bold text-[#3D2B1A] flex items-center gap-3 font-serif">
                      <span className="w-1.5 h-6 bg-[#C4783A] rounded-full opacity-40" /> Thông tin cá nhân
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Họ và tên</p>
                        <p className="text-[15px] font-medium text-slate-800">{user.name || "Chưa cập nhật"}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Email liên hệ</p>
                        <p className="text-[15px] font-medium text-slate-800">{user.email}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Số điện thoại</p>
                        <p className="text-[15px] font-medium text-slate-800">{(user as any).phone || "Chưa cập nhật"}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Phân hạng</p>
                        <p className="text-[15px] font-medium text-slate-800">Khách hàng thân thiết</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white border border-slate-200 rounded-[32px] p-10 space-y-10 shadow-sm shadow-slate-100/50">
                  <h2 className="text-[18px] font-bold text-[#3D2B1A] flex items-center gap-3 font-serif">
                    <span className="w-1.5 h-6 bg-[#C4783A] rounded-full opacity-40" /> Thống kê hoạt động
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 p-8 rounded-[24px] border border-slate-200/60 transition-all group hover:border-primary/20">
                       <p className="text-[12px] font-medium text-slate-400 mb-2">Đơn hàng hoàn tất</p>
                       <div className="flex items-baseline gap-3">
                          <p className="text-4xl font-bold text-slate-900 tabular-nums">{totalOrders}</p>
                          <p className="text-[12px] text-slate-400 font-medium">{pendingOrdersCount} đơn đang xử lý</p>
                       </div>
                    </div>
                    <div className="bg-slate-50/50 p-8 rounded-[24px] border border-slate-200/60 transition-all group hover:border-primary/20">
                       <p className="text-[12px] font-medium text-slate-400 mb-2">Tổng chi tiêu</p>
                        <p className="text-4xl font-bold text-[#3D2B1A] tabular-nums font-serif">{formatCurrency(totalSpending)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 animate-in fade-in duration-400 shadow-sm shadow-slate-100/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-bold text-[#3D2B1A] flex items-center gap-3 font-serif">
                    <span className="w-1.5 h-6 bg-[#C4783A] rounded-full opacity-40" /> Danh sách địa chỉ
                  </h2>
                  <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-9 px-6 text-[11px] shadow-sm transition-all">
                    <Plus size={14} className="mr-2" /> Thêm địa chỉ
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isLoadingAddresses ? (
                    <Skeleton className="h-32 w-full rounded-2xl" />
                  ) : (addressData?.addresses || []).length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30 text-slate-400 text-xs font-medium">
                      Chưa có địa chỉ giao hàng nào
                    </div>
                  ) : (
                    (addressData?.addresses || []).map((address: Address) => (
                      <div key={address.id} className={cn(
                        "p-5 rounded-2xl border transition-all relative group",
                        address.isDefault ? "border-primary/40 bg-primary/[0.02]" : "border-slate-100 hover:border-slate-300"
                      )}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[14px] font-semibold text-slate-900">{address.fullName}</p>
                              {address.isDefault && (
                                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 uppercase tracking-tighter">Mặc định</span>
                              )}
                            </div>
                            <p className="text-[12px] text-slate-500 font-medium">{address.phone}</p>
                            <p className="text-[12px] text-slate-600 leading-snug pt-1">
                              {address.street}, {address.ward}, {address.city}, {address.state}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="sm" onClick={() => deleteAddress.mutate(address.id)} className="h-7 w-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 p-0 transition-colors">
                              <Trash2 size={13} />
                            </Button>
                            {!address.isDefault && (
                              <Button variant="ghost" size="sm" onClick={() => setDefaultAddress.mutate(address.id)} className="h-7 w-7 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/5 p-0 transition-colors" title="Đặt làm mặc định">
                                <MapPin size={13} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-10 space-y-10 animate-in fade-in duration-400 shadow-sm shadow-slate-100/50">
                <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full opacity-40" /> Bảo mật tài khoản
                </h2>
                <form className="max-w-xl space-y-8">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-slate-500 ml-1">Mật khẩu hiện tại</label>
                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Mật khẩu mới</label>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Xác nhận mật khẩu</label>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12 px-10 text-sm shadow-sm transition-all">
                    Cập nhật mật khẩu
                  </Button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl p-0 overflow-hidden border-none shadow-xl">
          <DialogHeader className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <DialogTitle className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-primary" /> Cập nhật thông tin cá nhân
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">Họ và tên</label>
                <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">Số điện thoại</label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <DialogFooter className="px-8 py-5 bg-slate-50 border-t border-slate-200 gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-medium">Hủy</Button>
              <Button type="submit" disabled={updateProfile.isPending} className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 rounded-xl shadow-sm">
                {updateProfile.isPending ? <Spinner size="sm" variant="white" /> : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-xl">
          <DialogHeader className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <DialogTitle className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Thêm địa chỉ giao hàng
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress}>
            <div className="p-8 space-y-6 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-500">Người nhận</label>
                  <Input required placeholder="Họ tên" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-500">Số điện thoại</label>
                  <Input required placeholder="Số điện thoại" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-slate-50" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select value={newAddress.provinceId} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="Tỉnh/Thành" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{provinces.map(p => (<SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>{p.ProvinceName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.districtId} onValueChange={handleDistrictChange} disabled={!newAddress.provinceId}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="Quận/Huyện" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{districts.map(d => (<SelectItem key={d.DistrictID} value={String(d.DistrictID)}>{d.DistrictName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.wardCode} onValueChange={(val) => setNewAddress({...newAddress, wardCode: val})} disabled={!newAddress.districtId}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50"><SelectValue placeholder="Phường/Xã" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{wards.map(w => (<SelectItem key={w.WardCode} value={String(w.WardCode)}>{w.WardName}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-slate-500">Địa chỉ cụ thể</label>
                <Input required placeholder="Số nhà, tên đường..." value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-slate-50" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isDefault" className="h-4 w-4 rounded border-slate-200 text-primary cursor-pointer" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} />
                <label htmlFor="isDefault" className="text-slate-600 cursor-pointer font-medium">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>
            <DialogFooter className="px-8 py-5 bg-slate-50 border-t border-slate-200">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="font-medium">Hủy</Button>
              <Button type="submit" disabled={createAddress.isPending} className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 rounded-xl shadow-sm">
                {createAddress.isPending ? <Spinner size="sm" variant="white" /> : "Thêm địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
