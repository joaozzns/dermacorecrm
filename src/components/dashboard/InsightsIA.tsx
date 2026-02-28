import { Brain, Lightbulb, TrendingUp, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";

interface Insight {
  id: string;
  tipo: 'perda' | 'oportunidade' | 'tendencia' | 'alerta';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
}

// Demo insights
const DEMO_INSIGHTS: Insight[] = [
  { id: 'demo-1', tipo: 'perda', titulo: 'Você perdeu R$ 15.200 este mês', descricao: '8 leads perdidos por falta de follow-up. Automatize mensagens para reduzir perdas.', impacto: 'alto' },
  { id: 'demo-2', tipo: 'oportunidade', titulo: 'Harmonização gera 3x mais receita', descricao: 'Clientes de harmonização têm ticket médio 3x maior. Invista em campanhas focadas.', impacto: 'alto' },
  { id: 'demo-3', tipo: 'tendencia', titulo: 'Taxa de conversão: 42%', descricao: '15 de 36 leads convertidos. Acima da média do setor (28%).', impacto: 'medio' },
  { id: 'demo-4', tipo: 'alerta', titulo: '6 no-shows esta semana', descricao: 'Confirmação automática por WhatsApp pode reduzir faltas em até 60%.', impacto: 'alto' },
];

export const InsightsIA = ({ isDemo = false }: { isDemo?: boolean }) => {
  const { leads: realLeads, isLoading: leadsLoading } = useLeads();
  const { appointments: realAppointments, isLoading: aptsLoading } = useAppointments();

  const isLoading = !isDemo && (leadsLoading || aptsLoading);
  const leads = isDemo ? [] : realLeads;
  const appointments = isDemo ? [] : realAppointments;

  // Compute insights from real data
  const insights: Insight[] = isDemo ? DEMO_INSIGHTS : [];

  if (!isDemo) {
  // Lost leads insight
  const lostLeads = leads.filter(l => l.status === 'perdido');
  if (lostLeads.length > 0) {
    insights.push({
      id: 'lost-leads',
      tipo: 'perda',
      titulo: `${lostLeads.length} lead${lostLeads.length > 1 ? 's' : ''} perdido${lostLeads.length > 1 ? 's' : ''} este período`,
      descricao: 'Analise os motivos de perda para melhorar sua taxa de conversão.',
      impacto: lostLeads.length > 5 ? 'alto' : 'medio',
    });
  }

  // Conversion rate insight
  const convertedLeads = leads.filter(l => l.status === 'convertido');
  const totalLeads = leads.length;
  if (totalLeads > 0) {
    const conversionRate = ((convertedLeads.length / totalLeads) * 100).toFixed(0);
    insights.push({
      id: 'conversion',
      tipo: 'tendencia',
      titulo: `Taxa de conversão: ${conversionRate}%`,
      descricao: `${convertedLeads.length} de ${totalLeads} leads foram convertidos.`,
      impacto: Number(conversionRate) > 30 ? 'alto' : 'medio',
    });
  }

  // Source analysis
  const sourceCount: Record<string, number> = {};
  leads.forEach(l => {
    const source = l.source || 'Desconhecido';
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  });
  const topSource = Object.entries(sourceCount).sort((a, b) => b[1] - a[1])[0];
  if (topSource && totalLeads > 2) {
    insights.push({
      id: 'top-source',
      tipo: 'oportunidade',
      titulo: `${topSource[0]} é sua melhor fonte de leads`,
      descricao: `${topSource[1]} leads vieram deste canal. Considere investir mais nele.`,
      impacto: 'medio',
    });
  }

  // No-show insight
  const noShows = appointments.filter(a => a.status === 'faltou');
  if (noShows.length > 0) {
    insights.push({
      id: 'no-shows',
      tipo: 'alerta',
      titulo: `${noShows.length} falta${noShows.length > 1 ? 's' : ''} registrada${noShows.length > 1 ? 's' : ''}`,
      descricao: 'Confirmação automática por WhatsApp pode reduzir faltas em até 60%.',
      impacto: noShows.length > 3 ? 'alto' : 'medio',
    });
  }

  // Fallback if no insights
  if (insights.length === 0) {
    insights.push({
      id: 'welcome',
      tipo: 'oportunidade',
      titulo: 'Comece a cadastrar leads e agendamentos',
      descricao: 'Com mais dados, a IA gerará insights personalizados para sua clínica.',
      impacto: 'baixo',
    });
  }
  }

  if (isLoading) {
    return (
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
            <Brain className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-revenue-confirmed animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Insights Inteligentes</h2>
            <p className="text-sm text-muted-foreground">Baseado nos seus dados</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          Em tempo real
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.slice(0, 4).map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
};

const tipoConfig = {
  perda: {
    icon: <AlertCircle className="w-5 h-5" />,
    bg: "bg-revenue-lost-bg",
    iconBg: "bg-revenue-lost",
    border: "border-revenue-lost/20"
  },
  oportunidade: {
    icon: <Lightbulb className="w-5 h-5" />,
    bg: "bg-revenue-confirmed-bg",
    iconBg: "bg-revenue-confirmed",
    border: "border-revenue-confirmed/20"
  },
  tendencia: {
    icon: <TrendingUp className="w-5 h-5" />,
    bg: "bg-secondary",
    iconBg: "bg-primary",
    border: "border-primary/20"
  },
  alerta: {
    icon: <AlertCircle className="w-5 h-5" />,
    bg: "bg-revenue-at-risk-bg",
    iconBg: "bg-revenue-at-risk",
    border: "border-revenue-at-risk/20"
  }
};

const impactoColors = {
  alto: "bg-revenue-lost text-white",
  medio: "bg-revenue-at-risk text-white",
  baixo: "bg-muted text-muted-foreground"
};

const InsightCard = ({ insight, index }: { insight: Insight; index: number }) => {
  const config = tipoConfig[insight.tipo];

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer group",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0", config.iconBg)}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground text-sm leading-tight">{insight.titulo}</h3>
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0", impactoColors[insight.impacto])}>
              {insight.impacto}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{insight.descricao}</p>
        </div>
      </div>
    </div>
  );
};
