import { AlertTriangle, Clock, TrendingDown, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Alerta {
  id: string;
  tipo: 'critico' | 'aviso' | 'oportunidade';
  titulo: string;
  descricao: string;
  acao: string;
  rota: string;
}

// Demo alerts data
const DEMO_ALERTAS: Alerta[] = [
  {
    id: 'demo-1',
    tipo: 'critico',
    titulo: '3 leads sem atendimento há 48h',
    descricao: 'Potencial de R$ 12.500 parado. Ação imediata necessária.',
    acao: 'Atender agora',
    rota: '/leads',
  },
  {
    id: 'demo-2',
    tipo: 'critico',
    titulo: 'R$ 8.200 em risco por no-show',
    descricao: '5 pacientes com histórico de falta agendados hoje.',
    acao: 'Confirmar agora',
    rota: '/agenda',
  },
  {
    id: 'demo-3',
    tipo: 'aviso',
    titulo: 'Follow-up pendente pós-avaliação',
    descricao: '8 pacientes aguardando retorno após orçamento.',
    acao: 'Enviar follow-up',
    rota: '/leads',
  },
];

export const AlertasAcao = ({ isDemo = false }: { isDemo?: boolean }) => {
  const { leads, isLoading: leadsLoading } = useLeads();
  const { appointments, isLoading: aptsLoading } = useAppointments();
  const navigate = useNavigate();

  const isLoading = !isDemo && (leadsLoading || aptsLoading);

  // Compute real alerts
  const alertas: Alerta[] = isDemo ? DEMO_ALERTAS : [];

  // Leads sem contato há mais de 48h
  if (!isDemo) {
  const now = new Date();
  const staleLeads = leads.filter(l => {
    if (l.status !== 'novo') return false;
    const created = new Date(l.created_at);
    const hoursAgo = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursAgo >= 48;
  });

  if (staleLeads.length > 0) {
    alertas.push({
      id: 'stale-leads',
      tipo: 'critico',
      titulo: `${staleLeads.length} lead${staleLeads.length > 1 ? 's' : ''} sem atendimento há 48h+`,
      descricao: 'Ação imediata necessária para não perder oportunidades.',
      acao: 'Atender agora',
      rota: '/leads',
    });
  }

  // Agendamentos pendentes (não confirmados) para hoje
  const today = new Date();
  const pendingToday = appointments.filter(a => {
    const aptDate = new Date(a.start_time);
    return aptDate.toDateString() === today.toDateString() && a.status === 'agendado';
  });

  if (pendingToday.length > 0) {
    alertas.push({
      id: 'pending-apts',
      tipo: 'critico',
      titulo: `${pendingToday.length} agendamento${pendingToday.length > 1 ? 's' : ''} não confirmado${pendingToday.length > 1 ? 's' : ''} hoje`,
      descricao: 'Confirme com os pacientes para evitar faltas.',
      acao: 'Confirmar agora',
      rota: '/agenda',
    });
  }

  // Leads qualificados aguardando follow-up
  const qualifiedLeads = leads.filter(l => l.status === 'qualificado');
  if (qualifiedLeads.length > 0) {
    alertas.push({
      id: 'qualified-followup',
      tipo: 'aviso',
      titulo: `Follow-up pendente: ${qualifiedLeads.length} lead${qualifiedLeads.length > 1 ? 's' : ''} qualificado${qualifiedLeads.length > 1 ? 's' : ''}`,
      descricao: 'Leads qualificados aguardando próximo passo.',
      acao: 'Enviar follow-up',
      rota: '/leads',
    });
  }

  // Leads contatados
  const contactedLeads = leads.filter(l => l.status === 'contatado');
  if (contactedLeads.length > 0) {
    alertas.push({
      id: 'contacted-leads',
      tipo: 'oportunidade',
      titulo: `${contactedLeads.length} lead${contactedLeads.length > 1 ? 's' : ''} aguardando qualificação`,
      descricao: 'Avance esses leads no pipeline para aumentar conversão.',
      acao: 'Qualificar leads',
      rota: '/leads',
    });
  }

  }

  if (isLoading) {
    return (
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-revenue-at-risk to-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ações Críticas</h2>
            <p className="text-sm text-muted-foreground">
              {alertas.length === 0 ? 'Tudo em dia!' : 'Atenção necessária'}
            </p>
          </div>
        </div>
        {alertas.filter(a => a.tipo === 'critico').length > 0 && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-revenue-lost-bg text-revenue-lost">
            {alertas.filter(a => a.tipo === 'critico').length} urgentes
          </span>
        )}
      </div>

      <div className="space-y-3">
        {alertas.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma ação pendente. Bom trabalho! 🎉</p>
          </div>
        ) : (
          alertas.map((alerta, index) => (
            <AlertaCard key={alerta.id} alerta={alerta} index={index} onNavigate={() => navigate(alerta.rota)} />
          ))
        )}
      </div>
    </div>
  );
};

const AlertaCard = ({ alerta, index, onNavigate }: { alerta: Alerta; index: number; onNavigate: () => void }) => {
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
      className={cn(classes[alerta.tipo], "animate-slide-in-right")}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg[alerta.tipo])}>
          {icons[alerta.tipo]}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{alerta.titulo}</h3>
          <p className="text-sm text-muted-foreground mt-1">{alerta.descricao}</p>

          <button
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {alerta.acao}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
