"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Sparkles, MessageCircle, Menu, X, Swords } from "lucide-react";
import { env } from "@/config/env";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const contactWa = getWhatsAppUrl(
    "Halo Admin, saya ingin tanya-tanya seputar stok akun Mobile Legends."
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              ML ACCOUNT STORE
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider -mt-1 uppercase">
              Marketplace Akun Mobile Legends
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/#catalog"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Katalog Akun
          </Link>
          <Link
            href="/#benefits"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Garansi & Keamanan
          </Link>
          <Link href="/#testimonials" className="hover:text-foreground transition-colors">
            Testimoni
          </Link>
          <Link href="/#faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link
            href="/admin"
            className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={contactWa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-primary"
          >
            🎮 Katalog Akun Mobile Legends
          </Link>
          <Link
            href="/#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-primary"
          >
            🛡️ Garansi & Keamanan
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-primary"
          >
            ⭐ Testimoni Pembeli
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium hover:text-primary"
          >
            ❓ FAQ
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-amber-400"
          >
            🔐 Admin Portal
          </Link>
          <a
            href={contactWa}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
