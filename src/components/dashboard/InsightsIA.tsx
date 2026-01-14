import { Brain, Lightbulb, TrendingUp, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  tipo: 'perda' | 'oportunidade' | 'tendencia' | 'alerta';
  titulo: string;
  descricao: string;
  valor?: number;
  impacto: 'alto' | 'medio' | 'baixo';
}

const insights: Insight[] = [
  {
    id: "1",
    tipo: "perda",
    titulo: "Você perdeu R$ 15.200 com faltas este mês",
    descricao: "8 pacientes não compareceram. A confirmação automática reduziria isso em 60%.",
    valor: 15200,
    impacto: "alto"
  },
  {
    id: "2",
    tipo: "oportunidade",
    titulo: "Harmonização gera 3x mais lucro",
    descricao: "Este procedimento tem a maior margem. Considere promovê-lo mais.",
    impacto: "alto"
  },
  {
    id: "3",
    tipo: "tendencia",
    titulo: "Instagram traz leads que mais fecham",
    descricao: "Taxa de conversão de 42% vs. 18% do Google. Invista mais neste canal.",
    impacto: "medio"
  },
  {
    id: "4",
    tipo: "alerta",
    titulo: "Terça-feira tem baixa ocupação",
    descricao: "Apenas 45% de ocupação. Considere promoções ou realocação de agenda.",
    impacto: "medio"
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const InsightsIA = () => {
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
            <p className="text-sm text-muted-foreground">IA analisando sua clínica</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          Atualizado agora
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
};

interface InsightCardProps {
  insight: Insight;
  index: number;
}

const InsightCard = ({ insight, index }: InsightCardProps) => {
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

  const config = tipoConfig[insight.tipo];

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer group",
        config.bg,
        config.border
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
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
          
          <p className="text-xs text-muted-foreground mb-3">{insight.descricao}</p>
          
          <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors group-hover:gap-2">
            Ver detalhes
            <ArrowRight className="w-3 h-3 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
