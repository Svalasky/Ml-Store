import React from "react";
import Link from "next/link";
import { Swords, ShieldCheck, Heart, MessageCircle } from "lucide-react";
import { env } from "@/config/env";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const contactWa = getWhatsAppUrl(
    "Halo Admin, saya butuh bantuan terkait pembelian akun Mobile Legends."
  );

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold">
                <Swords className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-purple-300 bg-clip-text text-transparent">
                ML ACCOUNT STORE
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Marketplace dan Toko Akun Mobile Legends Terpercaya No. 1 di Indonesia. Menjual
              berbagai pilihan akun MLBB dari Akun Sultan, Koleksi Collector & Legend, hingga Akun
              Pelajar dengan jaminan 100% Anti Hack-Back Seumur Hidup.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>TRANSAKSI CEPAT & AMAN VIA WHATSAPP RESMI</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Kategori Akun
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#catalog" className="hover:text-foreground transition-colors">
                  Akun Sultan & Kolektor
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-foreground transition-colors">
                  Akun Mythical Immortal
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-foreground transition-colors">
                  Akun Mythic Glory
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-foreground transition-colors">
                  Akun Pelajar Murah
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Bantuan & Kontak
            </h4>
            <p className="text-xs text-muted-foreground">
              Admin siap melayani transaksi dan konsultasi akun setiap hari (08:00 - 24:00 WIB).
            </p>
            <a
              href={contactWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: +{env.whatsappNumber}
            </a>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Admin Area →
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-border/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} ML Account Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat khusus untuk komunitas Mobile Legends Indonesia <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
