"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StockBadge } from "@/components/common/StockBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { products, categories, deleteProduct, getCategoryById } = useStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, statusFilter, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      toast.success(`Produk "${deletingProduct.name}" berhasil dihapus.`);
      setDeletingProduct(null);
    } catch {
      toast.error("Gagal menghapus produk.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Katalog Produk Akun
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh akun digital yang tersedia di sistem Mole Store
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 h-10 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama akun atau slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-xs h-10"
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs h-10"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs h-10"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia Saja</option>
              <option value="out_of_stock">Stok Habis</option>
              <option value="inactive">Nonaktif</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Jual</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Unggulan</th>
                <th className="py-3.5 px-4">Dibuat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <PackageOpen className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      Tidak ada produk ditemukan
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau filter kategori Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const category = getCategoryById(p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-slate-400 font-mono">/products/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {category?.name || "Uncategorized"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-900">
                          {formatRupiah(p.price)}
                        </div>
                        {p.originalPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {formatRupiah(p.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StockBadge status={p.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <Sparkles className="h-3 w-3" />
                            <span>Ya</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/products/${p.slug}`} target="_blank">
                            <button
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Lihat Halaman Publik"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Edit Produk"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> produk
          </span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        product={editingProduct}
        onSuccess={(msg) => toast.success(msg)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${deletingProduct?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Produk"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
