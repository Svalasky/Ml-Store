"use client";

import React, { useState } from "react";
import { Category } from "@/types/category";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import {
  Plus,
  Edit2,
  Trash2,
  Tv,
  Headphones,
  Sparkles,
  Palette,
  ShieldCheck,
  Gamepad2,
  Laptop,
  FolderKanban,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv className="h-4 w-4 text-rose-500" />,
  Headphones: <Headphones className="h-4 w-4 text-green-500" />,
  Sparkles: <Sparkles className="h-4 w-4 text-purple-500" />,
  Palette: <Palette className="h-4 w-4 text-amber-500" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4 text-blue-500" />,
  Gamepad2: <Gamepad2 className="h-4 w-4 text-indigo-500" />,
  Laptop: <Laptop className="h-4 w-4 text-cyan-500" />,
};

export default function AdminCategoriesPage() {
  const { categories, products, deleteCategory, updateCategory } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setModalOpen(true);
  };

  const handleToggleActive = async (c: Category) => {
    try {
      await updateCategory(c.id, { active: !c.active });
      toast.success(
        `Kategori "${c.name}" ${!c.active ? "diaktifkan" : "dinonaktifkan"}.`
      );
    } catch {
      toast.error("Gagal memperbarui status kategori.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      toast.success(`Kategori "${deletingCategory.name}" berhasil dihapus.`);
      setDeletingCategory(null);
    } catch {
      toast.error("Gagal menghapus kategori.");
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
            Kategori Akun Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Atur pengelompokan akun untuk memudahkan pencarian oleh customer
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 h-10 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori Baru</span>
        </Button>
      </div>

      {/* Categories Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Ikon & Nama</th>
                <th className="py-3.5 px-4">Slug URL</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4">Jumlah Produk</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                const icon = (c.icon && ICON_MAP[c.icon]) || (
                  <FolderKanban className="h-4 w-4 text-slate-500" />
                );

                return (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                          {icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {c.slug}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {c.description || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                      {count} Produk
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          c.active
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Klik untuk toggle status aktif"
                      >
                        {c.active ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        onSuccess={(msg) => toast.success(msg)}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}"?`}
        confirmText="Hapus Kategori"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
