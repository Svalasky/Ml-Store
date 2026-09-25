"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { useStore } from "@/context/StoreContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: (message: string) => void;
}

const ICON_OPTIONS = [
  { value: "Tv", label: "Tv (Streaming)" },
  { value: "Headphones", label: "Headphones (Music)" },
  { value: "Sparkles", label: "Sparkles (AI Tools)" },
  { value: "Palette", label: "Palette (Design)" },
  { value: "ShieldCheck", label: "ShieldCheck (VPN)" },
  { value: "Gamepad2", label: "Gamepad2 (Gaming)" },
  { value: "Laptop", label: "Laptop (Software)" },
];

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryFormModalProps) {
  const { addCategory, updateCategory } = useStore();
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Tv");
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setIcon(category.icon || "Tv");
      setActive(category.active);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setIcon("Tv");
      setActive(true);
    }
    setError("");
  }, [category, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        icon,
        active,
      };

      if (isEditing && category) {
        await updateCategory(category.id, payload);
        onSuccess(`Kategori "${name}" berhasil diperbarui.`);
      } else {
        await addCategory(payload);
        onSuccess(`Kategori "${name}" berhasil ditambahkan.`);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan kategori.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
      description="Kelola kategori produk untuk mempermudah navigasi pembeli."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Kategori *
          </label>
          <Input
            type="text"
            placeholder="Contoh: Streaming & Movies"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Slug URL *
          </label>
          <Input
            type="text"
            placeholder="streaming"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pilihan Ikon
          </label>
          <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi Singkat
          </label>
          <Textarea
            rows={2}
            placeholder="Deskripsi kategori..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-800">
              Kategori Aktif & Ditampilkan ke Pembeli
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Simpan Perubahan" : "Tambah Kategori"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
