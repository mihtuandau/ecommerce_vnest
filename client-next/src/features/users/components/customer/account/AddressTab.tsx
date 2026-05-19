"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, Plus, Building2, Home, Phone, Star, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
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
import { 
  useAddresses, useDeleteAddress, 
  useSetDefaultAddress, useCreateAddress, useUpdateAddress 
} from "@/features/users/hooks";
import { shippingApi } from "@/features/shipping/api";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import { Address } from "@/types/models";

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

export function AddressTab() {
  const { success } = useToast();
  const { data: addressData, isLoading: isLoadingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
    street: "",
    isDefault: false
  });

  useEffect(() => {
    shippingApi.getProvinces().then(res => setProvinces(res.data || []));
  }, []);

  const handleProvinceChange = (provinceId: string) => {
    setNewAddress({ ...newAddress, provinceId, districtId: "", wardCode: "" });
    shippingApi.getDistricts(Number(provinceId)).then(res => setDistricts(res.data || []));
  };

  const handleDistrictChange = (districtId: string) => {
    setNewAddress({ ...newAddress, districtId, wardCode: "" });
    shippingApi.getWards(Number(districtId)).then(res => setWards(res.data || []));
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
      city: districtName,
      state: provinceName,
      wardCode: newAddress.wardCode,
      districtCode: newAddress.districtId,
      provinceCode: newAddress.provinceId,
      isDefault: newAddress.isDefault
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewAddress({ fullName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "", isDefault: false });
        success("Đã thêm địa chỉ mới");
      }
    });
  };

  const handleEditClick = (address: Address) => {
    setEditingAddressId(address.id);
    setNewAddress({
      fullName: address.fullName,
      phone: address.phone,
      provinceId: String(address.provinceCode || ""),
      districtId: String(address.districtCode || ""),
      wardCode: String(address.wardCode || ""),
      street: address.street,
      isDefault: address.isDefault
    });
    
    if (address.provinceCode) {
      shippingApi.getDistricts(Number(address.provinceCode)).then(res => setDistricts(res.data || []));
    }
    if (address.districtCode) {
      shippingApi.getWards(Number(address.districtCode)).then(res => setWards(res.data || []));
    }
    
    setIsEditModalOpen(true);
  };

  const handleUpdateAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddressId) return;

    const provinceName = provinces.find(p => String(p.ProvinceID) === String(newAddress.provinceId))?.ProvinceName;
    const districtName = districts.find(d => String(d.DistrictID) === String(newAddress.districtId))?.DistrictName;
    const wardName = wards.find(w => String(w.WardCode) === String(newAddress.wardCode))?.WardName;

    updateAddress.mutate({
      id: editingAddressId,
      data: {
        fullName: newAddress.fullName, phone: newAddress.phone, street: newAddress.street,
        ward: wardName, city: districtName, state: provinceName,
        wardCode: newAddress.wardCode, districtCode: newAddress.districtId, provinceCode: newAddress.provinceId,
        isDefault: newAddress.isDefault
      }
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingAddressId(null);
        setNewAddress({ fullName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "", isDefault: false });
        success("Đã cập nhật địa chỉ");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(61,43,26,0.03)]">
        <div className="px-6 py-5 border-b border-brand-sand/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-espresso flex items-center gap-2.5">
              <MapPin size={18} className="text-brand-bronze" /> Địa chỉ của tôi
            </h2>
            <p className="text-[12px] text-brand-taupe mt-0.5">Quản lý các địa chỉ giao hàng của bạn</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full h-10 px-6 text-[12.5px] font-bold bg-brand-espresso text-white hover:bg-brand-espresso/90 shadow-lg shadow-brand-espresso/10 transition-all">
            <Plus size={14} className="mr-2" /> Thêm địa chỉ
          </Button>
        </div>
        
        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isLoadingAddresses ? (
              <Skeleton className="h-44 w-full rounded-2xl" />
            ) : (addressData?.addresses || []).length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-brand-sand rounded-2xl bg-brand-cream/30 text-brand-taupe text-[13px] font-medium">
                Chưa có địa chỉ nào được lưu
              </div>
            ) : (
              (addressData?.addresses || []).map((address: Address) => (
                <div key={address.id} className={cn(
                  "p-6 rounded-2xl border transition-all relative group",
                  address.isDefault ? "border-brand-espresso bg-brand-cream/10" : "border-brand-sand hover:border-brand-taupe shadow-sm"
                )}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md border",
                      address.street.toLowerCase().includes("văn phòng") || address.fullName.toLowerCase().includes("vp")
                        ? "text-blue-600 bg-blue-50 border-blue-100"
                        : "text-brand-bronze bg-brand-cream border-brand-sand"
                    )}>
                      {address.street.toLowerCase().includes("văn phòng") 
                        ? <><Building2 size={12} /> Văn phòng</> 
                        : <><Home size={12} /> Nhà riêng</>}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-bold text-white bg-brand-espresso px-2.5 py-1 rounded-md tracking-wider">Mặc định</span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[14.5px] font-bold text-brand-espresso">{address.fullName}</p>
                    <p className="text-[12.5px] text-brand-taupe font-medium flex items-center gap-1.5">
                      <Phone size={13} className="opacity-70" /> {address.phone}
                    </p>
                    <p className="text-[13px] text-brand-espresso leading-relaxed pt-1">
                      {address.street}, {address.ward}, {address.city}, {address.state}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-brand-sand/40">
                    <Button onClick={() => handleEditClick(address)} variant="outline" className="flex-1 h-9 rounded-lg border-brand-sand text-[12px] font-bold text-brand-taupe hover:text-brand-espresso">Sửa</Button>
                    {!address.isDefault && (
                      <Button onClick={() => setDefaultAddress.mutate(address.id)} variant="outline" className="flex-1 h-9 rounded-lg border-brand-sand text-[12px] font-bold text-brand-taupe hover:text-brand-espresso">
                        <Star size={13} className="mr-1.5" /> Mặc định
                      </Button>
                    )}
                    <Button onClick={() => deleteAddress.mutate(address.id)} variant="outline" className="h-9 w-9 rounded-lg border-brand-sand text-red-400 hover:text-red-600 hover:bg-red-50 p-0">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-6 rounded-2xl border-2 border-dashed border-brand-taupe/30 hover:border-brand-bronze hover:bg-brand-ivory/20 transition-all flex flex-col items-center justify-center gap-3 min-h-[180px] group"
            >
              <div className="w-11 h-11 rounded-full bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-[13.5px] font-bold text-brand-taupe group-hover:text-brand-espresso">Thêm địa chỉ mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-10 py-8 bg-brand-ivory/30 border-b border-brand-sand/50">
            <DialogTitle className="text-lg font-bold text-brand-espresso font-serif flex items-center gap-3">
              <MapPin size={20} className="text-brand-bronze" /> Thêm địa chỉ nhận hàng
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress}>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12.5px] font-medium text-brand-espresso">Tên người nhận</label>
                  <Input required placeholder="VD: Nguyễn Văn A" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12.5px] font-medium text-brand-espresso">Số điện thoại</label>
                  <Input required placeholder="VD: 0912..." value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Select value={newAddress.provinceId} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Tỉnh / Thành" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{provinces.map(p => (<SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>{p.ProvinceName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.districtId} onValueChange={handleDistrictChange} disabled={!newAddress.provinceId}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Quận / Huyện" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{districts.map(d => (<SelectItem key={d.DistrictID} value={String(d.DistrictID)}>{d.DistrictName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.wardCode} onValueChange={(val) => setNewAddress({...newAddress, wardCode: val})} disabled={!newAddress.districtId}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Phường / Xã" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{wards.map(w => (<SelectItem key={w.WardCode} value={String(w.WardCode)}>{w.WardName}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[12.5px] font-medium text-brand-espresso">Địa chỉ cụ thể</label>
                <Input required placeholder="Số nhà, tên đường..." value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
              </div>
              <div className="flex items-center gap-3 bg-brand-ivory/20 p-4 rounded-xl border border-brand-sand">
                <Checkbox 
                  id="isDefault" 
                  checked={newAddress.isDefault} 
                  onCheckedChange={(checked) => setNewAddress({...newAddress, isDefault: !!checked})} 
                />
                <label htmlFor="isDefault" className="text-brand-espresso cursor-pointer font-bold text-[11px] tracking-wider select-none">Đặt làm mặc định</label>
              </div>
            </div>
            <DialogFooter className="px-10 py-6 bg-brand-ivory/30 border-t border-brand-sand/50 gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="font-bold text-[12px] text-brand-taupe">Hủy</Button>
              <Button type="submit" disabled={createAddress.isPending} className="bg-brand-espresso hover:bg-brand-espresso/90 text-white font-bold px-10 rounded-full h-11 text-[12px] tracking-wider shadow-lg shadow-brand-espresso/10">
                {createAddress.isPending ? <Spinner size="sm" variant="white" /> : "Thêm địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setEditingAddressId(null);
          setNewAddress({ fullName: "", phone: "", provinceId: "", districtId: "", wardCode: "", street: "", isDefault: false });
        }
      }}>
        <DialogContent className="sm:max-w-[550px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-10 py-8 bg-brand-ivory/30 border-b border-brand-sand/50">
            <DialogTitle className="text-lg font-bold text-brand-espresso font-serif flex items-center gap-3">
              <MapPin size={20} className="text-brand-bronze" /> Chỉnh sửa địa chỉ nhận hàng
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAddressSubmit}>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12.5px] font-medium text-brand-espresso">Tên người nhận</label>
                  <Input required placeholder="VD: Nguyễn Văn A" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12.5px] font-medium text-brand-espresso">Số điện thoại</label>
                  <Input required placeholder="VD: 0912..." value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Select value={newAddress.provinceId} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Tỉnh / Thành" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{provinces.map(p => (<SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>{p.ProvinceName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.districtId} onValueChange={handleDistrictChange} disabled={!newAddress.provinceId}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Quận / Huyện" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{districts.map(d => (<SelectItem key={d.DistrictID} value={String(d.DistrictID)}>{d.DistrictName}</SelectItem>))}</SelectContent>
                </Select>
                <Select value={newAddress.wardCode} onValueChange={(val) => setNewAddress({...newAddress, wardCode: val})} disabled={!newAddress.districtId}>
                  <SelectTrigger className="h-11 rounded-xl border-brand-sand text-[13px]"><SelectValue placeholder="Phường / Xã" /></SelectTrigger>
                  <SelectContent className="rounded-xl">{wards.map(w => (<SelectItem key={w.WardCode} value={String(w.WardCode)}>{w.WardName}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[12.5px] font-medium text-brand-espresso">Địa chỉ cụ thể</label>
                <Input required placeholder="Số nhà, tên đường..." value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="h-11 rounded-xl border-brand-sand" />
              </div>
              <div className="flex items-center gap-3 bg-brand-ivory/20 p-4 rounded-xl border border-brand-sand">
                <Checkbox 
                  id="isDefaultEdit" 
                  checked={newAddress.isDefault} 
                  onCheckedChange={(checked) => setNewAddress({...newAddress, isDefault: !!checked})} 
                />
                <label htmlFor="isDefaultEdit" className="text-brand-espresso cursor-pointer font-bold text-[11px] tracking-wider select-none">Đặt làm mặc định</label>
              </div>
            </div>
            <DialogFooter className="px-10 py-6 bg-brand-ivory/30 border-t border-brand-sand/50 gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-bold text-[12px] text-brand-taupe">Hủy</Button>
              <Button type="submit" disabled={updateAddress.isPending} className="bg-brand-espresso hover:bg-brand-espresso/90 text-white font-bold px-10 rounded-full h-11 text-[12px] tracking-wider shadow-lg shadow-brand-espresso/10">
                {updateAddress.isPending ? <Spinner size="sm" variant="white" /> : "Cập nhật địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
