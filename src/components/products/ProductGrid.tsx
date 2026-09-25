"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  viewMode?: "grid" | "list";
  itemsPerPage?: number;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  viewMode = "grid",
  itemsPerPage = 8,
  onResetFilters,
}: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  if (products.length === 0) {
    return (
      <EmptyState
        title="Tidak ada produk ditemukan"
        description="Maaf, tidak ada produk yang cocok dengan pencarian atau filter yang Anda pilih saat ini."
        actionText={onResetFilters ? "Reset Semua Filter" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center justify-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="rounded-xl px-8 font-semibold hover:bg-slate-50"
          >
            Tampilkan Lebih Banyak ({products.length - visibleCount} tersisa)
          </Button>
          <span className="text-xs text-slate-400">
            Menampilkan {displayedProducts.length} dari {products.length} produk
          </span>
        </div>
      )}
    </div>
  );
}
