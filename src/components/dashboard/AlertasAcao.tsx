import { AlertTriangle, Clock, UserX, TrendingDown, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alerta {
  id: string;
  tipo: 'critico' | 'aviso' | 'oportunidade';
  titulo: string;
  descricao: string;
  valor?: number;
  acao: string;
  tempoAgo?: string;
}

const alertas: Alerta[] = [
  {
    id: "1",
    tipo: "critico",
    titulo: "3 leads sem atendimento há 48h",
    descricao: "Potencial de R$ 12.500 parado. Ação imediata necessária.",
    valor: 12500,
    acao: "Atender agora",
    tempoAgo: "2 dias"
  },
  {
    id: "2",
    tipo: "critico",
    titulo: "R$ 8.200 em risco por no-show",
    descricao: "5 pacientes com histórico de falta agendados hoje.",
    valor: 8200,
    acao: "Confirmar agora",
    tempoAgo: "Hoje"
  },
  {
    id: "3",
    tipo: "aviso",
    titulo: "Follow-up pendente pós-avaliação",
    descricao: "8 pacientes aguardando retorno após orçamento.",
    valor: 45000,
    acao: "Enviar follow-up"
  },
  {
    id: "4",
    tipo: "oportunidade",
    titulo: "Pacientes para recompra",
    descricao: "12 pacientes completaram 90 dias desde último procedimento.",
    valor: 36000,
    acao: "Acionar campanha"
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const AlertasAcao = () => {
  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-revenue-at-risk to-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ações Críticas</h2>
            <p className="text-sm text-muted-foreground">Dinheiro em risco agora</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-revenue-lost-bg text-revenue-lost">
          {alertas.filter(a => a.tipo === 'critico').length} urgentes
        </span>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta, index) => (
          <AlertaCard key={alerta.id} alerta={alerta} index={index} />
        ))}
      </div>
    </div>
  );
};

interface AlertaCardProps {
  alerta: Alerta;
  index: number;
}

const AlertaCard = ({ alerta, index }: AlertaCardProps) => {
  const icons = {
    critico: <AlertTriangle className="w-5 h-5" />,
    aviso: <Clock className="w-5 h-5" />,
    oportunidade: <TrendingDown className="w-5 h-5" />
  };

  const classes = {
    critico: "alert-critical",
    aviso: "alert-warning",
    oportunidade: "alert-success"
  };

  const iconBg = {
    critico: "bg-revenue-lost text-white",
    aviso: "bg-revenue-at-risk text-white",
    oportunidade: "bg-revenue-confirmed text-white"
  };

  return (
    <div 
      className={cn(
        classes[alerta.tipo],
        "animate-slide-in-right"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg[alerta.tipo])}>
          {icons[alerta.tipo]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">{alerta.titulo}</h3>
              <p className="text-sm text-muted-foreground mt-1">{alerta.descricao}</p>
            </div>
            {alerta.valor && (
              <div className="text-right flex-shrink-0">
                <div className={cn(
                  "text-lg font-bold",
                  alerta.tipo === 'critico' ? "text-revenue-lost" : 
                  alerta.tipo === 'aviso' ? "text-revenue-at-risk" : 
                  "text-revenue-confirmed"
                )}>
                  {formatCurrency(alerta.valor)}
                </div>
                {alerta.tempoAgo && (
                  <span className="text-xs text-muted-foreground">{alerta.tempoAgo}</span>
                )}
              </div>
            )}
          </div>
          
          <button className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {alerta.acao}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
