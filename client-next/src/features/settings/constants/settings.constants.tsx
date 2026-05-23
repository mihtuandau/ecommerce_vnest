import {
  Bell,
  CreditCard,
  PackageCheck,
  Search,
  ShieldAlert,
  Store,
  Truck,
} from "lucide-react";
import type { SystemSettings } from "@/features/settings/types/settings.types";
import type {
  SettingsFormState,
  SettingsSectionId,
} from "@/features/settings/types/settings-form.types";

export const defaultSettingsFormState: SettingsFormState = {
  storeName: "LUXE E-Commerce",
  storeEmail: "contact@luxe.vn",
  storePhone: "1900 1234",
  storeAddress: "LUXE Shop, Hà Nội",
  storeLogo: "",
  storeFavicon: "",
  shippingFee: 30000,
  freeShippingThreshold: 500000,
  shippingProvider: "GHN",
  maintenanceMode: false,
  maintenanceMessage: "Cửa hàng đang bảo trì. Vui lòng quay lại sau.",
  stockAlert: true,
  orderNotification: true,
  emailNotification: true,
  soundNotification: true,
  codEnabled: true,
  vnpayEnabled: true,
  paymentEnvironment: "test",
  defaultMetaTitle: "VNEST Store",
  defaultMetaDescription: "Mua sắm sản phẩm chất lượng tại VNEST.",
  defaultOgImage: "",
  autoCancelUnpaidMinutes: 30,
  returnWindowDays: 7,
};

export const settingsSections = [
  {
    id: "store",
    label: "Cửa hàng",
    description: "Thông tin thương hiệu và liên hệ",
    icon: Store,
  },
  {
    id: "shipping",
    label: "Vận chuyển",
    description: "Phí giao hàng và nhà vận chuyển",
    icon: Truck,
  },
  {
    id: "maintenance",
    label: "Bảo trì",
    description: "Chế độ hoạt động storefront",
    icon: ShieldAlert,
  },
  {
    id: "notifications",
    label: "Thông báo",
    description: "Cảnh báo kho và đơn hàng",
    icon: Bell,
  },
  {
    id: "payments",
    label: "Thanh toán",
    description: "COD, VNPay và môi trường",
    icon: CreditCard,
  },
  {
    id: "seo",
    label: "SEO",
    description: "Meta mặc định của storefront",
    icon: Search,
  },
  {
    id: "orders",
    label: "Đơn hàng",
    description: "Tự hủy đơn và hoàn trả",
    icon: PackageCheck,
  },
] as const satisfies Array<{
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: typeof Store;
}>;

export function toSettingsFormState(
  settings?: SystemSettings | null
): SettingsFormState {
  return {
    ...defaultSettingsFormState,
    ...settings,
    shippingFee: Number(
      settings?.shippingFee ?? defaultSettingsFormState.shippingFee
    ),
    freeShippingThreshold: Number(
      settings?.freeShippingThreshold ??
        defaultSettingsFormState.freeShippingThreshold
    ),
    autoCancelUnpaidMinutes: Number(
      settings?.autoCancelUnpaidMinutes ??
        defaultSettingsFormState.autoCancelUnpaidMinutes
    ),
    returnWindowDays: Number(
      settings?.returnWindowDays ?? defaultSettingsFormState.returnWindowDays
    ),
    paymentEnvironment:
      settings?.paymentEnvironment ??
      defaultSettingsFormState.paymentEnvironment,
  };
}

