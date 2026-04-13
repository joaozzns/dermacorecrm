import { ScrollReveal } from "./ScrollReveal";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Brain, 
  Shield,
  BarChart3
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Agendamentos online 24/7 com confirmação automática via WhatsApp e lembretes personalizados.",
    highlight: false
  },
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Histórico completo, fotos antes/depois, prontuários digitais e acompanhamento pós-procedimento.",
    highlight: false
  },
  {
    icon: TrendingUp,
    title: "Controle Financeiro",
    description: "Receitas, despesas, comissões da equipe e relatórios detalhados em tempo real.",
    highlight: false
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integrado",
    description: "Envie campanhas, confirmações e follow-ups automatizados diretamente pelo WhatsApp Business.",
    highlight: true
  },
  {
    icon: Brain,
    title: "IA para Conversão",
    description: "Insights inteligentes para aumentar conversões, identificar leads quentes e recuperar pacientes.",
    highlight: true
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Dados criptografados, backups automáticos e conformidade total com a LGPD.",
    highlight: false
  }
];

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  
  const numericValue = parseInt(value.replace(/\D/g, ""));
  const hasPlus = value.includes("+");

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericValue));
      
      if (current >= steps) {
        clearInterval(timer);
        setCount(numericValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-gradient-primary mb-1 font-display">
      {count}{hasPlus ? "+" : ""}{suffix}
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
            Tudo que sua clínica
            <br />
            <span className="text-gradient-primary">precisa em um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatize processos, reduza custos operacionais e foque no que realmente importa: seus pacientes.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <div className={`group p-8 rounded-2xl bg-card border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full ${
                feature.highlight 
                  ? 'border-primary/30 shadow-md shadow-primary/5' 
                  : 'border-border hover:border-primary/30'
              }`}>
                {/* Icon - unified brand palette */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats Bar with Counter Animation */}
        <ScrollReveal delay={0.4} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-card border border-border">
            {[
              { icon: BarChart3, value: "40", suffix: "%", label: "Aumento de Receita" },
              { icon: Calendar, value: "75", suffix: "%", label: "Menos No-shows" },
              { icon: Users, value: "500+", suffix: "", label: "Clínicas Ativas" },
              { icon: TrendingUp, value: "98", suffix: "%", label: "Satisfação" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
