import { Input } from "@/components/ui/Input";
import { Image as ImageIcon, Mail, MapPin, Phone, Store } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  settingsInputClass,
} from "../shared";

interface StoreSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function StoreSettingsSection({ form, setField }: StoreSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Cửa hàng"
      description="Thông tin hiển thị trên storefront, hóa đơn và khu vực liên hệ."
      icon={Store}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Tên cửa hàng">
          <Input
            value={form.storeName}
            onChange={(e) => setField("storeName", e.target.value)}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Email liên hệ" icon={Mail}>
          <Input
            type="email"
            value={form.storeEmail}
            onChange={(e) => setField("storeEmail", e.target.value)}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Hotline cửa hàng" icon={Phone}>
          <Input
            value={form.storePhone}
            onChange={(e) => setField("storePhone", e.target.value)}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Địa chỉ chính thức" icon={MapPin}>
          <Input
            value={form.storeAddress}
            onChange={(e) => setField("storeAddress", e.target.value)}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Logo URL" icon={ImageIcon}>
          <Input
            value={form.storeLogo}
            onChange={(e) => setField("storeLogo", e.target.value)}
            placeholder="https://..."
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Favicon URL" icon={ImageIcon}>
          <Input
            value={form.storeFavicon}
            onChange={(e) => setField("storeFavicon", e.target.value)}
            placeholder="https://..."
            className={settingsInputClass}
          />
        </SettingsField>
      </div>
    </SettingsSectionCard>
  );
}
