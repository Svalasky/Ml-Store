"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import { Product, ProductStatus, ProductVariant } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { slugify } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: (msg: string) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const { categories, addProduct, updateProduct } = useStore();
  const isEditing = !!product;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [status, setStatus] = useState<ProductStatus>("available");
  const [featured, setFeatured] = useState(false);

  // Variant manager state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setCategoryId(product.categoryId);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
      setDuration(product.duration || "");
      setImage(product.image);
      setFeaturesText((product.features || []).join("\n"));
      setTermsText((product.terms || []).join("\n"));
      setStatus(product.status);
      setFeatured(product.featured || false);
      setVariants(product.variants || []);
    } else {
      setName("");
      setSlug("");
      setCategoryId(categories[0]?.id || "");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setDuration("1 Bulan");
      setImage("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80");
      setFeaturesText("Garansi Penuh Selama Durasi\n1 User 1 Device\nProses Cepat 1-5 Menit");
      setTermsText("Dilarang mengubah email/password\nGunakan profil sesuai nomor");
      setStatus("available");
      setFeatured(false);
      setVariants([
        {
          id: `var-1-${Date.now()}`,
          productId: "",
          name: "1 Bulan",
          price: 35000,
          originalPrice: 54000,
          duration: "1 Bulan",
          stock: 50,
          status: "available",
        },
      ]);
    }
    setError("");
  }, [product, categories, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: product?.id || "",
      name: "3 Bulan",
      price: Number(price) ? Number(price) * 2.5 : 90000,
      originalPrice: Number(originalPrice) ? Number(originalPrice) * 3 : undefined,
      duration: "3 Bulan",
      stock: 20,
      status: "available",
    };
    setVariants([...variants, newVar]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
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
        variants,
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
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
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
              placeholder="Contoh: Netflix Premium 4K"
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
              placeholder="netflix-premium-4k"
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
              Durasi Default
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
              Harga Mulai Dari (Rp) *
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

        {/* Variants Section */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span>Pilihan Paket / Varian Produk ({variants.length})</span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddVariant}
              className="text-xs gap-1 h-7"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Varian</span>
            </Button>
          </div>

          {variants.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Belum ada paket/varian tambahan. Produk akan menggunakan harga default.
            </p>
          ) : (
            <div className="space-y-2.5">
              {variants.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 bg-white rounded-xl border border-slate-200 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Nama Varian (1 Bulan)"
                      value={v.name}
                      onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                      className="w-full text-xs font-semibold p-1.5 rounded-lg border border-slate-200"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      placeholder="Harga (Rp)"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Durasi"
                      value={v.duration || ""}
                      onChange={(e) => handleVariantChange(idx, "duration", e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

        {/* Supabase Storage Image Uploader */}
        <ImageUploader value={image} onChange={setImage} pathPrefix="products" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fitur Produk (1 baris per fitur)
            </label>
            <Textarea
              rows={3}
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
              rows={3}
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
          <Button type="submit" disabled={isLoading}>
            {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}