"use client";

import React, { useState, useEffect } from "react";
import { StoreSettings } from "@/types/database";
import { getStoreSettings } from "@/services/settingService";
import { Settings, Save, CheckCircle2, MessageCircle, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "MLBB Account Store",
    whatsapp_number: "6281234567890",
    instagram: "@mlbb_store",
    tiktok: "@mlbb_store",
    email: "support@mlbb-store.com",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Pengaturan Toko (Store Settings)
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Kelola informasi kontak WhatsApp resmi, nama marketplace, dan sosial media.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-card border border-border space-y-5 text-xs">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Nama Toko / Marketplace</label>
          <input
            type="text"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">
            Nomor WhatsApp Resmi Admin (Format: 628xxx)
          </label>
          <input
            type="text"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none font-mono"
          />
          <p className="text-[11px] text-muted-foreground">
            Nomor ini akan digunakan untuk semua redirect checkout pesanan akun dari pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Akun Instagram</label>
            <input
              type="text"
              value={settings.instagram || ""}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Akun TikTok</label>
            <input
              type="text"
              value={settings.tiktok || ""}
              onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-foreground">Email Dukungan Pelanggan</label>
            <input
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-primary/90 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
