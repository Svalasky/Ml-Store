"use client";

import React, { useState, useEffect } from "react";
import { Product, AccountStatus } from "@/types/product";
import { getProducts, updateProductStatus, deleteProduct } from "@/services/productService";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { formatIDR } from "@/lib/whatsapp";
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Crown,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    const data = await getProducts({ status: "all" });
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStatusChange = async (id: string, status: AccountStatus) => {
    await updateProductStatus(id, status);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini dari katalog?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.rank?.toLowerCase().includes(search.toLowerCase()) ||
      p.battle_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Kelola Akun Mobile Legends
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Tambah, perbarui spesifikasi skin & hero, atau ubah status penjualan akun.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama akun, rank, battle ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "available", "reserved", "sold"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {st === "all" ? "Semua" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-mono uppercase">
              <tr>
                <th className="p-4">Akun & Rank</th>
                <th className="p-4">Spesifikasi Skin</th>
                <th className="p-4">Harga Jual</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Tidak ada data akun yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Account Name & Rank */}
                    <td className="p-4 space-y-1 max-w-xs">
                      <div className="font-bold text-foreground line-clamp-1">
                        {prod.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-amber-300 font-semibold">
                          {prod.rank}
                        </span>
                        <span>Lv. {prod.level}</span>
                        <span>WR {prod.win_rate}%</span>
                      </div>
                    </td>

                    {/* Skin & Content Breakdown */}
                    <td className="p-4 space-y-1">
                      <div className="font-semibold text-foreground">
                        {prod.skin_count} Skins • {prod.hero_count} Heroes
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        {prod.collector_count > 0 && (
                          <span className="text-amber-400 font-medium">
                            {prod.collector_count} Collector
                          </span>
                        )}
                        {prod.legend_count > 0 && (
                          <span className="text-purple-400 font-medium">
                            {prod.legend_count} Legend
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono">
                      <span className="font-bold text-emerald-400 text-sm block">
                        {formatIDR(prod.price)}
                      </span>
                      {prod.original_price && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {formatIDR(prod.original_price)}
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={prod.status}
                        onChange={(e) =>
                          handleStatusChange(prod.id, e.target.value as AccountStatus)
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer border ${
                          prod.status === "available"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                            : prod.status === "sold"
                            ? "bg-red-950/60 text-red-300 border-red-700/60"
                            : "bg-amber-950/60 text-amber-300 border-amber-700/60"
                        }`}
                      >
                        <option value="available">Tersedia</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          title="Lihat Detail Produk"
                          className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Akun"
                          className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          title="Hapus Akun"
                          className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Editor Modal */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadProducts()}
      />
    </div>
  );
}
