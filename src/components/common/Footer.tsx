"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, Mail, MapPin, Send, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cleanWhatsAppNumber } from "@/lib/whatsapp";

export function Footer() {
  const { settings, categories } = useStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {settings.storeName || "Mole Store"}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.description ||
                "Penyedia akun digital streaming, game, AI tools, dan software resmi terlengkap di Indonesia dengan jaminan legal & bergaransi penuh."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={`https://tiktok.com/@${settings.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-bold">TT</span>
                </a>
              )}
              {settings.telegram && (
                <a
                  href={`https://t.me/${settings.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-emerald-400 transition-colors">
                  Kategori Akun
                </Link>
              </li>
              <li>
                <Link href="/#how-to-order" className="hover:text-emerald-400 transition-colors">
                  Panduan Pemesanan
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-emerald-400 transition-colors">
                  Pertanyaan Populer
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kategori Populer
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Bantuan & CS
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber(settings.whatsappNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors group"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-slate-200 font-medium group-hover:text-emerald-400">
                    +{settings.whatsappNumber}
                  </span>
                  <span className="text-xs text-slate-500">Fast Response 08:00 - 23:00</span>
                </div>
              </a>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}

              {settings.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-xs">{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {settings.storeName}. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Official Digital Reseller Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
