import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { settingsSections } from "@/features/settings/constants";
import type { SettingsSectionId } from "@/features/settings/types";

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSectionChange: (section: SettingsSectionId) => void;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_4px_20px_rgba(15,23,42,0.03)] lg:sticky lg:top-24">
      {settingsSections.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
              isActive
                ? "bg-teal-50 text-teal-800"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                isActive
                  ? "border-teal-100 bg-white text-teal-700"
                  : "border-slate-100 bg-slate-50 text-slate-400 group-hover:text-slate-600"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{section.label}</span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {section.description}
              </span>
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-opacity",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              )}
            />
          </button>
        );
      })}
    </aside>
  );
}
