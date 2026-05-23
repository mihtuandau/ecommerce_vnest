import { Input } from "@/components/ui/Input";
import { PackageCheck } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  settingsInputClass,
} from "../shared";

interface OrderSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function OrderSettingsSection({ form, setField }: OrderSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Đơn hàng"
      description="Quy tắc vận hành áp dụng cho đơn hàng và hoàn trả."
      icon={PackageCheck}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Tự hủy đơn chưa thanh toán sau (phút)">
          <Input
            type="number"
            value={form.autoCancelUnpaidMinutes}
            onChange={(e) =>
              setField("autoCancelUnpaidMinutes", Number(e.target.value))
            }
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Thời hạn yêu cầu hoàn trả (ngày)">
          <Input
            type="number"
            value={form.returnWindowDays}
            onChange={(e) => setField("returnWindowDays", Number(e.target.value))}
            className={settingsInputClass}
          />
        </SettingsField>
      </div>
    </SettingsSectionCard>
  );
}
