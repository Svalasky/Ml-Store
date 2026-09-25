"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export function AdminHeader({ onToggleSidebar, title }: AdminHeaderProps) {
  const { resetToDefault } = useStore();

  const handleReset = () => {
    if (confirm("Reset seluruh data produk & kategori ke default demo?")) {
      resetToDefault();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="hidden sm:inline-flex text-xs text-slate-600 gap-1.5 h-8"
          title="Kembalikan data mock ke pengaturan awal"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Demo Data</span>
        </Button>

        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Button>
        </Link>

        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">Sistem Aktif</span>
        </div>
      </div>
    </header>
  );
}
