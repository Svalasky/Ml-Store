"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  ShoppingBag,
  Users,
  Sparkles,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  Swords,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Akun MLBB", icon: Gamepad2 },
    { href: "/admin/orders", label: "Pesanan (Order)", icon: ShoppingBag },
    { href: "/admin/customers", label: "Pelanggan", icon: Users },
    { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquareQuote },
    { href: "/admin/banners", label: "Banner Promo", icon: ImageIcon },
    { href: "/admin/settings", label: "Pengaturan Toko", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-foreground">
              ADMIN STORE
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">
              Mobile Legends Catalog
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to store */}
      <div className="pt-4 border-t border-border/60">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Toko</span>
        </Link>
      </div>
    </aside>
  );
}
