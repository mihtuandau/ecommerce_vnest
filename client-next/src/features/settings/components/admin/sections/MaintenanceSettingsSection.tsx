import { Globe, ShieldAlert } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  SettingsToggleRow,
  settingsTextareaClass,
} from "../shared";

interface MaintenanceSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function MaintenanceSettingsSection({
  form,
  setField,
}: MaintenanceSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Bảo trì"
      description="Điều khiển trạng thái hoạt động của storefront."
      icon={ShieldAlert}
    >
      <SettingsToggleRow
        title="Chế độ bảo trì"
        description="Tạm thời đóng cửa hàng để bảo dưỡng hệ thống."
        icon={Globe}
        checked={form.maintenanceMode}
        onChange={(value) => setField("maintenanceMode", value)}
      />
      <SettingsField label="Thông báo bảo trì">
        <textarea
          value={form.maintenanceMessage}
          onChange={(e) => setField("maintenanceMessage", e.target.value)}
          className={settingsTextareaClass}
        />
      </SettingsField>
    </SettingsSectionCard>
  );
}
