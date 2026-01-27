import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { PlansComparisonTable } from "@/components/landing/PlansComparisonTable";
import { PlanCard } from "@/components/landing/PlanCard";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  max_professionals: number | null;
  max_patients: number | null;
  max_leads_per_month: number | null;
  features: string[];
  sort_order: number;
}

const Planos = () => {
  const [searchParams] = useSearchParams();
  const { planSlug: currentPlanSlug } = useSubscription();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Plan[];
    },
  });

  // Handle checkout result
  useEffect(() => {
    const checkoutResult = searchParams.get('checkout');
    if (checkoutResult === 'cancelled') {
      toast({
        title: "Checkout cancelado",
        description: "Você pode tentar novamente quando quiser.",
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Planos & Preços
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Escolha o plano ideal para sua clínica
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece com 7 dias grátis. Sem compromisso, cancele quando quiser.
            </p>
          </motion.div>

          {/* Plans Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[600px] rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {plans.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={plan.slug === "profissional"}
                  currentPlanSlug={currentPlanSlug}
                />
              ))}
            </div>
          )}

          {/* Comparison Table */}
          {!isLoading && plans.length > 0 && (
            <PlansComparisonTable plans={plans} />
          )}

          {/* FAQ/Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                7 dias grátis
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Cancele a qualquer momento
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Suporte dedicado
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Planos;
