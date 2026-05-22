export interface ShippingLocation {
  ProvinceID?: number;
  ProvinceName?: string;
  DistrictID?: number;
  DistrictName?: string;
  WardCode?: string;
  WardName?: string;
  [key: string]: unknown;
}

export interface CalculateShippingFeePayload {
  to_district_id: number;
  to_ward_code: string;
  weight: number;
}
