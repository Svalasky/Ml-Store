"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatIDR } from "@/lib/whatsapp";
import { Sparkles, Trophy, Crown, ArrowRight, Flame } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isAvailable = product.status === "available";

  const getRankBadgeClass = (rank?: string) => {
    if (!rank) return "bg-zinc-800 text-zinc-300 border-zinc-700";
    const r = rank.toLowerCase();
    if (r.includes("immortal")) return "bg-red-950/80 text-red-300 border-red-700/60 shadow-sm shadow-red-900/50";
    if (r.includes("glory")) return "bg-amber-950/80 text-amber-300 border-amber-600/60 shadow-sm shadow-amber-900/50";
    if (r.includes("honor")) return "bg-yellow-950/80 text-yellow-300 border-yellow-600/60";
    if (r.includes("mythic")) return "bg-purple-950/80 text-purple-300 border-purple-600/60";
    if (r.includes("legend")) return "bg-orange-950/80 text-orange-300 border-orange-600/60";
    if (r.includes("epic")) return "bg-blue-950/80 text-blue-300 border-blue-600/60";
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  const imageSrc =
    product.primary_image ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="group relative rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1">
      {/* Image Thumbnail & Overlays */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        <img
          src={imageSrc}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? "grayscale opacity-60" : ""
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1 ${getRankBadgeClass(
              product.rank
            )}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {product.rank || "Mythic"}
          </span>

          {product.featured && !isSold && (
            <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-zinc-950 flex items-center gap-1 shadow-md shadow-amber-500/30">
              <Flame className="w-3 h-3 fill-zinc-950" />
              HOT
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isSold ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-md">
              SOLD OUT
            </span>
          ) : isReserved ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-600 text-white shadow-md">
              RESERVED
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 backdrop-blur-md">
              Tersedia
            </span>
          )}
        </div>

        {/* Level and Win Rate pill at bottom of image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-zinc-300 font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm border border-zinc-800">
            Lv. {product.level || 30}
          </span>
          {product.win_rate && (
            <span className="px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-emerald-400 font-semibold">
              WR {product.win_rate}%
            </span>
          )}
        </div>
      </div>

      {/* Account Info Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Key Stats Pill Row: Skins • Collector • Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {product.skin_count} Skins
            </span>

            {product.collector_count > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/50 text-amber-300 border border-amber-800/40 font-semibold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {product.collector_count} Collector
              </span>
            )}

            {product.legend_count > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/50 text-purple-300 border border-purple-800/40 font-semibold">
                {product.legend_count} Legend
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatIDR(product.original_price)}
              </span>
            )}
            <span className="text-lg font-black tracking-tight text-emerald-400">
              {formatIDR(product.price)}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isSold
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:gap-2"
            }`}
          >
            <span>Detail Akun</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
