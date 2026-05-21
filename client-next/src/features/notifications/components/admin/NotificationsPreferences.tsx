"use client";

import React from "react";
import { Settings, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { NOTIFICATIONS_PREFERENCE_OPTIONS } from "../../constants";

interface NotificationsPreferencesProps {
  settings: {
    orderStatus: boolean;
    security: boolean;
    promotions: boolean;
  };
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  handleToggleSetting: (key: "orderStatus" | "security" | "promotions") => void;
}

export function NotificationsPreferences({
  settings,
  isLoadingSettings,
  isUpdatingSettings,
  handleToggleSetting,
}: NotificationsPreferencesProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <Card className="border border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Settings size={16} className="text-slate-500" />
            Cấu hình thông báo cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Tự động lọc hoặc bật tắt các kênh thông báo tự động được phát bởi hệ thống
            Vnest.
          </p>

          {isLoadingSettings ? (
            <div className="py-10 flex items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              {NOTIFICATIONS_PREFERENCE_OPTIONS.map((option) => (
                <div
                  key={option.key}
                  className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">{option.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {option.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting(option.key)}
                    disabled={isUpdatingSettings}
                    className={cn(
                      "w-11 h-6 rounded-full transition-all duration-200 relative focus:outline-none cursor-pointer border shadow-sm",
                      settings[option.key]
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-slate-200 border-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all shadow-xs",
                        settings[option.key] ? "right-0.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      
      <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex gap-3.5 items-start">
        <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-indigo-900">Thông báo tự động</h5>
          <p className="text-[10px] leading-relaxed text-indigo-850/80 font-medium">
            Vnest tự động gửi thông báo thời gian thực về thiết bị của nhân viên trực
            qua kết nối WebSocket cao cấp khi có biến động vận hành.
          </p>
        </div>
      </div>
    </div>
  );
}
