"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { settings } = useStore();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Produk", href: "/admin/products", icon: Package },
    { label: "Kategori", href: "/admin/categories", icon: Layers },
    { label: "Pengaturan Toko", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">
                {settings.storeName || "Mole Store"}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-emerald-400" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Akses Cepat
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="h-4 w-4" />
              <span>Lihat Toko Publik</span>
            </span>
          </Link>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "admin@molestore.com"}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
