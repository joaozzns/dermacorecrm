import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MetricaReceita } from "./MetricaReceita";
import { AlertasAcao } from "./AlertasAcao";
import { PipelineLeads } from "./PipelineLeads";
import { AgendaHoje } from "./AgendaHoje";
import { InsightsIA } from "./InsightsIA";
import { PlanUsageCard } from "./PlanUsageCard";
import { TrialBanner } from "./TrialBanner";
import { Bell, Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Mock notifications (will be replaced with real system later)
const mockNotifications = [
  { id: 1, title: "Bem-vindo ao DermaCore!", description: "Configure sua clínica para começar", time: "agora", read: false },
];

export const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { quotes, isLoading: quotesLoading } = useQuotes();
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

  // Compute revenue metrics from quotes
  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const sentQuotes = quotes.filter(q => q.status === 'sent');
  const draftQuotes = quotes.filter(q => q.status === 'draft');
  const rejectedQuotes = quotes.filter(q => q.status === 'rejected');

  const confirmada = approvedQuotes.reduce((sum, q) => sum + Number(q.total), 0);
  const emRisco = sentQuotes.reduce((sum, q) => sum + Number(q.total), 0);
  const parada = draftQuotes.reduce((sum, q) => sum + Number(q.total), 0);
  const recuperavel = rejectedQuotes.reduce((sum, q) => sum + Number(q.total), 0);
  const total = confirmada + emRisco + parada + recuperavel;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {greeting}, {profile?.full_name?.split(' ')[0] || 'Usuário'} 👋
            </h1>
            <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - hidden on mobile */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
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
                      Marcar como lidas
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[200px]">
                  <div className="divide-y divide-border">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <p className="font-medium text-sm">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Quick Action */}
            <button
              onClick={() => navigate("/leads")}
              className="btn-premium flex items-center gap-2 text-white text-sm py-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline">Novo Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 md:p-8 space-y-6">
        <TrialBanner />

        {/* Métrica Central */}
        {quotesLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <MetricaReceita
            total={total || 0}
            confirmada={confirmada}
            emRisco={emRisco}
            parada={parada}
            recuperavel={recuperavel}
            variacao={0}
          />
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <PlanUsageCard />
            <AlertasAcao />
          </div>

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
