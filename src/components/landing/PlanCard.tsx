import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Crown, 
  Building2, 
  ArrowRight,
  Users,
  UserCheck,
  Target,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
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

interface PlanCardProps {
  plan: Plan;
  isPopular: boolean;
  currentPlanSlug?: string | null;
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
        button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white",
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

export const PlanCard = ({ plan, isPopular, currentPlanSlug }: PlanCardProps) => {
  const colors = getPlanColors(plan.slug);
  const { user } = useAuth();
  const { createCheckout } = useSubscription();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const isCurrentPlan = currentPlanSlug === plan.slug;

  const handleStartPlan = async () => {
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/planos', planSlug: plan.slug } });
      return;
    }

    if (plan.slug === 'enterprise') {
      // For enterprise, redirect to contact or show contact modal
      window.open('mailto:contato@dermacore.com.br?subject=Interesse no Plano Enterprise', '_blank');
      return;
    }

    setIsLoading(true);
    try {
      await createCheckout(plan.slug);
    } catch (error) {
      toast({
        title: "Erro ao iniciar checkout",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) return "Seu Plano Atual";
    if (plan.slug === "enterprise") return "Falar com Vendas";
    return "Começar Agora";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border ${colors.border} p-8 flex flex-col h-full backdrop-blur-xl bg-card/60 shadow-lg ${
        isPopular ? "ring-2 ring-primary shadow-xl shadow-primary/20 scale-105 bg-primary/5 backdrop-blur-2xl" : ""
      } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
    >
      {isPopular && !isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Mais Popular
        </Badge>
      )}
      
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white">
          Seu Plano
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
      <button
        className={`group relative inline-flex items-center justify-center w-full py-4 px-8 rounded-full font-medium text-base overflow-hidden transition-colors duration-400 border-2 z-[1] cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
          isPopular
            ? 'bg-primary text-primary-foreground border-primary hover:text-primary'
            : 'bg-foreground text-background border-foreground hover:text-foreground'
        }`}
        onClick={handleStartPlan}
        disabled={isLoading || isCurrentPlan}
      >
        <span
          className={`absolute top-0 left-0 w-0 h-full transition-all duration-400 ease-in-out z-[-1] group-hover:w-full ${
            isPopular ? 'bg-background' : 'bg-background'
          }`}
        />
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {getButtonText()}
            {!isCurrentPlan && (
              <span className="ml-4 text-lg transition-transform duration-400 group-hover:translate-x-1">→</span>
            )}
          </>
        )}
      </button>
    </motion.div>
  );
};
