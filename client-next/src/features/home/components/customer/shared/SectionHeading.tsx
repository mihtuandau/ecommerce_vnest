"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  index?: number;
  eyebrow: string;
  title: string;
  accent?: string;
  viewAllLink?: string;
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  viewAllLink,
  dark = false,
  className,
}: SectionHeadingProps) {
  const accentIndex = accent ? title.indexOf(accent) : -1;
  const before = accentIndex >= 0 ? title.slice(0, accentIndex) : title;
  const after =
    accentIndex >= 0 ? title.slice(accentIndex + accent!.length) : "";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-6",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {typeof index === "number" && (
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-brand-accent">
              0{index}
            </span>
          )}
          <span
            className={cn("h-px w-8", dark ? "bg-white/20" : "bg-brand-sand")}
          />
          <span
            className={cn(
              "font-sans text-[11px] font-bold uppercase tracking-[0.2em]",
              dark ? "text-white/60" : "text-brand-taupe"
            )}
          >
            {eyebrow}
          </span>
        </div>

        <h2
          className={cn(
            "font-serif text-[28px] md:text-[34px] font-semibold leading-tight tracking-tight",
            dark ? "text-brand-linen" : "text-brand-espresso"
          )}
        >
          {before}
          {accent && (
            <em className="text-brand-accent not-italic">{accent}</em>
          )}
          {after}
        </h2>
      </div>

      {viewAllLink && (
        <Link
          href={viewAllLink}
          className={cn(
            "hidden md:flex items-center gap-1 text-[13px] font-medium border-b pb-0.5 transition-colors shrink-0",
            dark
              ? "text-white/70 border-white/30 hover:text-brand-accent hover:border-brand-accent"
              : "text-brand-taupe border-brand-sand hover:text-brand-accent hover:border-brand-accent"
          )}
        >
          Xem tất cả <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
