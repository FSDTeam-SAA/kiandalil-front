import Header from "@/components/header";

import Footer from "@/components/footer";
import HeroSection from "@/components/landing/hero-section";
import CitiesSection from "@/components/landing/cities-section";
import StatsSection from "@/components/landing/stats-section";
import FeaturedProperties from "@/components/landing/featured-properties";
import ServicesSection from "@/components/landing/services-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import ContactSection from "@/components/landing/contact-section";
import FAQSection from "@/components/landing/faq-section";
import CTASection from "@/components/landing/cta-section";

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CitiesSection />
      <StatsSection />
      <FeaturedProperties />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
