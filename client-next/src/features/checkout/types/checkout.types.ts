export interface ShippingLocation {
  ProvinceID?: number;
  ProvinceName?: string;
  DistrictID?: number;
  DistrictName?: string;
  WardCode?: string;
  WardName?: string;
  [key: string]: unknown;
}

export interface SavedCheckoutAddress {
  id?: number | string;
  fullName?: string;
  phone?: string;
  provinceId?: string;
  districtId?: string;
  wardCode?: string;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  street?: string;
  isDefault?: boolean;
}

export interface PaymentReturnOrder {
  id: number | string;
  orderCode?: string;
  status?: string;
  paymentStatus?: string;
  total?: number;
}
