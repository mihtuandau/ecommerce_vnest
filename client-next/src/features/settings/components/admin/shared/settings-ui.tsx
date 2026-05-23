import type { ReactNode } from "react";
import { Switch } from "@/components/ui/Switch";
import { Store } from "lucide-react";

export const settingsInputClass =
  "h-11 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-800 transition-all focus:border-teal-500 focus:ring-teal-100";

export const settingsTextareaClass =
  "min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100";

export function SettingsSectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Store;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

export function SettingsField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: typeof Store;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export function SettingsToggleRow({
  title,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  icon: typeof Store;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-900">{title}</label>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:!bg-teal-700"
      />
    </div>
  );
}

