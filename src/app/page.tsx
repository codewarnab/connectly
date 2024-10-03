import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/NavBar";
import FeatureCard from "@/components/home/FeaturesSection";
import TestimonialSection from "@/components/home/Testimonials";
import PricingSection from "@/components/home/Pricing-Section";
import CTASection from "@/components/home/CtaSection";
import Footer from "@/components/home/Footer";
 
export default function Home() {
  
  return (
    <div>
      <Navbar />
      <Hero/>
      <FeatureCard />
      <TestimonialSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
