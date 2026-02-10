import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const formatCurrency = (value: number) => {
  if (value === 0) return "Avaliação";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const AgendaHoje = () => {
  const today = new Date();
  const { appointments, isLoading } = useAppointments(today);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const confirmados = appointments.filter(a => a.status === 'confirmado');
  const pendentes = appointments.filter(a => a.status === 'agendado');
  const concluidos = appointments.filter(a => a.status === 'concluido');

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Agenda de Hoje</h2>
            <p className="text-sm text-muted-foreground">{appointments.length} agendamentos</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/agenda")}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Ver agenda completa
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-revenue-confirmed-bg">
          <div className="text-xs font-medium text-muted-foreground mb-1">Confirmados</div>
          <div className="text-lg font-bold text-revenue-confirmed">{confirmados.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-revenue-at-risk-bg">
          <div className="text-xs font-medium text-muted-foreground mb-1">Pendentes</div>
          <div className="text-lg font-bold text-revenue-at-risk">{pendentes.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <div className="text-xs font-medium text-muted-foreground mb-1">Concluídos</div>
          <div className="text-lg font-bold text-foreground">{concluidos.length}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {appointments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum agendamento para hoje</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AgendamentoCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>
    </div>
  );
};

const statusConfig = {
  agendado: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-revenue-paused",
    bg: "bg-revenue-paused-bg",
    border: "border-l-revenue-paused"
  },
  confirmado: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-revenue-confirmed",
    bg: "bg-revenue-confirmed-bg",
    border: "border-l-revenue-confirmed"
  },
  em_atendimento: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-l-primary"
  },
  concluido: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-revenue-confirmed",
    bg: "bg-revenue-confirmed-bg",
    border: "border-l-revenue-confirmed"
  },
  cancelado: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-revenue-lost",
    bg: "bg-revenue-lost-bg",
    border: "border-l-revenue-lost"
  },
  faltou: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-revenue-at-risk",
    bg: "bg-revenue-at-risk-bg",
    border: "border-l-revenue-at-risk"
  }
};

const AgendamentoCard = ({ appointment }: { appointment: Appointment }) => {
  const config = statusConfig[appointment.status] || statusConfig.agendado;
  const horario = format(new Date(appointment.start_time), 'HH:mm');
  const patientName = appointment.patients?.full_name || 'Paciente';
  const professionalName = appointment.profiles?.full_name || '';

  return (
    <div className={cn(
      "p-3 rounded-r-lg border-l-4 transition-all hover:shadow-md cursor-pointer",
      config.bg,
      config.border
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[50px]">
            <div className="text-sm font-bold text-foreground">{horario}</div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{patientName}</span>
            </div>
            <div className="text-sm text-muted-foreground">{appointment.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {professionalName && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{professionalName}</div>
            </div>
          )}
          <div className={cn("p-2 rounded-lg", config.bg, config.color)}>
            {config.icon}
          </div>
        </div>
      </div>
    </div>
  );
};
