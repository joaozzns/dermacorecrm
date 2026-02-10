import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  MessageCircle,
  Clock,
  Users,
  Target,
  Plus,
  Play,
  Pause,
  Settings,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Heart,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Copy,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Fluxos de automação
const fluxosAutomacao = [
  {
    id: 1,
    nome: "Boas-vindas Novo Lead",
    descricao: "Sequência de mensagens para novos leads do Instagram",
    status: "ativo",
    gatilho: "Novo lead cadastrado",
    etapas: 4,
    enviados: 245,
    taxaResposta: 68,
    conversao: 32,
    canal: "whatsapp"
  },
  {
    id: 2,
    nome: "Recuperação Lead Frio",
    descricao: "Reengajamento de leads sem interação há 7 dias",
    status: "ativo",
    gatilho: "Lead sem resposta > 7 dias",
    etapas: 3,
    enviados: 89,
    taxaResposta: 42,
    conversao: 18,
    canal: "whatsapp"
  },
  {
    id: 3,
    nome: "Confirmação Agendamento",
    descricao: "Lembrete 24h e 2h antes do procedimento",
    status: "ativo",
    gatilho: "Agendamento confirmado",
    etapas: 2,
    enviados: 156,
    taxaResposta: 92,
    conversao: 95,
    canal: "whatsapp"
  },
  {
    id: 4,
    nome: "Pós-Procedimento",
    descricao: "Orientações e acompanhamento após procedimento",
    status: "pausado",
    gatilho: "Procedimento realizado",
    etapas: 5,
    enviados: 78,
    taxaResposta: 85,
    conversao: 72,
    canal: "email"
  },
  {
    id: 5,
    nome: "Aniversário Cliente",
    descricao: "Mensagem especial + cupom de desconto",
    status: "ativo",
    gatilho: "Data de aniversário",
    etapas: 1,
    enviados: 34,
    taxaResposta: 76,
    conversao: 45,
    canal: "whatsapp"
  },
];

// Gatilhos disponíveis
const gatilhosDisponiveis = [
  { id: 1, nome: "Novo Lead Cadastrado", icon: Users, categoria: "leads", descricao: "Quando um novo lead entra no sistema" },
  { id: 2, nome: "Lead Sem Resposta", icon: Clock, categoria: "leads", descricao: "Lead não responde há X dias" },
  { id: 3, nome: "Lead Mudou de Etapa", icon: Target, categoria: "leads", descricao: "Lead avançou ou retrocedeu no funil" },
  { id: 4, nome: "Agendamento Criado", icon: Calendar, categoria: "agenda", descricao: "Novo agendamento marcado" },
  { id: 5, nome: "Lembrete Pré-Consulta", icon: Clock, categoria: "agenda", descricao: "X horas antes do procedimento" },
  { id: 6, nome: "Procedimento Realizado", icon: Heart, categoria: "pos", descricao: "Após conclusão do procedimento" },
  { id: 7, nome: "No-Show Detectado", icon: AlertTriangle, categoria: "agenda", descricao: "Paciente não compareceu" },
  { id: 8, nome: "Aniversário do Cliente", icon: Heart, categoria: "relacionamento", descricao: "Na data de aniversário" },
];

// Regras de nurturing
const regrasNurturing = [
  {
    id: 1,
    nome: "Nurturing Harmonização",
    segmento: "Interessados em Harmonização",
    leadsAtivos: 45,
    status: "ativo",
    conteudos: [
      { dia: 1, tipo: "Vídeo", titulo: "Antes e Depois - Casos Reais" },
      { dia: 3, tipo: "Artigo", titulo: "Tudo sobre Harmonização Facial" },
      { dia: 7, tipo: "Depoimento", titulo: "O que dizem nossos pacientes" },
      { dia: 14, tipo: "Oferta", titulo: "Avaliação gratuita + condição especial" },
    ]
  },
  {
    id: 2,
    nome: "Nurturing Botox",
    segmento: "Interessados em Botox",
    leadsAtivos: 32,
    status: "ativo",
    conteudos: [
      { dia: 1, tipo: "FAQ", titulo: "Dúvidas frequentes sobre Botox" },
      { dia: 5, tipo: "Vídeo", titulo: "Procedimento na prática" },
      { dia: 10, tipo: "Oferta", titulo: "Primeira aplicação com desconto" },
    ]
  },
  {
    id: 3,
    nome: "Reativação Clientes Inativos",
    segmento: "Sem visita há 6 meses",
    leadsAtivos: 128,
    status: "pausado",
    conteudos: [
      { dia: 1, tipo: "Saudade", titulo: "Sentimos sua falta!" },
      { dia: 7, tipo: "Novidades", titulo: "Novos procedimentos disponíveis" },
      { dia: 15, tipo: "Oferta", titulo: "Volte com 20% de desconto" },
    ]
  },
];

interface FluxoCardProps {
  fluxo: typeof fluxosAutomacao[0];
}

const FluxoCard = ({ fluxo }: FluxoCardProps) => {
  const [isActive, setIsActive] = useState(fluxo.status === "ativo");

  return (
    <Card className="glass-card hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
              {fluxo.canal === "whatsapp" ? (
                <MessageCircle className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              ) : (
                <Mail className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{fluxo.nome}</h3>
              <p className="text-sm text-muted-foreground">{fluxo.descricao}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => alert(`Editando: ${fluxo.nome}`)}><Edit className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Duplicando: ${fluxo.nome}`)}><Copy className="w-4 h-4 mr-2" /> Duplicar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => alert(`Excluindo: ${fluxo.nome}`)}><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {fluxo.gatilho}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {fluxo.etapas} etapas
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{fluxo.enviados}</p>
            <p className="text-xs text-muted-foreground">Enviados</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{fluxo.taxaResposta}%</p>
            <p className="text-xs text-muted-foreground">Resposta</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-revenue-confirmed">{fluxo.conversao}%</p>
            <p className="text-xs text-muted-foreground">Conversão</p>
          </div>
        </div>

        <Button variant="ghost" className="w-full mt-4 gap-2" onClick={() => alert(`Configurando fluxo: ${fluxo.nome}`)}>
          <Settings className="w-4 h-4" />
          Configurar Fluxo
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Automacoes() {
  const [activeSection, setActiveSection] = useState("automacoes");

  const totalEnviados = fluxosAutomacao.reduce((acc, f) => acc + f.enviados, 0);
  const mediaResposta = Math.round(fluxosAutomacao.reduce((acc, f) => acc + f.taxaResposta, 0) / fluxosAutomacao.length);
  const fluxosAtivos = fluxosAutomacao.filter(f => f.status === "ativo").length;

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Automações</h1>
            <p className="text-muted-foreground">Fluxos automáticos de comunicação</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => alert("Criação de nova automação em desenvolvimento!")}>
            <Plus className="w-4 h-4" />
            Nova Automação
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{fluxosAtivos}</p>
                  <p className="text-sm text-muted-foreground">Fluxos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEnviados}</p>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
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
                  <p className="text-2xl font-bold text-foreground">{mediaResposta}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-revenue-confirmed/10">
                  <Target className="w-5 h-5 text-revenue-confirmed" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">R$ 45.200</p>
                  <p className="text-sm text-muted-foreground">Receita Gerada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fluxos" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="fluxos">Fluxos de Mensagem</TabsTrigger>
            <TabsTrigger value="gatilhos">Gatilhos</TabsTrigger>
            <TabsTrigger value="nurturing">Regras de Nurturing</TabsTrigger>
          </TabsList>

          {/* Tab Fluxos */}
          <TabsContent value="fluxos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fluxosAutomacao.map((fluxo) => (
                <FluxoCard key={fluxo.id} fluxo={fluxo} />
              ))}
            </div>
          </TabsContent>

          {/* Tab Gatilhos */}
          <TabsContent value="gatilhos">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Gatilhos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gatilhosDisponiveis.map((gatilho) => {
                    const Icon = gatilho.icon;
                    return (
                      <div key={gatilho.id} className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">{gatilho.nome}</h4>
                              <Badge variant="outline" className="text-xs capitalize">{gatilho.categoria}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{gatilho.descricao}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Nurturing */}
          <TabsContent value="nurturing" className="space-y-6">
            {regrasNurturing.map((regra) => (
              <Card key={regra.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${regra.status === 'ativo' ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Heart className={`w-5 h-5 ${regra.status === 'ativo' ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{regra.nome}</CardTitle>
                        <p className="text-sm text-muted-foreground">{regra.segmento}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={regra.status === 'ativo' ? 'default' : 'secondary'}>
                        {regra.status === 'ativo' ? (
                          <><Play className="w-3 h-3 mr-1" /> Ativo</>
                        ) : (
                          <><Pause className="w-3 h-3 mr-1" /> Pausado</>
                        )}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{regra.leadsAtivos} leads ativos</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {regra.conteudos.map((conteudo, idx) => (
                        <div key={idx} className="flex items-center gap-4 relative">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10 border-4 border-background">
                            <span className="text-sm font-bold text-primary">D{conteudo.dia}</span>
                          </div>
                          <div className="flex-1 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{conteudo.tipo}</Badge>
                              <span className="font-medium text-foreground">{conteudo.titulo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-6 gap-2" onClick={() => alert(`Adicionando conteúdo à regra: ${regra.nome}`)}>
                    <Plus className="w-4 h-4" />
                    Adicionar Conteúdo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
