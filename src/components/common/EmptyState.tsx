import React from "react";
import { PackageOpen, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Tidak ada produk ditemukan",
  description = "Coba ubah kata kunci pencarian atau bersihkan filter kategori Anda.",
  icon: Icon = PackageOpen,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 text-slate-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-5">
          {actionText}
        </Button>
      )}
    </div>
  );
}
