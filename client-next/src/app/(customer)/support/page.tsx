"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomerChat from "@/features/chat/components/CustomerChat";
import CustomerSupportSidebar from "@/features/chat/components/CustomerSupport/CustomerSupportSidebar";
import CustomerDeliveryView from "@/features/chat/components/CustomerSupport/CustomerDeliveryView";
import CustomerReturnsView from "@/features/chat/components/CustomerSupport/CustomerReturnsView";
import CustomerWarrantyView from "@/features/chat/components/CustomerSupport/CustomerWarrantyView";
import CustomerContactView from "@/features/chat/components/CustomerSupport/CustomerContactView";
import { useSystemSettings } from "@/features/settings/hooks";

export default function SupportPage() {
  const { data: settingsData } = useSystemSettings();
  const settings = settingsData?.data || settingsData;
  const [activeTab, setActiveTab] = useState<
    "chat" | "delivery" | "returns" | "warranty" | "contact"
  >("chat");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const storePhone = mounted ? settings?.storePhone || "1900 8888" : "1900 8888";
  const storeEmail = mounted
    ? settings?.storeEmail || "support@luxe.vn"
    : "support@luxe.vn";
  const storeAddress = mounted
    ? settings?.storeAddress ||
      "109/47/1A Đường số 8, Phường Linh Xuân, TP Thủ Đức, TP Hồ Chí Minh"
    : "109/47/1A Đường số 8, Phường Linh Xuân, TP Thủ Đức, TP Hồ Chí Minh";
  const freeShippingThreshold =
    mounted && settings?.freeShippingThreshold
      ? Number(settings.freeShippingThreshold).toLocaleString("vi-VN") + "đ"
      : "500.000đ";
  const defaultShippingFee =
    mounted && settings?.shippingFee
      ? Number(settings.shippingFee).toLocaleString("vi-VN") + "đ"
      : "30.000đ";

  return (
    <div className="bg-[#FAF8F4] lg:min-h-[calc(100vh-146px)] min-h-[calc(100vh-64px)] pt-4 lg:pt-6 pb-6 flex flex-col font-sans">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        {/* Breadcrumb Nav */}
        <div className="flex items-center gap-2 text-[11px] font-normal text-[#8A7966] tracking-wide mb-4 shrink-0">
          <Link href="/" className="hover:text-[#3D2B1A] transition-colors">
            Trang chủ
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-[#3D2B1A] font-medium">Trung tâm hỗ trợ</span>
        </div>

        {/* Dynamic Split Console Layout (Customer Brand Palette) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#DDD6C8]/50 shadow-[0_20px_50px_rgba(61,43,26,0.015)] overflow-hidden h-[560px]">
          {/* ──── LEFT PANEL: Channels & Nav ──── */}
          <CustomerSupportSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            storePhone={storePhone}
          />

          {/* ──── RIGHT PANEL: Dynamic Viewport ──── */}
          <div className="lg:col-span-8 flex flex-col bg-white overflow-hidden h-full min-h-0">
            {activeTab === "chat" && <CustomerChat />}

            {activeTab === "delivery" && (
              <CustomerDeliveryView
                freeShippingThreshold={freeShippingThreshold}
                defaultShippingFee={defaultShippingFee}
              />
            )}

            {activeTab === "returns" && <CustomerReturnsView />}

            {activeTab === "warranty" && <CustomerWarrantyView />}

            {activeTab === "contact" && (
              <CustomerContactView
                storePhone={storePhone}
                storeEmail={storeEmail}
                storeAddress={storeAddress}
              />
            )}
          </div>
        </div>

        {/* Global Support Info Footer */}
        <div className="mt-8 mb-4 text-center opacity-40">
          <p className="text-[9px] text-[#8A7966] lowercase tracking-widest font-normal">
            LUXE care experience ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
