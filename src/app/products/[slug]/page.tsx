import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Halaman produk akun digital yang Anda cari tidak tersedia.",
    };
  }

  return {
    title: `${product.name} | Beli via WhatsApp`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Mole Store`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductDetailClient slug={slug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
