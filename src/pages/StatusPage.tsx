import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

const services = [
  { name: "Plataforma Web", status: "operational", uptime: "99.98%" },
  { name: "API", status: "operational", uptime: "99.95%" },
  { name: "Banco de Dados", status: "operational", uptime: "99.99%" },
  { name: "Autenticação", status: "operational", uptime: "99.97%" },
  { name: "WhatsApp Integration", status: "operational", uptime: "99.90%" },
  { name: "Armazenamento de Arquivos", status: "operational", uptime: "99.96%" },
  { name: "Automações", status: "operational", uptime: "99.93%" },
  { name: "Notificações", status: "operational", uptime: "99.94%" },
];

const incidents = [
  { date: "2026-03-28", title: "Manutenção programada no banco de dados", status: "resolved", description: "Atualização do banco concluída com sucesso. Tempo de inatividade: 3 minutos." },
  { date: "2026-03-15", title: "Lentidão temporária na API", status: "resolved", description: "Identificado e corrigido gargalo de performance. Sem perda de dados." },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "operational") return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  if (status === "degraded") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  return <Clock className="w-5 h-5 text-red-500" />;
};

export default function StatusPage() {
  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            allOperational ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
          }`}>
            {allOperational ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {allOperational ? "Todos os sistemas operacionais" : "Alguns sistemas com degradação"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Status do Sistema</h1>
          <p className="text-lg text-muted-foreground">Monitoramento em tempo real de todos os serviços</p>
        </div>
      </section>

      {/* Services */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-border overflow-hidden">
            {services.map((service, i) => (
              <div key={i} className={`flex items-center justify-between p-4 ${i < services.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center gap-3">
                  <StatusIcon status={service.status} />
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === "operational" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {service.status === "operational" ? "Operacional" : "Degradado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime chart visual */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Últimos 90 dias</h2>
          <div className="flex gap-0.5">
            {Array.from({ length: 90 }).map((_, i) => (
              <div key={i} className="flex-1 h-8 rounded-sm bg-emerald-500/80 hover:bg-emerald-500 transition-colors" title={`Dia ${90 - i}: Operacional`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>90 dias atrás</span>
            <span>Hoje</span>
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Incidentes Recentes</h2>
          <div className="space-y-4">
            {incidents.map((inc, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{inc.title}</h3>
                  <span className="text-xs text-muted-foreground">{inc.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{inc.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">Resolvido</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
