"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { WhatsAppButton } from "./WhatsAppButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Katalog Produk", href: "/products" },
    { label: "Kategori", href: "/#categories" },
    { label: "Cara Order", href: "/#how-to-order" },
    { label: "FAQ", href: "/#faq" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/products" && pathname.startsWith("/products")) return true;
    return false;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white border-b border-slate-100"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {settings.storeName || "Mole Store"}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 tracking-wider uppercase">
              Digital Account Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive(link.href)
                  ? "text-slate-900 bg-slate-100/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            title="Masuk ke Admin Dashboard"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>
          <WhatsAppButton size="sm" label="Chat WhatsApp" />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <WhatsAppButton size="sm" showIcon={false} label="WhatsApp" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <WhatsAppButton fullWidth label="Chat Admin via WhatsApp" />
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Login Area Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
