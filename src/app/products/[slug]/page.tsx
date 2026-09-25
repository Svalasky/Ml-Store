import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { getProductBySlug } from "@/services/productService";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Akun Tidak Ditemukan | ML Account Store",
      description: "Detail akun Mobile Legends yang dicari tidak ditemukan.",
    };
  }

  const title = `Jual Akun Mobile Legends ${product.rank || "Mythic"} ${product.skin_count} Skin - ${product.name}`;
  const description = `Jual akun Mobile Legends dengan ${product.skin_count} skin, ${product.collector_count || 0} Collector dan ${product.legend_count || 0} Legend. Win Rate ${product.win_rate || 50}%. Garansi anti hack-back.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url:
            product.primary_image ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
          width: 800,
          height: 500,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailView product={product} />
      </main>

      <Footer />
    </div>
  );
}
