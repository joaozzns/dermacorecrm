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

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Agendamentos online 24/7 com confirmação automática via WhatsApp e lembretes personalizados.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Histórico completo, fotos antes/depois, prontuários digitais e acompanhamento pós-procedimento.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Controle Financeiro",
    description: "Receitas, despesas, comissões da equipe e relatórios detalhados em tempo real.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integrado",
    description: "Envie campanhas, confirmações e follow-ups automatizados diretamente pelo WhatsApp Business.",
    color: "from-green-400 to-green-600"
  },
  {
    icon: Brain,
    title: "IA para Conversão",
    description: "Insights inteligentes para aumentar conversões, identificar leads quentes e recuperar pacientes.",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Dados criptografados, backups automáticos e conformidade total com a LGPD.",
    color: "from-slate-500 to-slate-700"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tudo que sua clínica
            <br />
            <span className="text-gradient-primary">precisa em um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatize processos, reduza custos operacionais e foque no que realmente importa: seus pacientes.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
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

        {/* Stats Bar */}
        <ScrollReveal delay={0.4} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-card border border-border">
            {[
              { icon: BarChart3, value: "40%", label: "Aumento de Receita" },
              { icon: Calendar, value: "75%", label: "Menos No-shows" },
              { icon: Users, value: "500+", label: "Clínicas Ativas" },
              { icon: TrendingUp, value: "98%", label: "Satisfação" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
