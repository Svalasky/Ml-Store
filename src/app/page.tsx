import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/home/Hero";
import { BannerSection } from "@/components/home/BannerSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySection } from "@/components/home/CategorySection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { HowToOrder } from "@/components/home/HowToOrder";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BannerSection />
        <FeaturedProducts />
        <CategorySection />
        <WhyChooseUs />
        <TestimonialSection />
        <HowToOrder />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
