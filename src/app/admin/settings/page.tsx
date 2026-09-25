"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { StoreSettings } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cleanWhatsAppNumber } from "@/lib/whatsapp";
import {
  Save,
  MessageCircle,
  Store,
  Share2,
  Mail,
  MapPin,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetToDefault } = useStore();

  const [form, setForm] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(form);
      toast.success("Pengaturan toko berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data ke pengaturan awal?")) {
      resetToDefault();
      toast.info("Pengaturan dikembalikan ke awal.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Toko & WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Konfigurasi identitas toko, nomor WhatsApp tujuan order, dan kontak media sosial
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs gap-1.5 h-10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            isLoading={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 h-10 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: WhatsApp Configuration (Crucial Sales Funnel) */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Konfigurasi WhatsApp Sales Funnel
              </h3>
              <p className="text-xs text-slate-500">
                Nomor ini akan menerima seluruh pesanan dan pertanyaan dari calon customer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Admin (Aktif) *
              </label>
              <Input
                type="text"
                placeholder="6281234567890"
                value={form.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                required
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Gunakan awalan kode negara tanpa tanda plus (+). Contoh: 6281234567890. Format wa.me:{" "}
                <span className="font-mono text-emerald-700">
                  wa.me/{cleanWhatsAppNumber(form.whatsappNumber)}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pesan Default / Umum
              </label>
              <Input
                type="text"
                value={form.whatsappMessage}
                onChange={(e) => handleChange("whatsappMessage", e.target.value)}
                placeholder="Halo Admin, saya ingin bertanya..."
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Pesan pembuka ketika customer menekan tombol Chat WhatsApp di Navbar/Footer
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Toko */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Identitas Toko</h3>
              <p className="text-xs text-slate-500">Nama toko, slogan, dan deskripsi publik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Toko *
              </label>
              <Input
                type="text"
                value={form.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slogan / Tagline
              </label>
              <Input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Toko (SEO & Footer)
            </label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Social Media & Kontak */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Media Sosial & Kontak Resmi
              </h3>
              <p className="text-xs text-slate-500">
                Tampilkan channel resmi agar meningkatkan kredibilitas di mata calon pembeli
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram Username
              </label>
              <Input
                type="text"
                placeholder="molestore.id"
                value={form.instagram || ""}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TikTok Username
              </label>
              <Input
                type="text"
                placeholder="molestore.official"
                value={form.tiktok || ""}
                onChange={(e) => handleChange("tiktok", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telegram Channel / Username
              </label>
              <Input
                type="text"
                placeholder="molestore_channel"
                value={form.telegram || ""}
                onChange={(e) => handleChange("telegram", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Dukungan
              </label>
              <Input
                type="email"
                placeholder="support@molestore.com"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat / Kota Operasional
              </label>
              <Input
                type="text"
                placeholder="Jakarta Selatan, Indonesia"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 shadow-md"
          >
            Simpan Seluruh Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
