"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatIDR } from "@/lib/whatsapp";
import { OrderModal } from "./OrderModal";
import {
  Trophy,
  Sparkles,
  Crown,
  ShieldCheck,
  MessageCircle,
  ChevronLeft,
  Flame,
  Gamepad2,
  Swords,
  Users,
  Percent,
  Hash,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.primary_image ||
      product.images?.[0]?.image_url ||
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
  );
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isAvailable = product.status === "available";

  const allImages = product.images && product.images.length > 0
    ? product.images.map((img) => img.image_url)
    : [selectedImage];

  return (
    <div className="space-y-10 pb-24 md:pb-12">
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Akun</span>
        </Link>
        <span className="text-xs font-mono text-muted-foreground">
          ID: {product.battle_id || product.id.slice(0, 8)}
        </span>
      </div>

      {/* Main Grid: LEFT Gallery, RIGHT Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Gallery Screenshots */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-border/80 shadow-lg">
            <img
              src={selectedImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-all ${
                isSold ? "grayscale opacity-75" : ""
              }`}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/80 text-amber-300 border border-amber-500/50 backdrop-blur-md flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {product.rank || "Mythic"}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              {isSold ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-md">
                  SOLD OUT
                </span>
              ) : isReserved ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-600 text-white shadow-md">
                  RESERVED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 backdrop-blur-md">
                  Tersedia
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/30 scale-95"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Jaminan Keamanan Akun</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Garansi 100% Anti Hack-Back Seumur Hidup</li>
              <li>Akun Moonton Sepaket (All Unbind Ready)</li>
              <li>Dipandu ganti data lengkap oleh admin via WhatsApp</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Account Specs & Information */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Title & Pricing */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {formatIDR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-base text-muted-foreground line-through font-mono">
                  {formatIDR(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden sm:block">
            {isSold ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-secondary text-muted-foreground font-bold text-base cursor-not-allowed text-center"
              >
                Akun Ini Sudah Terjual (Sold Out)
              </button>
            ) : (
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Beli Akun via WhatsApp</span>
              </button>
            )}
          </div>

          {/* SECTION 4: ACCOUNT INFORMATION */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-primary" />
              <span>ACCOUNT INFORMATION</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Level</span>
                <span className="font-extrabold text-foreground text-sm font-mono">
                  {product.level || 30}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Rank</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  {product.rank || "Mythic"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Server</span>
                <span className="font-extrabold text-foreground text-sm font-mono">
                  {product.server || "All"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Battle ID</span>
                <span className="font-extrabold text-foreground text-sm font-mono">
                  {product.battle_id || "-"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Win Rate</span>
                <span className="font-extrabold text-emerald-400 text-sm font-mono">
                  {product.win_rate ? `${product.win_rate}%` : "-"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Total Matches</span>
                <span className="font-extrabold text-foreground text-sm font-mono">
                  {product.total_matches || 0}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4 & 5: ACCOUNT CONTENT */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>ACCOUNT CONTENT</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Heroes</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.hero_count}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Skins</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.skin_count}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/50">
                <span className="text-amber-300 block">Collector</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {product.collector_count || 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/50">
                <span className="text-purple-300 block">Legend</span>
                <span className="font-extrabold text-purple-400 text-sm">
                  {product.legend_count || 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Epic</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.epic_count || 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Special</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.special_count || 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Elite</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.elite_count || 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                <span className="text-muted-foreground block">Season</span>
                <span className="font-extrabold text-foreground text-sm">
                  {product.season_skin_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: SKIN LIST */}
          {product.skins && product.skins.length > 0 && (
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>DAFTAR SKIN PILIHAN</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.skins.map((skin, i) => (
                  <div
                    key={skin.id || i}
                    className="px-3 py-1.5 rounded-xl bg-secondary/60 border border-border text-xs flex items-center gap-1.5"
                  >
                    <span className="font-semibold text-foreground">{skin.hero_name}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-primary font-medium">{skin.skin_name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-background text-muted-foreground">
                      {skin.skin_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: HERO LIST */}
          {product.heroes && product.heroes.length > 0 && (
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>HERO FAVORIT / UTAMA</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.heroes.map((hero, i) => (
                  <span
                    key={hero.id || i}
                    className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
                  >
                    {hero.hero_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: DESCRIPTION */}
          {product.description && (
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                DESKRIPSI AKUN
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* SECTION 8: TERMS */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              KETENTUAN PEMBELIAN & SERAH TERIMA
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.terms ||
                "Setelah order dibuat via WhatsApp, admin akan memverifikasi ketersediaan akun dan mengirimkan nomor rekening resmi. Data akun (Moonton & Email) diserahkan langsung dan dipandu pengamanannya hingga 100% tuntas."}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 29: MOBILE STICKY BOTTOM CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col pl-1">
          <span className="text-[10px] text-muted-foreground uppercase font-mono">Harga Akun</span>
          <span className="text-base font-black text-emerald-400 font-mono">
            {formatIDR(product.price)}
          </span>
        </div>

        {isSold ? (
          <button
            disabled
            className="px-5 py-2.5 rounded-xl bg-secondary text-muted-foreground font-bold text-xs cursor-not-allowed"
          >
            Terjual
          </button>
        ) : (
          <button
            onClick={() => setOrderModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>💬 Beli via WhatsApp</span>
          </button>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        product={product}
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
