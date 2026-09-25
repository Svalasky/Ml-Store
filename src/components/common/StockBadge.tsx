import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProductStatus } from "@/types/product";
import { CheckCircle2, AlertCircle, Ban } from "lucide-react";

interface StockBadgeProps {
  status: ProductStatus;
  showIcon?: boolean;
}

export function StockBadge({ status, showIcon = true }: StockBadgeProps) {
  if (status === "available") {
    return (
      <Badge variant="success" className="gap-1 font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
        {showIcon && <CheckCircle2 className="h-3 w-3" />}
        <span>Tersedia</span>
      </Badge>
    );
  }

  if (status === "out_of_stock") {
    return (
      <Badge variant="warning" className="gap-1 font-medium bg-amber-50 text-amber-800 border-amber-300">
        {showIcon && <AlertCircle className="h-3 w-3" />}
        <span>Stok Habis</span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1 font-medium text-slate-500">
      {showIcon && <Ban className="h-3 w-3" />}
      <span>Tidak Aktif</span>
    </Badge>
  );
}
