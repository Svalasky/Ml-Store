import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { ProductGrid } from "@/components/products/ProductGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { FAQSection } from "@/components/home/FAQSection";
import { getProducts } from "@/services/productService";

export const metadata = {
  title: "Jual Akun Mobile Legends | ML Account Store Terpercaya",
  description:
    "Marketplace akun Mobile Legends terpercaya. Jual beli akun MLBB Sultan, Collector, Legend, Mythic Glory & Immortal dengan garansi 100% Anti Hack-Back.",
};

export default async function Home() {
  const initialProducts = await getProducts({ status: "available" });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
        {/* Hero Section */}
        <Hero />

        {/* Promo Banners */}
        <BannerCarousel />

        {/* Main Product Catalog */}
        <ProductGrid initialProducts={initialProducts} />

        {/* Benefits & Security */}
        <WhyChooseUs />

        {/* Testimonials */}
        <TestimonialSection />

        {/* FAQ */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
