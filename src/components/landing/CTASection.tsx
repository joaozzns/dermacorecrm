import { ScrollReveal } from "./ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center p-12 rounded-3xl bg-gradient-to-b from-card to-card/50 border border-border shadow-2xl">

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para transformar
              <br />
              <span className="text-gradient-primary">sua clínica?</span>
            </h2>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-muted-foreground">
              {[
                "7 dias grátis",
                "Sem cartão de crédito",
                "Suporte completo"
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/auth?plan=essencial">
                <Button 
                  size="lg" 
                  className="btn-gold text-base sm:text-xl px-6 sm:px-12 py-6 sm:py-8 group w-full sm:w-auto"
                >
                  Começar Minha Jornada
                  <ArrowRight className="ml-2 sm:ml-3 w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <p className="mt-6 text-sm text-muted-foreground">
              Mais de 500 clínicas já estão crescendo conosco
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};