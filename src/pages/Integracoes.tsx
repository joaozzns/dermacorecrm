import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { MessageCircle, Calendar, CreditCard, BarChart3, FileText, Bell, Mail, Globe, CheckCircle } from "lucide-react";

const integrations = [
  {
    icon: MessageCircle,
    name: "WhatsApp Business",
    description: "Envie mensagens automáticas, lembretes e follow-ups diretamente pelo WhatsApp.",
    status: "available",
    category: "Comunicação",
  },
  {
    icon: Calendar,
    name: "Google Calendar",
    description: "Sincronize agendamentos com o Google Calendar da sua equipe.",
    status: "available",
    category: "Produtividade",
  },
  {
    icon: CreditCard,
    name: "Stripe",
    description: "Processamento de pagamentos e gestão de assinaturas integrado.",
    status: "available",
    category: "Pagamentos",
  },
  {
    icon: Mail,
    name: "Email Marketing",
    description: "Integre com plataformas de email marketing para campanhas automatizadas.",
    status: "coming_soon",
    category: "Marketing",
  },
  {
    icon: BarChart3,
    name: "Google Analytics",
    description: "Acompanhe métricas de conversão do seu site e landing pages.",
    status: "coming_soon",
    category: "Analytics",
  },
  {
    icon: FileText,
    name: "Nota Fiscal Eletrônica",
    description: "Emissão automática de NFS-e integrada ao financeiro.",
    status: "coming_soon",
    category: "Financeiro",
  },
  {
    icon: Bell,
    name: "Slack / Discord",
    description: "Receba notificações de novos leads e agendamentos no seu canal.",
    status: "coming_soon",
    category: "Comunicação",
  },
  {
    icon: Globe,
    name: "API Aberta",
    description: "Conecte o DermaCore com qualquer sistema através da nossa API REST.",
    status: "available",
    category: "Desenvolvimento",
  },
];

export default function Integracoes() {
  const available = integrations.filter(i => i.status === "available");
  const comingSoon = integrations.filter(i => i.status === "coming_soon");

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Integrações</h1>
          <p className="text-lg text-muted-foreground">Conecte o DermaCore às ferramentas que você já usa</p>
        </div>
      </section>

      {/* Available */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> Disponíveis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {available.map((int, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <int.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{int.name}</h3>
                    <span className="text-xs text-muted-foreground">{int.category}</span>
                    <p className="text-sm text-muted-foreground mt-2">{int.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Em Breve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoon.map((int, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card/50 opacity-80">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <int.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{int.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Em breve</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{int.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
