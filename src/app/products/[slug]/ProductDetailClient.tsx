"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageX } from "lucide-react";

export function ProductDetailClient({ slug }: { slug: string }) {
  const { products, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 aspect-square rounded-3xl" />
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4">
          <PackageX className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Produk Tidak Ditemukan</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md">
          Produk dengan tautan ini mungkin sudah dihapus atau slug URL tidak valid.
        </p>
        <Link href="/products" className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog</span>
          </Button>
        </Link>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}
