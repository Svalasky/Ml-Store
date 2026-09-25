"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Tv,
  Headphones,
  Sparkles,
  Palette,
  ShieldCheck,
  Gamepad2,
  Laptop,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv className="h-6 w-6 text-rose-500" />,
  Headphones: <Headphones className="h-6 w-6 text-green-500" />,
  Sparkles: <Sparkles className="h-6 w-6 text-purple-500" />,
  Palette: <Palette className="h-6 w-6 text-amber-500" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-blue-500" />,
  Gamepad2: <Gamepad2 className="h-6 w-6 text-indigo-500" />,
  Laptop: <Laptop className="h-6 w-6 text-cyan-500" />,
};

export function CategorySection() {
  const { categories, products } = useStore();

  const activeCategories = categories.filter((c) => c.active);

  return (
    <section id="categories" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Kategori Lengkap
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pilih Sesuai Kebutuhan Digital Anda
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Eksplorasi berbagai kategori akun digital premium mulai dari hiburan, hiburan musik, hingga penunjang produktivitas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeCategories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryId === cat.id && p.status !== "inactive"
            ).length;
            const icon = (cat.icon && ICON_MAP[cat.icon]) || (
              <FolderKanban className="h-6 w-6 text-slate-600" />
            );

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400 group-hover:text-slate-900 font-medium">
                  <span>{count} Produk</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
