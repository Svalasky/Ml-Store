"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductCard } from "./ProductCard";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Clock,
  Info,
  FileText,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { products, getCategoryById } = useStore();
  const [copied, setCopied] = useState(false);
  const category = getCategoryById(product.categoryId);

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.featured))
    .slice(0, 4);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOutOfStock = product.status === "out_of_stock";

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Produk
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {category && (
          <>
            <Link
              href={`/products?category=${category.id}`}
              className="hover:text-slate-900 transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image with glass badge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <StockBadge status={product.status} />
            </div>
          </div>

          {/* Quick trust reassurance pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-700 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Garansi Full Penggantian</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-700 shadow-xs">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Proses Cepat 1-5 Menit</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, pricing, features, purchase CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {category?.name || "Akun Digital"}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-xs text-slate-500 hover:text-slate-900 gap-1.5 h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Bagikan</span>
                  </>
                )}
              </Button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.duration && (
              <div className="mt-2.5 flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Masa Aktif / Paket:</span>
                <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {product.duration}
                </span>
              </div>
            )}
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 p-5">
            <span className="text-xs text-slate-500 font-medium block mb-1">
              Harga Spesial:
            </span>
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="xl"
            />
            <p className="mt-2 text-xs text-slate-500">
              *Harga tertera sudah nett tanpa biaya tersembunyi.
            </p>
          </div>

          {/* Primary Action Button (WhatsApp purchase funnel) */}
          <div className="space-y-3 pt-2">
            <WhatsAppButton
              product={product}
              size="lg"
              fullWidth
              className="text-base py-6 shadow-lg rounded-2xl"
            />

            {isOutOfStock ? (
              <p className="text-xs text-center text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                ⚠️ Stok saat ini sedang kosong. Klik tombol di atas untuk bertanya kepada Admin mengenai estimasi restock.
              </p>
            ) : (
              <p className="text-xs text-center text-slate-500">
                Klik tombol di atas untuk membuka WhatsApp dengan format pesanan otomatis.
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="pt-4 border-t border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Features List */}
          {product.features && product.features.length > 0 && (
            <div className="pt-4 border-t border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Fitur & Keunggulan</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Terms & Conditions */}
          {product.terms && product.terms.length > 0 && (
            <div className="pt-4 border-t border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Syarat & Ketentuan Akun</span>
              </h3>
              <ul className="space-y-2">
                {product.terms.map((term, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
                  >
                    <span className="text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="h-4 w-4 text-slate-700" />
              <span>Informasi Pengiriman:</span>
            </div>
            <p>
              Setelah pembayaran berhasil diverifikasi di WhatsApp, Admin akan langsung mengirimkan detail login akun (email, password, profile, dan panduan) dalam waktu 1-5 menit.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Produk Terkait Lainnya
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pilihan akun digital populer yang mungkin Anda butuhkan
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Lihat Semua Katalog &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
