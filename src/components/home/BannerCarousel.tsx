"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Banner } from "@/types/database";
import { getBanners } from "@/services/settingService";
import { ChevronLeft, ChevronRight, Flame, Sparkles } from "lucide-react";

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getBanners().then((data) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-900 border border-border shadow-2xl aspect-[21/9] sm:aspect-[24/8]">
      {/* Background Banner Image */}
      <img
        src={current.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"}
        alt={current.title}
        className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold w-fit">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>PROMO & REKOMENDASI SPESIAL</span>
        </div>

        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
          {current.title}
        </h3>

        {current.subtitle && (
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {current.subtitle}
          </p>
        )}

        <div className="pt-1">
          <Link
            href={current.link_url || "/#catalog"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lihat Koleksi Akun</span>
          </Link>
        </div>
      </div>

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? "w-6 bg-amber-400" : "w-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
