"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = 14,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              isFilled ? "text-amber-500 fill-amber-500" : "text-slate-250"
            )}
          />
        );
      })}
    </div>
  );
}
