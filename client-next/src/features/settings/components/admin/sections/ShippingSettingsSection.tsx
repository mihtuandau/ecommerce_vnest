import { Input } from "@/components/ui/Input";
import { Truck } from "lucide-react";
import type {
  SettingsFormState,
  SettingsSetField,
} from "@/features/settings/types";
import {
  SettingsField,
  SettingsSectionCard,
  settingsInputClass,
} from "../shared";

interface ShippingSettingsSectionProps {
  form: SettingsFormState;
  setField: SettingsSetField;
}

export function ShippingSettingsSection({
  form,
  setField,
}: ShippingSettingsSectionProps) {
  return (
    <SettingsSectionCard
      title="Vận chuyển"
      description="Cấu hình phí giao hàng mặc định và điều kiện miễn phí ship."
      icon={Truck}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsField label="Phí vận chuyển mặc định (đ)">
          <Input
            type="number"
            value={form.shippingFee}
            onChange={(e) => setField("shippingFee", Number(e.target.value))}
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Ngưỡng miễn phí giao hàng (đ)">
          <Input
            type="number"
            value={form.freeShippingThreshold}
            onChange={(e) =>
              setField("freeShippingThreshold", Number(e.target.value))
            }
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Nhà vận chuyển mặc định">
          <select
            value={form.shippingProvider}
            onChange={(e) => setField("shippingProvider", e.target.value)}
            className={settingsInputClass}
          >
            <option value="GHN">GHN</option>
            <option value="GHTK">GHTK</option>
            <option value="SELF">Tự vận chuyển</option>
          </select>
        </SettingsField>
      </div>
    </SettingsSectionCard>
  );
}
