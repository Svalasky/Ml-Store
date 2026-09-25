"use client";

import React from "react";
import Link from "next/link";
import { Swords, ShieldCheck, Sparkles, Trophy, ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 md:py-16">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-purple-600/20 via-blue-600/20 to-amber-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-semibold text-foreground backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Marketplace Akun Mobile Legends No. 1 Terpercaya</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
          Jual & Beli Akun{" "}
          <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mobile Legends
          </span>{" "}
          Aman Bergaransi
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Temukan akun Sultan, Koleksi Collector, Legend, hingga Akun Pelajar dengan rank Mythic
          Glory & Immortal. Serah terima cepat dipandu admin via WhatsApp resmi.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/#catalog"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-xl shadow-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Swords className="w-4 h-4" />
            <span>Jelajahi Katalog Akun</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/#benefits"
            className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-sm border border-border transition-all"
          >
            🛡️ Garansi Anti Hack-Back
          </Link>
        </div>

        {/* Stats Row */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/60 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-card border border-border/70">
            <span className="text-2xl font-black text-amber-400 font-mono">500+</span>
            <span className="text-xs text-muted-foreground block font-medium">Akun Terjual</span>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/70">
            <span className="text-2xl font-black text-emerald-400 font-mono">100%</span>
            <span className="text-xs text-muted-foreground block font-medium">Anti Hack-Back</span>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/70">
            <span className="text-2xl font-black text-purple-400 font-mono">5 Menit</span>
            <span className="text-xs text-muted-foreground block font-medium">Proses Cepat</span>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/70">
            <span className="text-2xl font-black text-blue-400 font-mono">4.9/5</span>
            <span className="text-xs text-muted-foreground block font-medium">Rating Pembeli</span>
          </div>
        </div>
      </div>
    </div>
  );
}
