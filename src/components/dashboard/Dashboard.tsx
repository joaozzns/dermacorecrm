import { MetricaReceita } from "./MetricaReceita";
import { AlertasAcao } from "./AlertasAcao";
import { PipelineLeads } from "./PipelineLeads";
import { AgendaHoje } from "./AgendaHoje";
import { InsightsIA } from "./InsightsIA";
import { PlanUsageCard } from "./PlanUsageCard";
import { TrialBanner } from "./TrialBanner";
import { Bell, Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const { profile } = useAuth();
  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? "Bom dia" : currentDate.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const formattedDate = currentDate.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar paciente, lead..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                maxLength={100}
              />
            </div>
            
            {/* Notifications */}
            <button 
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-revenue-at-risk" aria-hidden="true" />
            </button>
            
            {/* Quick Action */}
            <button className="btn-premium flex items-center gap-2 text-white text-sm py-2">
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
