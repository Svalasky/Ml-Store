"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedProducts() {
  const { products, isLoading } = useStore();

  const featured = products
    .filter((p) => p.featured && p.status !== "inactive")
    .slice(0, 8);

  return (
    <section className="py-16 md:py-20 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Paling Banyak Dicari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Produk Unggulan Pilihan
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Daftar akun digital terpopuler dengan harga termurah dan jaminan garansi langsung dari admin.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" className="hidden sm:inline-flex items-center gap-2 rounded-xl">
              <span>Lihat Semua Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full rounded-xl">
              Lihat Semua Produk &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
