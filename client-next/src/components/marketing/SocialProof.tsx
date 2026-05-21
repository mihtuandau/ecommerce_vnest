"use client";
import Image from "next/image";

import React, { useState, useEffect } from "react";
import { ShoppingBag, X, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

import { useProducts } from "@/features/products/hooks";

// Dữ liệu mô phỏng tên khách và địa phương
const CUSTOMERS = [
  { name: "Huy", location: "Hà Nội" },
  { name: "Lan", location: "TP. Hồ Chí Minh" },
  { name: "Hùng", location: "Đà Nẵng" },
  { name: "Mai", location: "Bắc Ninh" },
  { name: "Minh", location: "Hải Phòng" },
  { name: "Ngọc", location: "Bình Dương" },
  { name: "Hoàng", location: "Thanh Hóa" },
  { name: "Thảo", location: "Huế" },
];

const generateRandomTime = () => {
  const rand = Math.random();
  if (rand < 0.15) return "vừa xong";
  if (rand < 0.75) {
    const mins = Math.floor(Math.random() * 59) + 1;
    return `${mins} phút trước`;
  }
  const hours = Math.floor(Math.random() * 23) + 1;
  return `${hours} giờ trước`;
};

import { getImageUrl } from "@/utils/image";

export function SocialProof() {
  const { data: productsData } = useProducts({ limit: 20 });
  const products = productsData?.data || [];

  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (products.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const showRandomOrder = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomCustomer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
      const randomTime = generateRandomTime();

      const firstImage = randomProduct.images?.[0] as any;
      const imageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url;

      setCurrentOrder({
        name: randomCustomer.name,
        location: randomCustomer.location,
        productName: randomProduct.name,
        image: getImageUrl(imageUrl || (randomProduct as any).image),
        time: randomTime,
      });

      setIsVisible(true);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    const initialTimer = setTimeout(showRandomOrder, 8000);

    const intervalId = setInterval(
      () => {
        showRandomOrder();
      },
      Math.random() * (45000 - 20000) + 20000
    );

    return () => {
      clearTimeout(initialTimer);
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [products]);

  if (!currentOrder) return null;

  return (
    <div
      className={`fixed bottom-8 left-6 md:left-24 z-[100] hidden md:block transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-3 pr-5 rounded-2xl shadow-sm flex items-center gap-4 max-w-[340px] group relative overflow-hidden">
        
        {isVisible && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-50 overflow-hidden">
            <div
              className="h-full bg-primary/20 animate-progress"
              style={{ animationDuration: "6s" }}
            />
          </div>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="h-12 w-12 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-50 flex items-center justify-center relative">
          <Image
            src={currentOrder.image}
            alt="product"
            width={48}
            height={48}
            className="h-full w-full object-contain p-1"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white p-0.5 rounded-full border border-white shadow-sm">
            <CheckCircle2 className="h-2 w-2" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[11px] font-medium text-slate-900">
              {currentOrder.name}
            </span>
            <span className="text-[10px] text-slate-400">tại</span>
            <span className="text-[11px] font-medium text-slate-900">
              {currentOrder.location}
            </span>
          </div>
          <p className="text-[12px] text-slate-600 leading-tight mb-1">
            vừa mua{" "}
            <span className="text-primary font-medium">{currentOrder.productName}</span>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              <span>{currentOrder.time}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="text-green-500/80">đã xác minh</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
