"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProductFilter } from "@/components/products/ProductFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/common/LoadingState";
import { Sparkles } from "lucide-react";

function ProductCatalogContent() {
  const { products, categories, isLoading } = useStore();
  const searchParams = useSearchParams();

  const initialCat = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync if URL category param changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Exclude inactive products from public catalog
      if (p.status === "inactive") return false;

      // Category filter
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesFeature = p.features.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesFeature) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, search, selectedCategory, statusFilter, sortBy]);

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setStatusFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
          <Sparkles className="h-3 w-3" />
          <span>Katalog Akun Terlengkap</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Semua Akun Digital Pilihan
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Cari akun digital resmi sesuai kebutuhan Anda, cek ketersediaan, lalu pesan langsung dengan mudah via WhatsApp.
        </p>
      </div>

      {/* Filter Toolbar */}
      <ProductFilter
        categories={categories}
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={handleReset}
        totalResults={filteredProducts.length}
      />

      {/* Grid or Skeleton */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <ProductGrid
          products={filteredProducts}
          viewMode={viewMode}
          itemsPerPage={8}
          onResetFilters={handleReset}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-16">
              <ProductGridSkeleton count={8} />
            </div>
          }
        >
          <ProductCatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
