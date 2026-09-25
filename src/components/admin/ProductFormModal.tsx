"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductStatus } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { slugify } from "@/lib/utils";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: (message: string) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const { categories, addProduct, updateProduct } = useStore();
  const isEditing = Boolean(product);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [duration, setDuration] = useState("1 Bulan");
  const [image, setImage] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [status, setStatus] = useState<ProductStatus>("available");
  const [featured, setFeatured] = useState(false);
  const [termsText, setTermsText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setPrice(product.price.toString());
      setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
      setDuration(product.duration || "1 Bulan");
      setImage(product.image);
      setFeaturesText(product.features.join("\n"));
      setStatus(product.status);
      setFeatured(product.featured);
      setTermsText(product.terms ? product.terms.join("\n") : "");
    } else {
      setName("");
      setSlug("");
      setCategoryId(categories[0]?.id || "");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setDuration("1 Bulan");
      setImage("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80");
      setFeaturesText("Garansi Full Penggantian\nLegal & Bergaransi\nProses Instan");
      setStatus("available");
      setFeatured(false);
      setTermsText("Dilarang mengubah email/password\nGaransi hangus jika melanggar ToS");
    }
    setError("");
  }, [product, categories, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError("Harga produk harus berupa angka valid.");
      return;
    }
    if (!categoryId) {
      setError("Pilih salah satu kategori.");
      return;
    }
    if (!image.trim()) {
      setError("Foto produk wajib disediakan.");
      return;
    }

    setIsLoading(true);

    try {
      const features = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const terms = termsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      const productPayload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        categoryId,
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        duration: duration.trim(),
        image: image.trim(),
        features,
        status,
        featured,
        terms,
      };

      if (isEditing && product) {
        await updateProduct(product.id, productPayload);
        onSuccess(`Produk "${name}" berhasil diperbarui.`);
      } else {
        await addProduct(productPayload);
        onSuccess(`Produk "${name}" berhasil ditambahkan.`);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Produk Akun" : "Tambah Produk Akun Baru"}
      description="Lengkapi detail produk akun digital di bawah ini."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Produk *
            </label>
            <Input
              type="text"
              placeholder="Contoh: Netflix Premium 1 Bulan"
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
              placeholder="netflix-premium-1-bulan"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori *
            </label>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Durasi / Paket
            </label>
            <Input
              type="text"
              placeholder="Contoh: 1 Bulan, 1 Tahun, Lifetime"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harga Jual (Rp) *
            </label>
            <Input
              type="number"
              placeholder="35000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harga Asal / Coret (Rp, Opsional)
            </label>
            <Input
              type="number"
              placeholder="54000"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi Produk
          </label>
          <Textarea
            rows={3}
            placeholder="Jelaskan detail produk akun ini secara menarik..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image Uploader */}
        <ImageUploader value={image} onChange={setImage} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fitur Produk (1 baris per fitur)
            </label>
            <Textarea
              rows={4}
              placeholder="Ultra HD 4K&#10;Dolby Atmos&#10;Private PIN"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Syarat & Ketentuan (1 baris per poin)
            </label>
            <Textarea
              rows={4}
              placeholder="Dilarang ganti email&#10;Garansi 30 hari penuh"
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Stok & Ketersediaan
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
            >
              <option value="available">Tersedia (Ready Stock)</option>
              <option value="out_of_stock">Stok Habis (Out of Stock)</option>
              <option value="inactive">Nonaktif (Sembunyikan)</option>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-800">
                Tampilkan di Produk Unggulan
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
