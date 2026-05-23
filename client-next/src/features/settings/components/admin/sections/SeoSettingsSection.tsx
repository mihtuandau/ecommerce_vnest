import { Input } from "@/components/ui/Input";
import { Image as ImageIcon, Search } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  settingsInputClass,
  settingsTextareaClass,
} from "../shared";

interface SeoSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function SeoSettingsSection({ form, setField }: SeoSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="SEO"
      description="Thông tin mặc định dùng khi trang chưa có meta riêng."
      icon={Search}
    >
      <div className="space-y-5">
        <SettingsField label="Meta title mặc định">
          <Input
            value={form.defaultMetaTitle}
            onChange={(e) => setField("defaultMetaTitle", e.target.value)}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Meta description mặc định">
          <textarea
            value={form.defaultMetaDescription}
            onChange={(e) => setField("defaultMetaDescription", e.target.value)}
            className={settingsTextareaClass}
          />
        </SettingsField>
        <SettingsField label="OG image mặc định" icon={ImageIcon}>
          <Input
            value={form.defaultOgImage}
            onChange={(e) => setField("defaultOgImage", e.target.value)}
            placeholder="https://..."
            className={settingsInputClass}
          />
        </SettingsField>
      </div>
    </SettingsSectionCard>
  );
}
