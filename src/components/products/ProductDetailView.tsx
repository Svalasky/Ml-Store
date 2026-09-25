"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle,
  FileText,
  Share2,
  Check,
  Info,
  Layers,
  MessageCircle,
} from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { OrderModal } from "@/components/products/OrderModal";
import { formatRupiah } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { categories } = useStore();
  const [copied, setCopied] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Variant selection state
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    hasVariants ? product.variants![0] : undefined
  );

  const category = categories.find((c) => c.id === product.categoryId);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice
    : product.originalPrice;
  const activeDuration = selectedVariant
    ? selectedVariant.duration || selectedVariant.name
    : product.duration || "Standar";
  const activeStatus = selectedVariant ? selectedVariant.status : product.status;
  const isOutOfStock = activeStatus === "out_of_stock";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
        selectedVariant={selectedVariant}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600 transition-colors">
          Katalog
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-emerald-600 transition-colors truncate max-w-[140px]"
            >
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-semibold text-slate-900 truncate max-w-[180px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Product Image & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={product.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <StockBadge status={activeStatus} />
            </div>
          </div>

          {/* Quick trust reassurance pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-700 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Garansi Full Replace</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-700 shadow-xs">
              <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Proses Cepat 1-5 Menit</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, variants, pricing, features, purchase CTA */}
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

            {activeDuration && (
              <div className="mt-2.5 flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Masa Aktif / Paket:</span>
                <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {activeDuration}
                </span>
              </div>
            )}
          </div>

          {/* Variants Selector */}
          {hasVariants && (
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-600" />
                <span>Pilih Paket / Varian:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants!.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isVarOut = variant.status === "out_of_stock";

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      } ${isVarOut ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {variant.name}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-emerald-700">
                          {formatRupiah(variant.price)}
                        </span>
                        {variant.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatRupiah(variant.originalPrice)}
                          </span>
                        )}
                      </div>
                      {variant.description && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {variant.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Box */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 p-5">
            <span className="text-xs text-slate-500 font-medium block mb-1">
              Harga Paket:
            </span>
            <PriceDisplay
              price={activePrice}
              originalPrice={activeOriginalPrice}
              size="xl"
            />
            <p className="mt-2 text-xs text-slate-500">
              *Harga tertera sudah nett dengan garansi penuh selama masa aktif.
            </p>
          </div>

          {/* Primary Action Button (WhatsApp purchase funnel) */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => setIsOrderModalOpen(true)}
              size="lg"
              variant={isOutOfStock ? "outline" : "whatsapp"}
              className="w-full text-base py-6 shadow-lg rounded-2xl gap-2 font-bold"
            >
              <MessageCircle className="h-5 w-5 fill-white text-white" />
              <span>{isOutOfStock ? "Tanya Ketersediaan Stok" : "Beli via WhatsApp"}</span>
            </Button>

            {isOutOfStock ? (
              <p className="text-xs text-center text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                Stok saat ini sedang kosong. Klik tombol di atas untuk bertanya kepada Admin mengenai estimasi restock.
              </p>
            ) : (
              <p className="text-xs text-center text-slate-500">
                Klik tombol di atas untuk membuat pesanan resmi dan langsung terhubung dengan Admin via WhatsApp.
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="pt-4 border-t border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
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
