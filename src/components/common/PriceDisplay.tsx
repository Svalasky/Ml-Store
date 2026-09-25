import React from "react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  size = "default",
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-base font-bold",
    default: "text-lg font-bold",
    lg: "text-2xl font-extrabold",
    xl: "text-3xl font-extrabold",
  };

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("text-emerald-700 font-sans tracking-tight", sizeClasses[size])}>
        {formatRupiah(price)}
      </span>

      {hasDiscount && (
        <>
          <span className="text-xs md:text-sm text-slate-400 line-through font-normal">
            {formatRupiah(originalPrice)}
          </span>
          <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
