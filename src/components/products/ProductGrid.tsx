"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductFilterOptions } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductFilter } from "./ProductFilter";
import { getProducts } from "@/services/productService";
import { Swords, Loader2 } from "lucide-react";

interface ProductGridProps {
  initialProducts?: Product[];
}

export function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilterOptions>({
    status: "available",
    sortBy: "newest",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        if (isMounted) setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <section id="catalog" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Swords className="w-4 h-4" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Katalog Akun Mobile Legends
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Pilih akun impian Anda dari koleksi akun verified dengan jaminan transaksi aman dan bergaransi.
        </p>
      </div>

      {/* Filter Component */}
      <ProductFilter
        filters={filters}
        onFilterChange={setFilters}
        totalResults={products.length}
      />

      {/* Product List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Memuat katalog akun...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-card border border-border p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Akun yang Sesuai</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Coba sesuaikan filter atau kata kunci pencarian Anda untuk menemukan akun Mobile Legends lainnya.
          </p>
          <button
            onClick={() => setFilters({ status: "all", sortBy: "newest" })}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Lihat Semua Akun
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
}
