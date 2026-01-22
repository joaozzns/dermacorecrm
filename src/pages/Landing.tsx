import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />
      <main>
        <HeroSection />
        <section id="recursos">
          <FeaturesSection />
        </section>
        <section id="precos">
          <PricingSection />
        </section>
        <section id="depoimentos">
          <TestimonialsSection />
        </section>
        <section id="contato">
          <CTASection />
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Landing;
