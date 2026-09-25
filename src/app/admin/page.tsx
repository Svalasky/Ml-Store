"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StockBadge } from "@/components/common/StockBadge";
import { Button } from "@/components/ui/button";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Layers,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Settings,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { products, categories, getCategoryById } = useStore();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Statistics calculation
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.status === "available").length;
  const outOfStockProducts = products.filter((p) => p.status === "out_of_stock").length;
  const totalCategories = categories.length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mole Store Admin Panel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Selamat Datang di Dashboard Toko
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
            Kelola katalog akun digital, pantau status stok, dan perbarui nomor WhatsApp tujuan transaksi customer Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setProductModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs gap-1.5 h-10 shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </Button>

          <Button
            onClick={() => setCategoryModalOpen(true)}
            variant="outline"
            className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-800 rounded-xl text-xs gap-1.5 h-10"
          >
            <Plus className="h-4 w-4" />
            <span>Kategori Baru</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Produk
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{totalProducts}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Katalog akun aktif & draft</span>
          </div>
        </div>

        {/* Ready Stock */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Produk Tersedia
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-700">{availableProducts}</div>
          <div className="mt-1 text-[11px] text-emerald-600">Siap dipesan customer</div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Stok Habis
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-700">{outOfStockProducts}</div>
          <div className="mt-1 text-[11px] text-amber-600">Perlu restock segera</div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Kategori
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{totalCategories}</div>
          <div className="mt-1 text-[11px] text-slate-500">Kategori produk aktif</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Aksi Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
          >
            <Package className="h-4 w-4 text-emerald-600" />
            <span>Kelola Produk</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
          >
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Kelola Kategori</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
          >
            <Settings className="h-4 w-4 text-slate-700" />
            <span>Nomor WhatsApp Toko</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
          >
            <ExternalLink className="h-4 w-4 text-purple-600" />
            <span>Buka Katalog Web</span>
          </Link>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Produk Terbaru Ditambahkan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 produk terbaru yang tercatat di katalog toko
            </p>
          </div>
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
              <span>Semua Produk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Buat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProducts.map((p) => {
                const cat = getCategoryById(p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.duration || "Standar"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {cat?.name || "-"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                      {formatRupiah(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <StockBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {formatDate(p.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product & Category Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSuccess={(msg) => toast.success(msg)}
      />
      <CategoryFormModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={(msg) => toast.success(msg)}
      />
    </div>
  );
}
