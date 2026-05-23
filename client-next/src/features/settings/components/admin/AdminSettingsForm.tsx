"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/hooks/useToast";
import { useSystemSettings, useUpdateSystemSettings } from "@/features/settings/hooks";
import { SettingsSidebar } from "./SettingsSidebar";
import {
  defaultSettingsFormState,
  settingsSections,
  toSettingsFormState,
} from "@/features/settings/constants";
import type {
  SettingsFormState,
  SettingsSectionId,
} from "@/features/settings/types";
import {
  MaintenanceSettingsSection,
  NotificationSettingsSection,
  OrderSettingsSection,
  PaymentSettingsSection,
  SeoSettingsSection,
  ShippingSettingsSection,
  StoreSettingsSection,
} from "./sections";

export function AdminSettingsForm() {
  const toast = useToast();
  const { data: settings, isLoading: isQueryLoading } = useSystemSettings();
  const updateSettingsMutation = useUpdateSystemSettings();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("store");
  const [form, setForm] = useState<SettingsFormState>(defaultSettingsFormState);

  useEffect(() => {
    if (settings) {
      setForm(toSettingsFormState(settings));
    }
  }, [settings]);

  const activeSectionMeta = useMemo(
    () => settingsSections.find((section) => section.id === activeSection),
    [activeSection]
  );

  const setField = <K extends keyof SettingsFormState>(
    key: K,
    value: SettingsFormState[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    updateSettingsMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Đã lưu cấu hình hệ thống thành công!");
      },
      onError: () => {
        toast.error("Không thể lưu cấu hình hệ thống. Vui lòng thử lại!");
      },
    });
  };

  const isSaving = updateSettingsMutation.isPending;

  if (isQueryLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Spinner size="lg" variant="slate" />
        <p className="animate-pulse text-xs font-medium text-slate-400">
          Đang tải cấu hình hệ thống...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Cấu hình hệ thống
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý các thiết lập vận hành chung của cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="h-10 rounded-xl border-slate-200 px-4 text-sm font-medium text-slate-600"
            disabled={isSaving}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="h-10 gap-2 rounded-xl bg-teal-700 px-5 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
            disabled={isSaving}
          >
            {isSaving ? <Spinner size="sm" variant="white" /> : <Save className="h-4 w-4" />}
            Lưu cấu hình
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="min-w-0">
          {activeSection === "store" && (
            <StoreSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "shipping" && (
            <ShippingSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "maintenance" && (
            <MaintenanceSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "notifications" && (
            <NotificationSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "payments" && (
            <PaymentSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "seo" && (
            <SeoSettingsSection form={form} setField={setField} />
          )}
          {activeSection === "orders" && (
            <OrderSettingsSection form={form} setField={setField} />
          )}

          {activeSectionMeta && (
            <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 px-5 py-4 text-sm text-teal-800">
              Đang chỉnh nhóm{" "}
              <span className="font-medium">{activeSectionMeta.label}</span>. Nhấn
              “Lưu cấu hình” để áp dụng thay đổi.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
