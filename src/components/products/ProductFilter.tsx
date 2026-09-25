"use client";

import React, { useState } from "react";
import { Category } from "@/types/category";
import { SearchBar } from "@/components/common/SearchBar";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal, RotateCcw } from "lucide-react";

interface ProductFilterProps {
  categories: Category[];
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onReset: () => void;
  totalResults: number;
}

export function ProductFilter({
  categories,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onReset,
  totalResults,
}: ProductFilterProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="space-y-4 mb-8">
      {/* Top search & responsive toggle bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="w-full flex-1">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2 flex-1 sm:flex-none justify-center"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-600" />
            <span>Filter & Urutkan</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </Button>

          {/* Grid / List Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Semua Kategori
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter Selects Bar (Desktop) */}
      <div className="hidden md:flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia Saja</option>
              <option value="out_of_stock">Stok Habis</option>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="name_asc">Nama (A - Z)</option>
            </Select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-red-600 gap-1.5 h-9 px-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        <span className="text-xs text-slate-500">
          Ditemukan <strong className="text-slate-900">{totalResults}</strong> produk
        </span>
      </div>

      {/* Mobile Collapsible Filter Drawer */}
      {mobileFilterOpen && (
        <div className="md:hidden rounded-2xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Kategori
            </label>
            <Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-xs"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ketersediaan
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="text-xs"
              >
                <option value="all">Semua</option>
                <option value="available">Tersedia</option>
                <option value="out_of_stock">Stok Habis</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Urutkan
              </label>
              <Select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-xs"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="name_asc">Nama (A-Z)</option>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Total <strong>{totalResults}</strong> produk
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs text-red-600 gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Filter
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
