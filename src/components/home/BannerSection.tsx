"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";

export function BannerSection() {
  const { banners } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <section className="py-6 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl min-h-[220px] sm:min-h-[260px] flex items-center">
          {/* Background image if available */}
          {current.imageUrl && (
            <div className="absolute inset-0 opacity-40">
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              Promo Spesial
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              {current.title}
            </h3>
            {current.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {current.description}
              </p>
            )}

            {current.buttonText && current.buttonUrl && (
              <div className="pt-2">
                <Link href={current.buttonUrl}>
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl gap-1.5"
                  >
                    <span>{current.buttonText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Slider controls */}
          {banners.length > 1 && (
            <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
                }
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-xs transition"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-xs transition"
                aria-label="Next banner"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
