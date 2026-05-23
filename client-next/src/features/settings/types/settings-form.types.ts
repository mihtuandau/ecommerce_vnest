import type { SystemSettings } from "./settings.types";

export type SettingsSectionId =
  | "store"
  | "shipping"
  | "maintenance"
  | "notifications"
  | "payments"
  | "seo"
  | "orders";

export type SettingsFormState = Required<
  Pick<
    SystemSettings,
    | "storeName"
    | "storeEmail"
    | "storePhone"
    | "storeAddress"
    | "storeLogo"
    | "storeFavicon"
    | "shippingFee"
    | "freeShippingThreshold"
    | "shippingProvider"
    | "maintenanceMode"
    | "maintenanceMessage"
    | "stockAlert"
    | "orderNotification"
    | "emailNotification"
    | "soundNotification"
    | "codEnabled"
    | "vnpayEnabled"
    | "paymentEnvironment"
    | "defaultMetaTitle"
    | "defaultMetaDescription"
    | "defaultOgImage"
    | "autoCancelUnpaidMinutes"
    | "returnWindowDays"
  >
>;

export type SettingsSetField = <K extends keyof SettingsFormState>(
  key: K,
  value: SettingsFormState[K]
) => void;

