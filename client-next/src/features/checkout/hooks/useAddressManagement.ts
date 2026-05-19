"use client";

import { useState, useEffect, useCallback } from "react";
import { shippingApi } from "@/features/shipping/api";
import { useAddresses } from "@/features/users/hooks";
import { useToast } from "@/hooks/useToast";
import { CheckoutFormData } from "@/features/checkout/utils/checkoutValidation";

export type AddressOption = {
  id?: string | number;
  fullName?: string;
  phone?: string;
  email?: string;
  street?: string;
  province?: string;
  district?: string;
  city?: string;
  state?: string;
  ward?: string;
  provinceCode?: string | number | null;
  districtCode?: string | number | null;
  wardCode?: string | number | null;
  isDefault?: boolean;
};

export function useAddressManagement() {
  const { error } = useToast();
  const { data: addressData } = useAddresses();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(
    null
  );

  // Load provinces on mount
  useEffect(() => {
    shippingApi.getProvinces().then((res) => setProvinces(res.data || []));
  }, []);

  const handleProvinceChange = useCallback(
    async (id: string) => {
      const provinceName =
        provinces.find((p) => String(p.ProvinceID) === String(id))?.ProvinceName || "";

      setDistricts([]);
      setWards([]);

      if (!id) {
        return {
          provinceId: id,
          provinceName,
          districtId: "",
          districtName: "",
          wardCode: "",
          wardName: "",
        };
      }

      setIsLoadingDistricts(true);
      try {
        const res = await shippingApi.getDistricts(Number(id));
        setDistricts(res.data || []);
      } finally {
        setIsLoadingDistricts(false);
      }

      return {
        provinceId: id,
        provinceName,
        districtId: "",
        districtName: "",
        wardCode: "",
        wardName: "",
      };
    },
    [provinces]
  );

  const handleDistrictChange = useCallback(
    async (id: string) => {
      const districtName =
        districts.find((d) => String(d.DistrictID) === String(id))?.DistrictName || "";

      setWards([]);

      if (!id) {
        return { districtId: id, districtName, wardCode: "", wardName: "" };
      }

      setIsLoadingWards(true);
      try {
        const res = await shippingApi.getWards(Number(id));
        setWards(res.data || []);
      } finally {
        setIsLoadingWards(false);
      }

      return { districtId: id, districtName, wardCode: "", wardName: "" };
    },
    [districts]
  );

  const handleWardChange = useCallback(
    (code: string) => {
      const wardName = wards.find((w) => w.WardCode === code)?.WardName || "";
      return { wardCode: code, wardName };
    },
    [wards]
  );

  const applySavedAddress = useCallback(
    async (addr: AddressOption): Promise<Partial<CheckoutFormData>> => {
      try {
        const provinceId = addr.provinceCode ? String(addr.provinceCode) : "";
        const districtId = addr.districtCode ? String(addr.districtCode) : "";
        let wardCode = addr.wardCode ? String(addr.wardCode) : "";

        const provinceName = addr.province || addr.state || "";
        let districtName = addr.district || addr.city || "";
        let wardName = addr.ward || "";

        if (provinceId) {
          const distRes = await shippingApi.getDistricts(Number(provinceId));
          const dists = distRes.data || [];
          setDistricts(dists);

          if (!districtName && districtId) {
            districtName =
              dists.find((d: any) => String(d.DistrictID) === districtId)
                ?.DistrictName || "";
          }

          if (districtId) {
            const wardRes = await shippingApi.getWards(Number(districtId));
            const wrds = wardRes.data || [];
            setWards(wrds);

            if (!wardCode && wrds.length > 0) wardCode = wrds[0].WardCode;
            if (!wardName && wardCode) {
              wardName = wrds.find((w: any) => w.WardCode === wardCode)?.WardName || "";
            }
          }
        }

        setSelectedAddressId(addr.id || null);

        return {
          fullName: addr.fullName || "",
          phone: addr.phone || "",
          email: addr.email || "",
          provinceId,
          provinceName,
          districtId,
          districtName,
          wardCode,
          wardName,
          street: addr.street || "",
        };
      } catch {
        error("Không thể áp dụng địa chỉ đã lưu");
        return {};
      }
    },
    [error]
  );

  return {
    provinces,
    districts,
    wards,
    isLoadingDistricts,
    isLoadingWards,
    selectedAddressId,
    setSelectedAddressId,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    applySavedAddress,
    addressData,
  };
}
