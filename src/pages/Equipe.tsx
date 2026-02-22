import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCog,
  Users,
  Calendar,
  Target,
  Plus,
  Search,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  Award,
  ChevronRight,
  Edit,
  MoreVertical,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Profissionais
const profissionais = [
  {
    id: 1,
    nome: "Dra. Renata Oliveira",
    cargo: "Dermatologista",
    especialidade: "Harmonização Facial",
    avatar: "",
    telefone: "(11) 99999-1111",
    email: "renata@clinicapro.com",
    status: "ativo",
    comissao: 40,
    faturamento: 45000,
    procedimentos: 48,
    avaliacao: 4.9,
    metaMensal: 50000,
    horarios: ["08:00-12:00", "14:00-18:00"],
    diasTrabalho: ["Seg", "Ter", "Qua", "Qui", "Sex"]
  },
  {
    id: 2,
    nome: "Dr. Carlos Mendes",
    cargo: "Cirurgião Plástico",
    especialidade: "Procedimentos Invasivos",
    avatar: "",
    telefone: "(11) 99999-2222",
    email: "carlos@clinicapro.com",
    status: "ativo",
    comissao: 35,
    faturamento: 38000,
    procedimentos: 35,
    avaliacao: 4.8,
    metaMensal: 45000,
    horarios: ["09:00-13:00", "15:00-19:00"],
    diasTrabalho: ["Seg", "Ter", "Qua", "Qui"]
  },
  {
    id: 3,
    nome: "Dra. Marina Santos",
    cargo: "Biomédica",
    especialidade: "Bioestimuladores",
    avatar: "",
    telefone: "(11) 99999-3333",
    email: "marina@clinicapro.com",
    status: "ativo",
    comissao: 40,
    faturamento: 32000,
    procedimentos: 42,
    avaliacao: 4.7,
    metaMensal: 40000,
    horarios: ["08:00-12:00", "14:00-18:00"],
    diasTrabalho: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  },
  {
    id: 4,
    nome: "Ana Paula Costa",
    cargo: "Consultora Comercial",
    especialidade: "Vendas e Relacionamento",
    avatar: "",
    telefone: "(11) 99999-4444",
    email: "ana@clinicapro.com",
    status: "ativo",
    comissao: 10,
    faturamento: 28000,
    procedimentos: 0,
    avaliacao: 4.9,
    metaMensal: 35000,
    horarios: ["09:00-18:00"],
    diasTrabalho: ["Seg", "Ter", "Qua", "Qui", "Sex"]
  },
];

// Escalas da semana
const escalaSemana = [
  { dia: "Segunda", data: "13/01", profissionais: ["Dra. Renata", "Dr. Carlos", "Dra. Marina", "Ana Paula"] },
  { dia: "Terça", data: "14/01", profissionais: ["Dra. Renata", "Dr. Carlos", "Dra. Marina", "Ana Paula"] },
  { dia: "Quarta", data: "15/01", profissionais: ["Dra. Renata", "Dr. Carlos", "Dra. Marina", "Ana Paula"] },
  { dia: "Quinta", data: "16/01", profissionais: ["Dra. Renata", "Dr. Carlos", "Dra. Marina", "Ana Paula"] },
  { dia: "Sexta", data: "17/01", profissionais: ["Dra. Renata", "Dra. Marina", "Ana Paula"] },
  { dia: "Sábado", data: "18/01", profissionais: ["Dra. Marina"] },
];

// Metas individuais
const metasIndividuais = [
  { profissional: "Dra. Renata", tipo: "Faturamento", meta: 50000, atual: 45000, unidade: "R$" },
  { profissional: "Dra. Renata", tipo: "Procedimentos", meta: 50, atual: 48, unidade: "" },
  { profissional: "Dr. Carlos", tipo: "Faturamento", meta: 45000, atual: 38000, unidade: "R$" },
  { profissional: "Dr. Carlos", tipo: "Procedimentos", meta: 40, atual: 35, unidade: "" },
  { profissional: "Dra. Marina", tipo: "Faturamento", meta: 40000, atual: 32000, unidade: "R$" },
  { profissional: "Ana Paula", tipo: "Conversão Leads", meta: 40, atual: 35, unidade: "%" },
  { profissional: "Ana Paula", tipo: "Agendamentos", meta: 60, atual: 52, unidade: "" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

interface ProfissionalCardProps {
  profissional: typeof profissionais[0];
}

const ProfissionalCard = ({ profissional }: ProfissionalCardProps) => {
  const progressoMeta = (profissional.faturamento / profissional.metaMensal) * 100;

  return (
    <Card className="glass-card hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={profissional.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white font-semibold">
                {profissional.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{profissional.nome}</h3>
              <p className="text-sm text-muted-foreground">{profissional.cargo}</p>
              <Badge variant="outline" className="mt-1 text-xs">{profissional.especialidade}</Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert(`Editando: ${profissional.nome}`)}><Edit className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/agenda"}><Calendar className="w-4 h-4 mr-2" /> Ver Agenda</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Definindo metas para: ${profissional.nome}`)}><Target className="w-4 h-4 mr-2" /> Definir Metas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">{profissional.procedimentos}</p>
            <p className="text-xs text-muted-foreground">Procedimentos</p>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-primary">{formatCurrency(profissional.faturamento)}</p>
            <p className="text-xs text-muted-foreground">Faturamento</p>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <p className="text-lg font-bold text-foreground">{profissional.avaliacao}</p>
            </div>
            <p className="text-xs text-muted-foreground">Avaliação</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meta mensal</span>
            <span className="font-medium text-foreground">{Math.round(progressoMeta)}%</span>
          </div>
          <Progress value={progressoMeta} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {formatCurrency(profissional.faturamento)} de {formatCurrency(profissional.metaMensal)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{profissional.horarios.join(" / ")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Equipe() {
  const [activeSection, setActiveSection] = useState("equipe");
  const [searchTerm, setSearchTerm] = useState("");

  const totalProfissionais = profissionais.length;
  const faturamentoTotal = profissionais.reduce((acc, p) => acc + p.faturamento, 0);
  const procedimentosTotal = profissionais.reduce((acc, p) => acc + p.procedimentos, 0);

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Equipe</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Gestão de profissionais e escalas</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => alert("Funcionalidade de novo profissional em desenvolvimento!")}>
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Novo Profissional</span>
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalProfissionais}</p>
                  <p className="text-sm text-muted-foreground">Profissionais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(faturamentoTotal)}</p>
                  <p className="text-sm text-muted-foreground">Faturamento Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{procedimentosTotal}</p>
                  <p className="text-sm text-muted-foreground">Procedimentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.8</p>
                  <p className="text-sm text-muted-foreground">Avaliação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profissionais" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
            <TabsTrigger value="escalas">Escalas</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
          </TabsList>

          {/* Tab Profissionais */}
          <TabsContent value="profissionais">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar profissional..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {profissionais.map((prof) => (
                <ProfissionalCard key={prof.id} profissional={prof} />
              ))}
            </div>
          </TabsContent>

          {/* Tab Escalas */}
          <TabsContent value="escalas">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Escala da Semana
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => alert("Editor de escala em desenvolvimento!")}>
                    <Edit className="w-4 h-4" />
                    Editar Escala
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4">
                  {escalaSemana.map((dia, idx) => (
                    <div key={idx} className={`p-4 rounded-xl ${idx === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
                      <div className="text-center mb-3">
                        <p className="font-semibold text-foreground">{dia.dia}</p>
                        <p className="text-sm text-muted-foreground">{dia.data}</p>
                      </div>
                      <div className="space-y-2">
                        {dia.profissionais.map((prof, profIdx) => (
                          <div key={profIdx} className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white text-xs font-semibold">
                              {prof.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-xs text-foreground truncate">{prof}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Metas */}
          <TabsContent value="metas" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Metas Individuais - Janeiro 2025
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => alert("Definição de metas em desenvolvimento!")}>
                    <Plus className="w-4 h-4" />
                    Definir Metas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profissionais.map((prof) => {
                    const metasProf = metasIndividuais.filter(m => m.profissional === prof.nome.split(" ")[0] + " " + prof.nome.split(" ")[1]);
                    if (metasProf.length === 0) return null;
                    
                    return (
                      <div key={prof.id} className="p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white text-sm font-semibold">
                              {prof.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{prof.nome}</p>
                            <p className="text-sm text-muted-foreground">{prof.cargo}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {metasProf.map((meta, idx) => {
                            const progresso = (meta.atual / meta.meta) * 100;
                            const atingida = progresso >= 100;
                            return (
                              <div key={idx} className="p-3 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-foreground">{meta.tipo}</span>
                                  {atingida ? (
                                    <Badge className="bg-revenue-confirmed text-white">
                                      <CheckCircle2 className="w-3 h-3 mr-1" /> Meta Atingida
                                    </Badge>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">{Math.round(progresso)}%</span>
                                  )}
                                </div>
                                <Progress value={Math.min(progresso, 100)} className="h-2 mb-2" />
                                <p className="text-xs text-muted-foreground">
                                  {meta.unidade === "R$" ? formatCurrency(meta.atual) : `${meta.atual}${meta.unidade}`} de{" "}
                                  {meta.unidade === "R$" ? formatCurrency(meta.meta) : `${meta.meta}${meta.unidade}`}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
