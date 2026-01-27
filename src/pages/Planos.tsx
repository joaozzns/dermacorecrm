import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { PlansComparisonTable } from "@/components/landing/PlansComparisonTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Check, 
  Sparkles, 
  Crown, 
  Building2, 
  ArrowRight,
  Users,
  UserCheck,
  Target
} from "lucide-react";

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

const getPlanIcon = (slug: string) => {
  switch (slug) {
    case "enterprise":
      return <Building2 className="w-6 h-6" />;
    case "profissional":
      return <Crown className="w-6 h-6" />;
    default:
      return <Sparkles className="w-6 h-6" />;
  }
};

const getPlanColors = (slug: string) => {
  switch (slug) {
    case "enterprise":
      return {
        gradient: "from-amber-500 to-orange-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-500",
        button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      };
    case "profissional":
      return {
        gradient: "from-primary to-accent",
        bg: "bg-primary/10",
        border: "border-primary/30",
        text: "text-primary",
        button: "btn-premium",
      };
    default:
      return {
        gradient: "from-muted-foreground to-muted-foreground",
        bg: "bg-muted/50",
        border: "border-border",
        text: "text-muted-foreground",
        button: "",
      };
  }
};

const PlanCard = ({ plan, isPopular }: { plan: Plan; isPopular: boolean }) => {
  const colors = getPlanColors(plan.slug);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border ${colors.border} ${colors.bg} p-8 flex flex-col h-full ${
        isPopular ? "ring-2 ring-primary shadow-xl shadow-primary/20 scale-105" : ""
      }`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Mais Popular
        </Badge>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} text-white mb-4`}>
          {getPlanIcon(plan.slug)}
        </div>
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        {plan.description && (
          <p className="text-muted-foreground text-sm">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl font-bold ${colors.text}`}>
            {formatCurrency(plan.price_monthly)}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-background/50">
        <div className="text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-semibold">
            {plan.max_professionals === null ? "∞" : plan.max_professionals}
          </p>
          <p className="text-xs text-muted-foreground">Profissionais</p>
        </div>
        <div className="text-center">
          <UserCheck className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-semibold">
            {plan.max_patients === null ? "∞" : plan.max_patients.toLocaleString("pt-BR")}
          </p>
          <p className="text-xs text-muted-foreground">Pacientes</p>
        </div>
        <div className="text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-semibold">
            {plan.max_leads_per_month === null ? "∞" : plan.max_leads_per_month}
          </p>
          <p className="text-xs text-muted-foreground">Leads/mês</p>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 ${colors.text} shrink-0 mt-0.5`} />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link to="/auth" className="w-full">
        <Button 
          className={`w-full ${colors.button}`}
          variant={isPopular ? "default" : "outline"}
        >
          {plan.slug === "enterprise" ? "Falar com Vendas" : "Começar Agora"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
};

const Planos = () => {
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
