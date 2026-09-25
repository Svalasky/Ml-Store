import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySection } from "@/components/home/CategorySection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowToOrder } from "@/components/home/HowToOrder";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <CategorySection />
        <WhyChooseUs />
        <HowToOrder />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
