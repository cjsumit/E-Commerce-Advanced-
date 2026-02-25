import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CollectionsSection from "@/components/home/CollectionsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <CollectionsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
