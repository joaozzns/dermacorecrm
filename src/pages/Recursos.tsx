import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Users, Calendar, MessageCircle, BarChart3, DollarSign, Zap, Heart, FileText, Shield, Stethoscope, RefreshCw, UserCog } from "lucide-react";

const features = [
  { icon: Users, title: "Gestão de Leads", description: "Pipeline visual com etapas personalizáveis. Acompanhe cada lead desde o primeiro contato até a conversão.", highlights: ["Pipeline Kanban", "Score de leads", "Atribuição automática"] },
  { icon: Calendar, title: "Agenda Inteligente", description: "Agendamentos com confirmação automática, integração Google Calendar e gestão de horários.", highlights: ["Google Calendar", "Confirmação via WhatsApp", "Gestão de faltas"] },
  { icon: MessageCircle, title: "WhatsApp Integrado", description: "Envie mensagens automáticas, templates personalizados e comunicação em massa.", highlights: ["Templates", "Mensagens automáticas", "Histórico completo"] },
  { icon: Zap, title: "Automações", description: "Crie fluxos automáticos para boas-vindas, lembretes, follow-ups e pós-procedimento.", highlights: ["Boas-vindas", "Lembretes 24h", "Follow-up pós"] },
  { icon: FileText, title: "Orçamentos", description: "Gere orçamentos profissionais com seus procedimentos cadastrados e envie em segundos.", highlights: ["Templates profissionais", "Envio por WhatsApp", "Validade automática"] },
  { icon: Stethoscope, title: "Procedimentos", description: "Catálogo completo de procedimentos com categorias, preços e tempos de execução.", highlights: ["Categorias", "Precificação", "Tempo estimado"] },
  { icon: Heart, title: "Pós-Procedimento", description: "Orientações automáticas de cuidados pós-procedimento para cada tipo de tratamento.", highlights: ["Orientações personalizadas", "Envio automático", "Acompanhamento"] },
  { icon: RefreshCw, title: "Follow-up", description: "Sequências de follow-up automatizadas para não perder nenhuma oportunidade.", highlights: ["Sequências multi-etapa", "Timing inteligente", "Métricas de conversão"] },
  { icon: BarChart3, title: "Relatórios", description: "Dashboards e relatórios completos para acompanhar a performance da clínica.", highlights: ["Dashboard em tempo real", "Métricas de receita", "Análise de conversão"] },
  { icon: DollarSign, title: "Financeiro", description: "Controle financeiro completo com receitas, despesas e projeções.", highlights: ["Receita por período", "Comissões", "Projeções"] },
  { icon: UserCog, title: "Gestão de Equipe", description: "Gerencie profissionais, metas, comissões e acessos da sua equipe.", highlights: ["Controle de acesso", "Metas individuais", "Convites por link"] },
  { icon: Shield, title: "Segurança LGPD", description: "Proteção de dados dos pacientes com criptografia e conformidade total com a LGPD.", highlights: ["Criptografia", "RLS por clínica", "Logs de acesso"] },
];

export default function Recursos() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Recursos</h1>
          <p className="text-lg text-muted-foreground">Tudo o que você precisa para gerenciar e crescer sua clínica</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.description}</p>
              <ul className="space-y-1">
                {f.highlights.map((h, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
