"use client";

import React from "react";
import { ProductFilterOptions } from "@/types/product";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface ProductFilterProps {
  filters: ProductFilterOptions;
  onFilterChange: (newFilters: ProductFilterOptions) => void;
  totalResults: number;
}

const RANKS = [
  "Semua",
  "Mythical Immortal",
  "Mythical Glory",
  "Mythical Honor",
  "Mythic",
  "Legend",
  "Epic",
];

const PRICE_PRESETS = [
  { label: "Semua Harga", min: undefined, max: undefined },
  { label: "< Rp500K", min: undefined, max: 500000 },
  { label: "Rp500K - Rp1JT", min: 500000, max: 1000000 },
  { label: "Rp1JT - Rp2JT", min: 1000000, max: 2000000 },
  { label: "Rp2JT+", min: 2000000, max: undefined },
];

export function ProductFilter({
  filters,
  onFilterChange,
  totalResults,
}: ProductFilterProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleRankSelect = (rank: string) => {
    onFilterChange({ ...filters, rank: rank === "Semua" ? undefined : rank });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  const handleStatusChange = (status: any) => {
    onFilterChange({ ...filters, status });
  };

  const handleReset = () => {
    onFilterChange({
      search: "",
      rank: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minSkins: undefined,
      minCollector: undefined,
      status: "available",
      sortBy: "newest",
    });
  };

  return (
    <div className="space-y-5 rounded-2xl bg-card border border-border p-4 sm:p-6 shadow-sm">
      {/* Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari akun (Nama, Battle ID, Hero, Skin, Rank)..."
            value={filters.search || ""}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <select
            value={filters.sortBy || "newest"}
            onChange={handleSortChange}
            className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="newest">🕒 Terbaru</option>
            <option value="price_asc">💵 Harga Termurah</option>
            <option value="price_desc">💎 Harga Termahal</option>
            <option value="skins_desc">✨ Skin Terbanyak</option>
            <option value="winrate_desc">🏆 Win Rate Tertinggi</option>
          </select>

          <button
            onClick={handleReset}
            title="Reset Filter"
            className="p-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rank Badges Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
          Pilih Rank Akun
        </span>
        <div className="flex flex-wrap gap-1.5">
          {RANKS.map((r) => {
            const isSelected = (!filters.rank && r === "Semua") || filters.rank === r;
            return (
              <button
                key={r}
                onClick={() => handleRankSelect(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Presets & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-border/60">
        {/* Price Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Rentang Harga
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((p, idx) => {
              const active = filters.minPrice === p.min && filters.maxPrice === p.max;
              return (
                <button
                  key={idx}
                  onClick={() => handlePricePreset(p.min, p.max)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                    active
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-600"
                      : "bg-background text-muted-foreground border-border hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Min Skin Count */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Minimal Skin
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 50, 100, 200].map((num) => (
              <button
                key={num}
                onClick={() =>
                  onFilterChange({ ...filters, minSkins: num === 0 ? undefined : num })
                }
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  (filters.minSkins === num) || (!filters.minSkins && num === 0)
                    ? "bg-amber-950/60 text-amber-300 border-amber-600"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {num === 0 ? "Bebas" : `${num}+ Skin`}
              </button>
            ))}
          </div>
        </div>

        {/* Collector Filter */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Collector Skin
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() =>
                  onFilterChange({ ...filters, minCollector: num === 0 ? undefined : num })
                }
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  (filters.minCollector === num) || (!filters.minCollector && num === 0)
                    ? "bg-purple-950/60 text-purple-300 border-purple-600"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {num === 0 ? "Bebas" : `${num}+ Collector`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Status Akun
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "Semua" },
              { id: "available", label: "Tersedia" },
              { id: "sold", label: "Terjual" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => handleStatusChange(st.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  (filters.status === st.id) || (!filters.status && st.id === "available")
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40 font-mono">
        <span>Menampilkan {totalResults} akun Mobile Legends</span>
        {filters.search && <span>Pencarian: &quot;{filters.search}&quot;</span>}
      </div>
    </div>
  );
}
