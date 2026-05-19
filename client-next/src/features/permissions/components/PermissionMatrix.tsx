"use client";

import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { Permission } from "../api";
import { PERMISSION_GROUPS, ACTION_LABELS } from "../constants";

interface PermissionMatrixProps {
  groupedPermissions: Record<string, Permission[]>;
  activePerms: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function PermissionMatrix({
  groupedPermissions,
  activePerms,
  onToggle,
  onSelectAll,
  onClearAll,
}: PermissionMatrixProps) {
  return (
    <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden font-sans">
      <CardHeader className="border-b border-slate-50 bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900">
            Danh sách quyền hạn
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[10px] font-bold uppercase text-slate-400 hover:text-primary"
              onClick={onSelectAll}
            >
              Chọn hết
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[10px] font-bold uppercase text-slate-400 hover:text-destructive"
              onClick={onClearAll}
            >
              Hủy hết
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {Object.entries(groupedPermissions).map(([group, perms]) => (
            <div key={group} className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {PERMISSION_GROUPS[group]?.label || group}
                </span>
                <div className="h-px flex-1 bg-slate-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {perms.map((perm) => {
                  const isOn = activePerms.has(Number(perm.id));
                  const action = perm.name.split(".")[1];

                  return (
                    <div
                      key={perm.id}
                      onClick={() => onToggle(perm.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                        isOn
                          ? "bg-primary/5 border-primary/20"
                          : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div
                        className={cn(
                          "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all",
                          isOn
                            ? "bg-primary border-primary"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        {isOn && (
                          <Check className="h-3 w-3 text-white" strokeWidth={4} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs font-bold truncate",
                            isOn ? "text-slate-900" : "text-slate-500"
                          )}
                        >
                          {ACTION_LABELS[action] || action}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {perm.description || perm.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
