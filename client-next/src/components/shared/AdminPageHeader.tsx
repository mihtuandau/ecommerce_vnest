"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  onBack,
  backLabel = "Quay lại",
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0.5 h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-teal-50 hover:text-teal-700"
            onClick={onBack}
            aria-label={backLabel}
            title={backLabel}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          {eyebrow && (
            <p className={cn(adminUI.typography.eyebrow, "mb-1")}>{eyebrow}</p>
          )}
          <h1 className={adminUI.typography.heading}>{title}</h1>
          {description && (
            <p className={cn(adminUI.typography.description, "mt-1 max-w-3xl")}>
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
