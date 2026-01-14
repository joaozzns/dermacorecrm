import { Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle, DollarSign, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agendamento {
  id: string;
  horario: string;
  paciente: string;
  procedimento: string;
  profissional: string;
  valor: number;
  status: 'confirmado' | 'pendente' | 'risco' | 'cancelado';
  historicoFaltas?: number;
}

const agendamentos: Agendamento[] = [
  { id: "1", horario: "08:00", paciente: "Maria Fernanda", procedimento: "Botox Glabela", profissional: "Dra. Renata", valor: 1800, status: "confirmado" },
  { id: "2", horario: "09:30", paciente: "Carolina Alves", procedimento: "Preenchimento Labial", profissional: "Dra. Renata", valor: 2500, status: "confirmado" },
  { id: "3", horario: "11:00", paciente: "Juliana Costa", procedimento: "Avaliação Harmonização", profissional: "Dra. Renata", valor: 0, status: "pendente" },
  { id: "4", horario: "14:00", paciente: "Patrícia Santos", procedimento: "Lipo Enzimática", profissional: "Dra. Amanda", valor: 4500, status: "risco", historicoFaltas: 2 },
  { id: "5", horario: "15:30", paciente: "Ana Beatriz", procedimento: "Bioestimulador", profissional: "Dra. Renata", valor: 3200, status: "confirmado" },
  { id: "6", horario: "17:00", paciente: "Fernanda Lima", procedimento: "Skinbooster", profissional: "Dra. Amanda", valor: 1500, status: "risco", historicoFaltas: 1 },
];

const formatCurrency = (value: number) => {
  if (value === 0) return "Avaliação";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const AgendaHoje = () => {
  const valorConfirmado = agendamentos.filter(a => a.status === 'confirmado').reduce((acc, a) => acc + a.valor, 0);
  const valorEmRisco = agendamentos.filter(a => a.status === 'risco').reduce((acc, a) => acc + a.valor, 0);
  const ocupacao = (agendamentos.length / 10) * 100; // Assumindo 10 slots disponíveis

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Agenda de Hoje</h2>
            <p className="text-sm text-muted-foreground">{agendamentos.length} agendamentos</p>
          </div>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          Ver agenda completa
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-revenue-confirmed-bg">
          <div className="text-xs font-medium text-muted-foreground mb-1">Confirmado</div>
          <div className="text-lg font-bold text-revenue-confirmed">{formatCurrency(valorConfirmado)}</div>
        </div>
        <div className="p-3 rounded-lg bg-revenue-at-risk-bg">
          <div className="text-xs font-medium text-muted-foreground mb-1">Em Risco</div>
          <div className="text-lg font-bold text-revenue-at-risk">{formatCurrency(valorEmRisco)}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <div className="text-xs font-medium text-muted-foreground mb-1">Ocupação</div>
          <div className="text-lg font-bold text-foreground">{ocupacao.toFixed(0)}%</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {agendamentos.map((agendamento) => (
          <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
        ))}
      </div>
    </div>
  );
};

interface AgendamentoCardProps {
  agendamento: Agendamento;
}

const AgendamentoCard = ({ agendamento }: AgendamentoCardProps) => {
  const statusConfig = {
    confirmado: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-revenue-confirmed",
      bg: "bg-revenue-confirmed-bg",
      border: "border-l-revenue-confirmed"
    },
    pendente: {
      icon: <Clock className="w-4 h-4" />,
      color: "text-revenue-paused",
      bg: "bg-revenue-paused-bg",
      border: "border-l-revenue-paused"
    },
    risco: {
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-revenue-at-risk",
      bg: "bg-revenue-at-risk-bg",
      border: "border-l-revenue-at-risk"
    },
    cancelado: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-revenue-lost",
      bg: "bg-revenue-lost-bg",
      border: "border-l-revenue-lost"
    }
  };

  const config = statusConfig[agendamento.status];

  return (
    <div className={cn(
      "p-3 rounded-r-lg border-l-4 transition-all hover:shadow-md cursor-pointer",
      config.bg,
      config.border
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[50px]">
            <div className="text-sm font-bold text-foreground">{agendamento.horario}</div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{agendamento.paciente}</span>
              {agendamento.historicoFaltas && agendamento.historicoFaltas > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-revenue-at-risk text-white">
                  {agendamento.historicoFaltas} falta{agendamento.historicoFaltas > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{agendamento.procedimento}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">{formatCurrency(agendamento.valor)}</div>
            <div className="text-xs text-muted-foreground">{agendamento.profissional}</div>
          </div>
          <div className={cn("p-2 rounded-lg", config.bg, config.color)}>
            {config.icon}
          </div>
        </div>
      </div>
    </div>
  );
};
