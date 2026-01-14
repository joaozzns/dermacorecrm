import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Filter,
  MessageCircle,
  Phone,
  MoreHorizontal,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  cor: string;
  avatar: string;
}

interface Agendamento {
  id: string;
  horario: string;
  duracao: number; // em minutos
  paciente: string;
  telefone: string;
  procedimento: string;
  profissionalId: string;
  valor: number;
  status: 'confirmado' | 'pendente' | 'risco' | 'cancelado' | 'realizado';
  historicoFaltas?: number;
  observacao?: string;
}

const profissionais: Profissional[] = [
  { id: "1", nome: "Dra. Renata Silva", especialidade: "Harmonização Facial", cor: "bg-teal-500", avatar: "RS" },
  { id: "2", nome: "Dra. Amanda Costa", especialidade: "Dermatologia", cor: "bg-purple-500", avatar: "AC" },
  { id: "3", nome: "Dr. Ricardo Mendes", especialidade: "Cirurgia Plástica", cor: "bg-blue-500", avatar: "RM" },
];

const agendamentos: Agendamento[] = [
  { id: "1", horario: "08:00", duracao: 60, paciente: "Maria Fernanda", telefone: "(11) 99999-1234", procedimento: "Botox Glabela", profissionalId: "1", valor: 1800, status: "confirmado" },
  { id: "2", horario: "09:00", duracao: 90, paciente: "Carolina Alves", telefone: "(11) 98888-5678", procedimento: "Preenchimento Labial", profissionalId: "1", valor: 2500, status: "confirmado" },
  { id: "3", horario: "08:30", duracao: 45, paciente: "Juliana Costa", telefone: "(11) 97777-9012", procedimento: "Limpeza de Pele", profissionalId: "2", valor: 450, status: "pendente" },
  { id: "4", horario: "10:30", duracao: 30, paciente: "Avaliação Harmonização", telefone: "(11) 96666-3456", procedimento: "Avaliação", profissionalId: "1", valor: 0, status: "pendente" },
  { id: "5", horario: "11:00", duracao: 120, paciente: "Patrícia Santos", telefone: "(11) 95555-7890", procedimento: "Lipo Enzimática", profissionalId: "2", valor: 4500, status: "risco", historicoFaltas: 2 },
  { id: "6", horario: "09:00", duracao: 180, paciente: "Fernanda Lima", telefone: "(11) 94444-1234", procedimento: "Rinoplastia", profissionalId: "3", valor: 15000, status: "confirmado" },
  { id: "7", horario: "14:00", duracao: 60, paciente: "Ana Beatriz", telefone: "(11) 93333-5678", procedimento: "Bioestimulador", profissionalId: "1", valor: 3200, status: "confirmado" },
  { id: "8", horario: "14:30", duracao: 45, paciente: "Luciana Rocha", telefone: "(11) 92222-9012", procedimento: "Peeling Químico", profissionalId: "2", valor: 800, status: "risco", historicoFaltas: 1 },
  { id: "9", horario: "15:00", duracao: 60, paciente: "Beatriz Mendes", telefone: "(11) 91111-3456", procedimento: "Skinbooster", profissionalId: "1", valor: 1500, status: "pendente" },
  { id: "10", horario: "14:00", duracao: 240, paciente: "Claudia Ferreira", telefone: "(11) 90000-7890", procedimento: "Abdominoplastia", profissionalId: "3", valor: 25000, status: "confirmado" },
];

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

const formatCurrency = (value: number) => {
  if (value === 0) return "Avaliação";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

const getSlotIndex = (horario: string) => horarios.indexOf(horario);
const getSlotSpan = (duracao: number) => Math.ceil(duracao / 30);

const Agenda = () => {
  const [activeSection, setActiveSection] = useState("agenda");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');

  const valorConfirmado = agendamentos.filter(a => a.status === 'confirmado').reduce((acc, a) => acc + a.valor, 0);
  const valorEmRisco = agendamentos.filter(a => a.status === 'risco').reduce((acc, a) => acc + a.valor, 0);
  const valorPendente = agendamentos.filter(a => a.status === 'pendente').reduce((acc, a) => acc + a.valor, 0);
  const totalAgendamentos = agendamentos.length;
  const ocupacao = Math.round((totalAgendamentos / (horarios.length * profissionais.length)) * 100);

  const getAgendamentosPorProfissional = (profissionalId: string) => {
    return agendamentos.filter(a => a.profissionalId === profissionalId);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
                <p className="text-sm text-muted-foreground">Gerencie os agendamentos da clínica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              
              <button className="btn-premium flex items-center gap-2 text-white text-sm py-2">
                <Plus className="w-4 h-4" />
                Novo Agendamento
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Receita Confirmada</span>
                <CheckCircle className="w-5 h-5 text-revenue-confirmed" />
              </div>
              <div className="text-2xl font-bold text-revenue-confirmed">{formatCurrency(valorConfirmado)}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Em Risco (No-show)</span>
                <AlertTriangle className="w-5 h-5 text-revenue-at-risk" />
              </div>
              <div className="text-2xl font-bold text-revenue-at-risk">{formatCurrency(valorEmRisco)}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Aguardando Confirmação</span>
                <Clock className="w-5 h-5 text-revenue-paused" />
              </div>
              <div className="text-2xl font-bold text-revenue-paused">{formatCurrency(valorPendente)}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{ocupacao}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${ocupacao}%` }} />
              </div>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="px-4 py-2 bg-muted rounded-lg font-medium">
                  Terça-feira, 14 de Janeiro de 2025
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">Hoje</Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(v: 'dia' | 'semana') => setViewMode(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Dia</SelectItem>
                  <SelectItem value="semana">Semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card-premium overflow-hidden">
            <div className="grid" style={{ gridTemplateColumns: `80px repeat(${profissionais.length}, 1fr)` }}>
              {/* Header Row */}
              <div className="p-4 border-b border-r border-border bg-muted/30" />
              {profissionais.map((prof) => (
                <div key={prof.id} className="p-4 border-b border-r border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm", prof.cor)}>
                      {prof.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{prof.nome}</div>
                      <div className="text-xs text-muted-foreground">{prof.especialidade}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Time Slots */}
              {horarios.map((horario, rowIndex) => (
                <>
                  <div key={`time-${horario}`} className="p-2 border-r border-b border-border text-sm text-muted-foreground text-center bg-muted/10">
                    {horario}
                  </div>
                  {profissionais.map((prof) => {
                    const agendamento = getAgendamentosPorProfissional(prof.id).find(a => a.horario === horario);
                    
                    if (agendamento) {
                      return (
                        <AgendamentoSlot key={`slot-${prof.id}-${horario}`} agendamento={agendamento} profissional={prof} />
                      );
                    }
                    
                    // Check if this slot is occupied by a previous appointment
                    const isOccupied = getAgendamentosPorProfissional(prof.id).some(a => {
                      const startIndex = getSlotIndex(a.horario);
                      const endIndex = startIndex + getSlotSpan(a.duracao);
                      return rowIndex > startIndex && rowIndex < endIndex;
                    });
                    
                    if (isOccupied) {
                      return null;
                    }
                    
                    return (
                      <div 
                        key={`empty-${prof.id}-${horario}`} 
                        className="p-2 border-r border-b border-border min-h-[60px] hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface AgendamentoSlotProps {
  agendamento: Agendamento;
  profissional: Profissional;
}

const AgendamentoSlot = ({ agendamento, profissional }: AgendamentoSlotProps) => {
  const slotSpan = getSlotSpan(agendamento.duracao);
  
  const statusConfig = {
    confirmado: {
      bg: "bg-revenue-confirmed-bg border-revenue-confirmed",
      icon: <CheckCircle className="w-4 h-4 text-revenue-confirmed" />,
      text: "text-revenue-confirmed"
    },
    pendente: {
      bg: "bg-revenue-paused-bg border-revenue-paused",
      icon: <Clock className="w-4 h-4 text-revenue-paused" />,
      text: "text-revenue-paused"
    },
    risco: {
      bg: "bg-revenue-at-risk-bg border-revenue-at-risk",
      icon: <AlertTriangle className="w-4 h-4 text-revenue-at-risk" />,
      text: "text-revenue-at-risk"
    },
    cancelado: {
      bg: "bg-revenue-lost-bg border-revenue-lost",
      icon: <XCircle className="w-4 h-4 text-revenue-lost" />,
      text: "text-revenue-lost"
    },
    realizado: {
      bg: "bg-muted border-muted-foreground",
      icon: <CheckCircle className="w-4 h-4 text-muted-foreground" />,
      text: "text-muted-foreground"
    }
  };

  const config = statusConfig[agendamento.status];

  return (
    <div 
      className={cn(
        "p-3 border-r border-b border-border cursor-pointer group transition-all hover:shadow-md",
        config.bg,
        "border-l-4"
      )}
      style={{ gridRow: `span ${slotSpan}` }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="font-medium text-foreground text-sm">{agendamento.paciente}</span>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">{agendamento.procedimento}</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-sm", config.text)}>
            {formatCurrency(agendamento.valor)}
          </span>
          {agendamento.historicoFaltas && agendamento.historicoFaltas > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-revenue-at-risk text-white">
              {agendamento.historicoFaltas} falta{agendamento.historicoFaltas > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-white/50 rounded-lg transition-colors" title="WhatsApp">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </button>
          <button className="p-1.5 hover:bg-white/50 rounded-lg transition-colors" title="Ligar">
            <Phone className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-1.5 hover:bg-white/50 rounded-lg transition-colors" title="Confirmar">
            <Bell className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
