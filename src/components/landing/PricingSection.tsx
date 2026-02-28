import { ScrollReveal } from "./ScrollReveal";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Essencial",
    slug: "essencial",
    description: "Ideal para clínicas iniciantes",
    price: "197",
    period: "/mês",
    icon: Zap,
    popular: false,
    features: [
      "Até 2 profissionais",
      "Agenda online ilimitada",
      "Gestão de pacientes",
      "Lembretes WhatsApp",
      "Relatórios básicos",
      "Suporte por email"
    ],
    cta: "Começar Agora",
    gradient: "from-slate-500 to-slate-600"
  },
  {
    name: "Profissional",
    slug: "profissional",
    description: "Mais popular para clínicas em crescimento",
    price: "397",
    period: "/mês",
    icon: Star,
    popular: true,
    features: [
      "Até 5 profissionais",
      "Tudo do Essencial +",
      "IA para conversão de leads",
      "Automações WhatsApp",
      "Controle financeiro completo",
      "Fotos antes/depois",
      "Relatórios avançados",
      "Suporte prioritário"
    ],
    cta: "Escolher Profissional",
    gradient: "from-primary to-primary"
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "Para redes de clínicas",
    price: "797",
    period: "/mês",
    icon: Crown,
    popular: false,
    features: [
      "Profissionais ilimitados",
      "Tudo do Profissional +",
      "Multi-unidades",
      "API personalizada",
      "Integrações customizadas",
      "Gerente de conta dedicado",
      "Treinamento presencial",
      "SLA garantido"
    ],
    cta: "Escolher Enterprise",
    gradient: "from-amber-500 to-orange-500"
  }
];

export const PricingSection = () => {
  const { user } = useAuth();
  const { planSlug, createCheckout } = useSubscription();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (slug: string) => {
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/planos', planSlug: slug } });
      return;
    }

    setLoadingPlan(slug);
    try {
      await createCheckout(slug);
    } catch (error) {
      toast({
        title: "Erro ao iniciar checkout",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (planSlug === plan.slug) return "Seu Plano Atual";
    return plan.cta;
  };

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha o plano ideal
            <br />
            <span className="text-gradient-gold">para sua clínica</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sem taxas ocultas. Cancele quando quiser. 7 dias grátis para testar.
          </p>
        </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isCurrentPlan = planSlug === plan.slug;
            const isLoading = loadingPlan === plan.slug;
            
            return (
              <ScrollReveal key={plan.name} delay={index * 0.15}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`relative h-full rounded-2xl p-8 ${
                    plan.popular 
                      ? 'bg-gradient-to-b from-primary/10 to-card border-2 border-primary shadow-2xl shadow-primary/20' 
                      : 'bg-card border border-border hover:border-primary/30'
                  } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''} transition-all duration-300`}
                >
                  {/* Popular Badge */}
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-lg">
                        Mais Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium shadow-lg">
                        Seu Plano
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-muted-foreground">R$</span>
                      <span className={`text-5xl font-bold ${plan.popular ? 'text-gradient-primary' : ''}`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'bg-primary' : 'bg-primary/20'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`group relative inline-flex items-center justify-center w-full py-4 px-8 rounded-full font-medium text-base overflow-hidden transition-colors duration-700 border-2 z-[1] cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground border-primary hover:text-primary'
                        : 'bg-foreground text-background border-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleSelectPlan(plan.slug)}
                    disabled={isLoading || isCurrentPlan}
                  >
                    <span className="absolute top-0 left-0 w-0 h-full bg-background transition-all duration-700 ease-in-out z-[-1] group-hover:w-full" />
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        {getButtonText(plan)}
                        {!isCurrentPlan && (
                          <span className="ml-4 text-lg transition-transform duration-400 group-hover:translate-x-1">→</span>
                        )}
                      </>
                    )}
                  </button>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Money Back Guarantee */}
        <ScrollReveal delay={0.5} className="mt-12">
          <div className="text-center p-6 rounded-2xl bg-secondary/30 border border-border max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xl font-semibold">Garantia de 30 dias</span>
            </div>
            <p className="text-muted-foreground">
              Se não estiver satisfeito, devolvemos 100% do seu investimento. Sem perguntas.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
