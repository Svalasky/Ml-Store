"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { getCategoryById } = useStore();
  const category = getCategoryById(product.categoryId);

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-300">
        {/* Thumbnail Image */}
        <div className="relative h-44 w-full md:w-56 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Unggulan</span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5">
            <StockBadge status={product.status} showIcon={false} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between w-full h-full py-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {category?.name || "Digital Account"}
              </span>
              {product.duration && (
                <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {product.duration}
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />

            <div className="flex items-center gap-2">
              <Link href={`/products/${product.slug}`} className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>Detail</span>
                </Button>
              </Link>
              <WhatsAppButton
                product={product}
                size="sm"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Unggulan</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5">
          <StockBadge status={product.status} showIcon={false} />
        </div>
      </div>

      {/* Info Body */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-emerald-700 truncate max-w-[150px]">
              {category?.name || "Akun Digital"}
            </span>
            {product.duration && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600">
                <Clock className="h-3 w-3 text-slate-400" />
                {product.duration}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="mb-3">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="default"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/products/${product.slug}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Detail
              </Button>
            </Link>

            <WhatsAppButton
              product={product}
              size="sm"
              showIcon={false}
              className="w-full rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
