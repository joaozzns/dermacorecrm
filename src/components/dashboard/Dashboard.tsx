import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MetricaReceita } from "./MetricaReceita";
import { AlertasAcao } from "./AlertasAcao";
import { PipelineLeads } from "./PipelineLeads";
import { AgendaHoje } from "./AgendaHoje";
import { InsightsIA } from "./InsightsIA";
import { PlanUsageCard } from "./PlanUsageCard";
import { TrialBanner } from "./TrialBanner";
import { Bell, Search, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock notifications
const mockNotifications = [
  { id: 1, title: "Novo lead recebido", description: "Ana Carolina enviou uma mensagem", time: "2 min", read: false },
  { id: 2, title: "Agendamento confirmado", description: "Maria Fernanda confirmou para amanhã", time: "15 min", read: false },
  { id: 3, title: "Pagamento recebido", description: "R$ 1.800,00 - Botox", time: "1h", read: true },
  { id: 4, title: "Lembrete de follow-up", description: "3 leads aguardando contato", time: "2h", read: true },
];

export const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? "Bom dia" : currentDate.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const formattedDate = currentDate.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    // Navigate based on notification type
    if (notification.title.includes("lead")) {
      navigate("/leads");
    } else if (notification.title.includes("Agendamento")) {
      navigate("/agenda");
    } else if (notification.title.includes("Pagamento")) {
      navigate("/financeiro");
    } else if (notification.title.includes("follow-up")) {
      navigate("/followup");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {profile?.full_name?.split(' ')[0] || 'Usuário'} 👋
            </h1>
            <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar paciente, lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                maxLength={100}
              />
            </form>
            
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Notificações"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-revenue-at-risk" aria-hidden="true" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-border">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                            !notification.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notification.read && (
                              <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <div className={!notification.read ? '' : 'ml-5'}>
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhuma notificação
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
            
            {/* Quick Action */}
            <button 
              onClick={() => navigate("/leads")}
              className="btn-premium flex items-center gap-2 text-white text-sm py-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Novo Lead
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 space-y-6">
        {/* Trial Banner */}
        <TrialBanner />

        {/* Métrica Central */}
        <MetricaReceita
          total={185000}
          confirmada={98500}
          emRisco={28000}
          parada={32500}
          recuperavel={26000}
          variacao={12.5}
        />

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Alertas + Plano */}
          <div className="col-span-1 space-y-6">
            <PlanUsageCard />
            <AlertasAcao />
          </div>

          {/* Coluna 2-3: Pipeline e Agenda */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <PipelineLeads />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AgendaHoje />
              <InsightsIA />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
