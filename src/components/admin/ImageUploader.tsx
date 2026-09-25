"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const PRESET_IMAGES = [
  { name: "Netflix", url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80" },
  { name: "Spotify", url: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80" },
  { name: "YouTube", url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80" },
  { name: "AI / Tech", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80" },
  { name: "Design", url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80" },
  { name: "Gaming", url: "https://images.unsplash.com/photo-1612287233213-f66f50b2c3a5?w=800&auto=format&fit=crop&q=80" },
  { name: "Software", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80" },
];

export function ImageUploader({ value, onChange, label = "Foto / Thumbnail Produk" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // File upload simulation (read to Data URL - easily replaced with Cloudinary / S3 upload call)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setTimeout(() => {
        onChange(result);
        setIsUploading(false);
      }, 500); // Simulate upload latency
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showPresets ? "Tutup Preset" : "Gunakan Gambar Preset"}
        </button>
      </div>

      {/* Preset Picker */}
      {showPresets && (
        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          {PRESET_IMAGES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setShowPresets(false);
              }}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Preview Card */}
      {value ? (
        <div className="relative aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-colors"
            title="Hapus Gambar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="mt-2 text-xs text-slate-500">Mengunggah gambar...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-slate-400" />
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-emerald-600 hover:underline cursor-pointer">
                  Klik untuk unggah file
                </span>{" "}
                atau masukkan URL di bawah
              </div>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP maksimal 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      )}

      {/* Direct URL Input fallback */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Atau tempel URL gambar (https://...)"
          value={value.startsWith("data:") ? "[File Lokal Terunggah]" : value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs h-9"
        />
      </div>
    </div>
  );
}
