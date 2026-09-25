"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "@/types/database";
import { getBanners } from "@/services/settingService";
import { Image as ImageIcon, Plus, Sparkles } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    getBanners().then(setBanners);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Banner Promo Homepage
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Kelola slider banner promo akun Mobile Legends di halaman utama.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm space-y-3 p-4"
          >
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-zinc-900 border border-border">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  Urutan: {b.sort_order}
                </span>
                <h3 className="text-base font-extrabold text-white">{b.title}</h3>
                {b.subtitle && (
                  <p className="text-xs text-zinc-300 line-clamp-1">{b.subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                Aktif
              </span>
              <span className="text-muted-foreground font-mono">Link: {b.link_url || "/#catalog"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
