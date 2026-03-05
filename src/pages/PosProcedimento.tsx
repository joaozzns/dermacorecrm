import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NovaOrientacaoDialog } from "@/components/pos-procedimento/NovaOrientacaoDialog";
import {
  Heart,
  MessageCircle,
  Calendar,
  FileText,
  Star,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Phone,
  Eye,
  Smile,
  Meh,
  Frown,
  Filter,
  TrendingUp,
  Inbox,
} from "lucide-react";

export default function PosProcedimento() {
  const [activeSection, setActiveSection] = useState("pos-procedimento");
  const [searchTerm, setSearchTerm] = useState("");

  // No real data connected yet — show zeros
  const emAcompanhamento = 0;
  const comAtencao = 0;
  const satisfacaoMedia = "0.0";
  const taxaResposta = 0;

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Pós-Procedimento</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Acompanhamento e satisfação de pacientes</p>
          </div>
          <NovaOrientacaoDialog />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{emAcompanhamento}</p>
                  <p className="text-sm text-muted-foreground">Em Acompanhamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{comAtencao}</p>
                  <p className="text-sm text-muted-foreground">Requerem Atenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{satisfacaoMedia}</p>
                  <p className="text-sm text-muted-foreground">Satisfação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{taxaResposta}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pacientes" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            <TabsTrigger value="orientacoes">Orientações</TabsTrigger>
            <TabsTrigger value="satisfacao">Satisfação</TabsTrigger>
          </TabsList>

          {/* Tab Pacientes */}
          <TabsContent value="pacientes">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar paciente..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>

            <EmptyState
              icon={<Heart className="w-12 h-12 text-muted-foreground/40" />}
              title="Nenhum paciente em acompanhamento"
              description="Quando você tiver pacientes em pós-procedimento, eles aparecerão aqui para acompanhamento automatizado."
            />
          </TabsContent>

          {/* Tab Orientações */}
          <TabsContent value="orientacoes" className="space-y-6">
            <EmptyState
              icon={<FileText className="w-12 h-12 text-muted-foreground/40" />}
              title="Nenhuma orientação cadastrada"
              description="Crie orientações pós-procedimento para enviar automaticamente aos seus pacientes usando o botão 'Nova Orientação'."
            />
          </TabsContent>

          {/* Tab Satisfação */}
          <TabsContent value="satisfacao">
            <EmptyState
              icon={<Star className="w-12 h-12 text-muted-foreground/40" />}
              title="Nenhuma pesquisa de satisfação"
              description="Pesquisas de satisfação aparecerão aqui quando seus pacientes responderem após os procedimentos."
            />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
