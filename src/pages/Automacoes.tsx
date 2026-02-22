import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Rocket,
  Clock,
  MessageCircle
} from "lucide-react";

export default function Automacoes() {
  const [activeSection, setActiveSection] = useState("automacoes");

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Automações</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Fluxos automáticos de comunicação</p>
          </div>
        </div>

        {/* Empty State */}
        <Card className="glass-card">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Automações em breve</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Estamos preparando fluxos automáticos de comunicação para sua clínica. 
              Em breve você poderá automatizar mensagens de boas-vindas, lembretes de agendamento, 
              follow-ups e muito mais.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Boas-vindas</h4>
                <p className="text-xs text-muted-foreground">Mensagem automática para novos leads</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Lembretes</h4>
                <p className="text-xs text-muted-foreground">Confirmação automática de agendamentos</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-3">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Follow-up</h4>
                <p className="text-xs text-muted-foreground">Reengajamento de leads inativos</p>
              </div>
            </div>

            <Button variant="outline" className="mt-8 gap-2" onClick={() => window.open('mailto:contato@dermacore.com?subject=Interesse em Automações', '_blank')}>
              <Zap className="w-4 h-4" />
              Quero ser avisado quando estiver disponível
            </Button>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
}