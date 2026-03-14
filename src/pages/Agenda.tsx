import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, User, AlertTriangle, 
  CheckCircle, XCircle, Plus, Filter, MessageCircle, Phone, 
  MoreHorizontal, Bell, Search, X, Loader2, CalendarPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppointments, type AppointmentStatus } from "@/hooks/useAppointments";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { usePatients } from "@/hooks/usePatients";

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

const formatCurrency = (value: number) => {
  if (value === 0) return "Avaliação";
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const getSlotSpan = (minutes: number) => Math.ceil(minutes / 30);

const statusMap: Record<string, { label: string; color: string }> = {
  agendado: { label: "Pendente", color: "revenue-paused" },
  confirmado: { label: "Confirmado", color: "revenue-confirmed" },
  em_atendimento: { label: "Em Atendimento", color: "primary" },
  concluido: { label: "Concluído", color: "muted-foreground" },
  cancelado: { label: "Cancelado", color: "revenue-lost" },
  faltou: { label: "Faltou", color: "revenue-at-risk" },
};

const profColors = [
  "bg-teal-500", "bg-purple-500", "bg-blue-500", "bg-rose-500", 
  "bg-amber-500", "bg-emerald-500", "bg-indigo-500", "bg-cyan-500"
];

const Agenda = () => {
  const [activeSection, setActiveSection] = useState("agenda");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newAppt, setNewAppt] = useState({
    patient_id: "",
    professional_id: "",
    title: "",
    horario: "09:00",
    duracao: "60",
  });

  const { appointments, isLoading, createAppointment, updateAppointment } = useAppointments(selectedDate);
  const { teamMembers } = useTeamMembers();
  const { patients } = usePatients();

  const activeMembers = teamMembers.filter(m => m.is_active && m.profiles);

  const filteredAppointments = appointments.filter(a => {
    if (selectedProfissional !== "todos" && a.professional_id !== selectedProfissional) return false;
    if (selectedStatus !== "todos" && a.status !== selectedStatus) return false;
    if (searchQuery) {
      const patientName = a.patients?.full_name || "";
      if (!patientName.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const getTimeStr = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const getDurationMinutes = (start: string, end: string) => {
    return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  };

  const getApptForSlot = (profId: string, horario: string) => {
    return filteredAppointments.find(a => a.professional_id === profId && getTimeStr(a.start_time) === horario);
  };

  const isSlotOccupied = (profId: string, rowIndex: number) => {
    return filteredAppointments.some(a => {
      if (a.professional_id !== profId) return false;
      const startIdx = horarios.indexOf(getTimeStr(a.start_time));
      const dur = getDurationMinutes(a.start_time, a.end_time);
      const endIdx = startIdx + getSlotSpan(dur);
      return rowIndex > startIdx && rowIndex < endIdx;
    });
  };

  const totalAppts = filteredAppointments.length;
  const ocupacao = activeMembers.length > 0 
    ? Math.round((totalAppts / (horarios.length * activeMembers.length)) * 100) 
    : 0;

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };
  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };
  const handleToday = () => setSelectedDate(new Date());

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleCreateAppointment = async () => {
    if (!newAppt.patient_id || !newAppt.title) {
      toast.error("Preencha paciente e título");
      return;
    }

    const [h, m] = newAppt.horario.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + parseInt(newAppt.duracao) * 60000);

    try {
      await createAppointment.mutateAsync({
        patient_id: newAppt.patient_id,
        professional_id: newAppt.professional_id || undefined,
        title: newAppt.title,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
      setIsNewAppointmentOpen(false);
      setNewAppt({ patient_id: "", professional_id: "", title: "", horario: "09:00", duracao: "60" });
    } catch {}
  };

  const handleConfirm = async (id: string) => {
    try {
      await updateAppointment.mutateAsync({ id, status: 'confirmado' });
    } catch {}
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const p = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${name}! Este é um contato da clínica.`);
    window.open(`https://wa.me/55${p}?text=${msg}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:+55${phone.replace(/\D/g, '')}`, '_self');
  };

  const handleAddToGoogleCalendar = (appt: typeof appointments[0]) => {
    const start = new Date(appt.start_time);
    const end = new Date(appt.end_time);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const patientName = appt.patients?.full_name || 'Paciente';
    const details = encodeURIComponent(`Paciente: ${patientName}${appt.notes ? `\nNotas: ${appt.notes}` : ''}`);
    const title = encodeURIComponent(`${appt.title} - ${patientName}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}`;
    window.open(url, '_blank');
  };

  // Columns: if we have team members, show them. Otherwise show a single "Geral" column
  const columns = activeMembers.length > 0
    ? activeMembers.map((m, i) => ({
        id: m.profile_id || m.id,
        name: m.profiles?.full_name || 'Profissional',
        specialty: m.specialty || '',
        color: profColors[i % profColors.length],
        initials: (m.profiles?.full_name || 'P').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
      }))
    : [{ id: '__geral__', name: 'Geral', specialty: '', color: 'bg-primary', initials: 'G' }];

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 md:px-8 py-4">
            <div className="flex items-center gap-3 ml-12 md:ml-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-foreground">Agenda</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Gerencie os agendamentos da clínica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
              <div className="relative shrink-0 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 md:w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              
              <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setIsFilterOpen(true)}>
                <Filter className="w-4 h-4" />
                <span className="hidden md:inline">Filtros</span>
                {(selectedProfissional !== "todos" || selectedStatus !== "todos") && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
              
              <button 
                className="btn-premium flex items-center gap-2 text-white text-sm py-2 shrink-0"
                onClick={() => setIsNewAppointmentOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Novo Agendamento</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Confirmados</span>
                <CheckCircle className="w-5 h-5 text-revenue-confirmed" />
              </div>
              <div className="text-2xl font-bold text-revenue-confirmed">
                {filteredAppointments.filter(a => a.status === 'confirmado').length}
              </div>
            </div>
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pendentes</span>
                <Clock className="w-5 h-5 text-revenue-paused" />
              </div>
              <div className="text-2xl font-bold text-revenue-paused">
                {filteredAppointments.filter(a => a.status === 'agendado').length}
              </div>
            </div>
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Cancelados/Faltas</span>
                <XCircle className="w-5 h-5 text-revenue-lost" />
              </div>
              <div className="text-2xl font-bold text-revenue-lost">
                {filteredAppointments.filter(a => a.status === 'cancelado' || a.status === 'faltou').length}
              </div>
            </div>
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{ocupacao}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(ocupacao, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={handlePrevDay}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-4 py-2 bg-muted rounded-lg font-medium capitalize text-sm md:text-base">
                {formatDisplayDate(selectedDate)}
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNextDay}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>Hoje</Button>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="card-premium overflow-hidden overflow-x-auto">
              <div className="grid" style={{ gridTemplateColumns: `80px repeat(${columns.length}, minmax(200px, 1fr))` }}>
                {/* Header */}
                <div className="p-4 border-b border-r border-border bg-muted/30" />
                {columns.map((col) => (
                  <div key={col.id} className="p-4 border-b border-r border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm", col.color)}>
                        {col.initials}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{col.name}</div>
                        {col.specialty && <div className="text-xs text-muted-foreground">{col.specialty}</div>}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slots */}
                {horarios.map((horario, rowIndex) => (
                  <>
                    <div key={`time-${horario}`} className="p-2 border-r border-b border-border text-sm text-muted-foreground text-center bg-muted/10">
                      {horario}
                    </div>
                    {columns.map((col) => {
                      const appt = getApptForSlot(col.id, horario);
                      
                      if (appt) {
                        const dur = getDurationMinutes(appt.start_time, appt.end_time);
                        const span = getSlotSpan(dur);
                        const st = statusMap[appt.status] || statusMap.agendado;
                        
                        return (
                          <div
                            key={`slot-${col.id}-${horario}`}
                            className={cn(
                              "p-3 border-r border-b border-border cursor-pointer group transition-all hover:shadow-md border-l-4",
                              `bg-${st.color}/10 border-l-${st.color}`
                            )}
                            style={{ gridRow: `span ${span}` }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {appt.status === 'confirmado' && <CheckCircle className="w-4 h-4 text-revenue-confirmed" />}
                                {appt.status === 'agendado' && <Clock className="w-4 h-4 text-revenue-paused" />}
                                {appt.status === 'cancelado' && <XCircle className="w-4 h-4 text-revenue-lost" />}
                                {appt.status === 'faltou' && <AlertTriangle className="w-4 h-4 text-revenue-at-risk" />}
                                {appt.status === 'concluido' && <CheckCircle className="w-4 h-4 text-muted-foreground" />}
                                {appt.status === 'em_atendimento' && <Clock className="w-4 h-4 text-primary" />}
                                <span className="font-medium text-foreground text-sm">
                                  {appt.patients?.full_name || 'Paciente'}
                                </span>
                              </div>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">{appt.title}</div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {appt.patients?.phone && (
                                <>
                                  <button className="p-1.5 hover:bg-white/50 rounded-lg" title="WhatsApp"
                                    onClick={(e) => { e.stopPropagation(); handleWhatsApp(appt.patients!.phone, appt.patients!.full_name); }}>
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                  </button>
                                  <button className="p-1.5 hover:bg-white/50 rounded-lg" title="Ligar"
                                    onClick={(e) => { e.stopPropagation(); handleCall(appt.patients!.phone); }}>
                                    <Phone className="w-4 h-4 text-blue-600" />
                                  </button>
                                </>
                              )}
                              {appt.status === 'agendado' && (
                                <button className="p-1.5 hover:bg-white/50 rounded-lg" title="Confirmar"
                                  onClick={(e) => { e.stopPropagation(); handleConfirm(appt.id); }}>
                                  <Bell className="w-4 h-4 text-amber-600" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      if (isSlotOccupied(col.id, rowIndex)) return null;

                      return (
                        <div
                          key={`empty-${col.id}-${horario}`}
                          className="p-2 border-r border-b border-border min-h-[60px] hover:bg-muted/30 transition-colors cursor-pointer group"
                          onClick={() => {
                            setNewAppt({ ...newAppt, professional_id: col.id === '__geral__' ? '' : col.id, horario });
                            setIsNewAppointmentOpen(true);
                          }}
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
          )}
        </main>
      </div>

      {/* Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Filtre os agendamentos por profissional ou status</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {activeMembers.map(m => (
                    <SelectItem key={m.profile_id || m.id} value={m.profile_id || m.id}>
                      {m.profiles?.full_name || 'Profissional'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="agendado">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="faltou">Faltou</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setSelectedProfissional("todos"); setSelectedStatus("todos"); }}>
                Limpar Filtros
              </Button>
              <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>Aplicar</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Preencha os dados para criar um novo agendamento</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <Select value={newAppt.patient_id} onValueChange={(v) => setNewAppt({ ...newAppt, patient_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título / Procedimento *</Label>
              <Input
                id="title"
                value={newAppt.title}
                onChange={(e) => setNewAppt({ ...newAppt, title: e.target.value })}
                placeholder="Ex: Botox Glabela"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Profissional</Label>
                <Select value={newAppt.professional_id} onValueChange={(v) => setNewAppt({ ...newAppt, professional_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {activeMembers.map(m => (
                      <SelectItem key={m.profile_id || m.id} value={m.profile_id || m.id}>
                        {m.profiles?.full_name || 'Profissional'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Select value={newAppt.horario} onValueChange={(v) => setNewAppt({ ...newAppt, horario: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {horarios.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select value={newAppt.duracao} onValueChange={(v) => setNewAppt({ ...newAppt, duracao: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1h 30min</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateAppointment} disabled={createAppointment.isPending}>
              {createAppointment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Agenda;
