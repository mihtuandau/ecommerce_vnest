export interface SystemSettings {
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  storeLogo?: string;
  storeFavicon?: string;
  shippingFee?: number;
  freeShippingThreshold?: number;
  shippingProvider?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  stockAlert?: boolean;
  orderNotification?: boolean;
  emailNotification?: boolean;
  soundNotification?: boolean;
  codEnabled?: boolean;
  vnpayEnabled?: boolean;
  paymentEnvironment?: "test" | "live";
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultOgImage?: string;
  autoCancelUnpaidMinutes?: number;
  returnWindowDays?: number;
}
