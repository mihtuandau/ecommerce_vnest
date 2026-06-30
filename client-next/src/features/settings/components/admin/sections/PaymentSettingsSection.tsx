import { CreditCard, PackageCheck } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  SettingsToggleRow,
  settingsInputClass,
} from "../shared";

interface PaymentSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function PaymentSettingsSection({ form, setField }: PaymentSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Thanh toán"
      description="Bật tắt phương thức thanh toán và môi trường xử lý."
      icon={CreditCard}
    >
      <div className="space-y-4">
        <SettingsToggleRow
          title="Thanh toán COD"
          description="Cho phép khách hàng thanh toán khi nhận hàng."
          icon={PackageCheck}
          checked={form.codEnabled}
          onChange={(value) => setField("codEnabled", value)}
        />
        <SettingsToggleRow
          title="Thanh toán VNPay"
          description="Cho phép khách hàng thanh toán online qua VNPay."
          icon={CreditCard}
          checked={form.vnpayEnabled}
          onChange={(value) => setField("vnpayEnabled", value)}
        />
        <SettingsField label="Môi trường thanh toán">
          <select
            value={form.paymentEnvironment}
            onChange={(e) =>
              setField(
                "paymentEnvironment",
                e.target.value as SettingsFormState["paymentEnvironment"]
              )
            }
            className={settingsInputClass}
          >
            <option value="test">Test</option>
            <option value="live">Live</option>
          </select>
        </SettingsField>
      </div>
    </SettingsSectionCard>
  );
}
