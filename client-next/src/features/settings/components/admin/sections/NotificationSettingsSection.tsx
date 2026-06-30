import { Bell, Mail, RefreshCw, Volume2 } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import { SettingsSectionCard, SettingsToggleRow } from "../shared";

interface NotificationSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function NotificationSettingsSection({
  form,
  setField,
}: NotificationSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Thông báo"
      description="Cảnh báo vận hành dành cho đội quản trị."
      icon={Bell}
    >
      <div className="space-y-4">
        <SettingsToggleRow
          title="Cảnh báo hết hàng"
          description="Gửi thông báo khi sản phẩm trong kho còn dưới ngưỡng cảnh báo."
          icon={RefreshCw}
          checked={form.stockAlert}
          onChange={(value) => setField("stockAlert", value)}
        />
        <SettingsToggleRow
          title="Thông báo đơn hàng"
          description="Bật thông báo khi có đơn hàng mới được tạo."
          icon={Bell}
          checked={form.orderNotification}
          onChange={(value) => setField("orderNotification", value)}
        />
        <SettingsToggleRow
          title="Email thông báo"
          description="Gửi email cho quản trị viên khi có sự kiện quan trọng."
          icon={Mail}
          checked={form.emailNotification}
          onChange={(value) => setField("emailNotification", value)}
        />
        <SettingsToggleRow
          title="Âm thanh thông báo"
          description="Phát âm thanh trong trang admin khi có đơn hàng mới."
          icon={Volume2}
          checked={form.soundNotification}
          onChange={(value) => setField("soundNotification", value)}
        />
      </div>
    </SettingsSectionCard>
  );
}
