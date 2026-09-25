"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { useStore } from "@/context/StoreContext";

export function Hero() {
  const { settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 md:py-24 border-b border-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[250px] bg-teal-400/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Trust Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs mb-6 animate-in fade-in-0 duration-500">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Solusi Akun Digital Legal & Bergaransi #1</span>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
          Akses Akun Digital Premium{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            Lebih Murah, Legal, & Instan
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
          {settings.tagline || "Pusat Akun Digital Legal, Murah & Bergaransi"}. Nikmati streaming film, musik tanpa iklan, AI tools generasi terbaru, hingga software kantor dengan proses pembelian langsung via WhatsApp.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link href="/products" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-xl px-7 font-bold shadow-md hover:shadow-lg">
              <span>Lihat Katalog Produk</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <div className="w-full sm:w-auto">
            <WhatsAppButton
              size="lg"
              label="Chat WhatsApp Admin"
              fullWidth
              className="rounded-xl px-7"
            />
          </div>
        </div>

        {/* Micro reassurance checklist */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Tanpa Perlu Buat Akun</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Garansi Full Penggantian</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Pembayaran QRIS & Transfer Bank</span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">10.000+</div>
            <div className="text-xs text-slate-500 mt-0.5">Transaksi Sukses</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">1-5 Mnt</div>
            <div className="text-xs text-slate-500 mt-0.5">Rata-rata Kirim Akun</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Garansi Replace</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-500">4.9 / 5.0</div>
            <div className="text-xs text-slate-500 mt-0.5">Kepuasan Pelanggan</div>
          </div>
        </div>
      </div>
    </section>
  );
}
