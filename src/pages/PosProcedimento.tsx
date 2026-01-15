import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Calendar,
  FileText,
  Star,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Phone,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
  ChevronRight,
  Filter,
  TrendingUp
} from "lucide-react";

// Pacientes em acompanhamento
const pacientesAcompanhamento = [
  {
    id: 1,
    nome: "Ana Costa",
    procedimento: "Harmonização Facial",
    dataProcedimento: "10/01/2025",
    profissional: "Dra. Renata",
    diasPos: 4,
    status: "em_acompanhamento",
    orientacoesEnviadas: 3,
    proximaOrientacao: "Dia 7 - Cuidados com exposição solar",
    ultimoContato: "13/01/2025",
    respondeuPesquisa: false,
    notas: "Paciente relatou leve inchaço no 2º dia, dentro do esperado."
  },
  {
    id: 2,
    nome: "Carlos Silva",
    procedimento: "Botox",
    dataProcedimento: "08/01/2025",
    profissional: "Dra. Renata",
    diasPos: 6,
    status: "em_acompanhamento",
    orientacoesEnviadas: 4,
    proximaOrientacao: "Dia 7 - Pesquisa de satisfação",
    ultimoContato: "12/01/2025",
    respondeuPesquisa: false,
    notas: ""
  },
  {
    id: 3,
    nome: "Marina Oliveira",
    procedimento: "Preenchimento Labial",
    dataProcedimento: "05/01/2025",
    profissional: "Dr. Carlos",
    diasPos: 9,
    status: "concluido",
    orientacoesEnviadas: 5,
    proximaOrientacao: null,
    ultimoContato: "12/01/2025",
    respondeuPesquisa: true,
    notas: "Retorno agendado para 05/02",
    satisfacao: 5
  },
  {
    id: 4,
    nome: "Roberto Santos",
    procedimento: "Bioestimulador",
    dataProcedimento: "12/01/2025",
    profissional: "Dra. Marina",
    diasPos: 2,
    status: "atencao",
    orientacoesEnviadas: 2,
    proximaOrientacao: "Dia 3 - Massagem local",
    ultimoContato: "13/01/2025",
    respondeuPesquisa: false,
    notas: "Paciente reportou nódulo palpável. Orientado sobre normalidade. Monitorar."
  },
];

// Orientações automáticas
const orientacoesAutomaticas = [
  {
    id: 1,
    procedimento: "Harmonização Facial",
    orientacoes: [
      { dia: 0, titulo: "Cuidados Imediatos", descricao: "Evite tocar na região, não deitar de bruços", enviada: true },
      { dia: 1, titulo: "Primeiro Dia", descricao: "Aplicar gelo se houver inchaço", enviada: true },
      { dia: 3, titulo: "Hidratação", descricao: "Mantenha a pele hidratada", enviada: true },
      { dia: 7, titulo: "Exposição Solar", descricao: "Evitar sol direto, usar protetor FPS 50+", enviada: false },
      { dia: 14, titulo: "Resultado Final", descricao: "Avaliação do resultado", enviada: false },
    ]
  },
  {
    id: 2,
    procedimento: "Botox",
    orientacoes: [
      { dia: 0, titulo: "Pós-Imediato", descricao: "Não deitar por 4 horas", enviada: true },
      { dia: 1, titulo: "Atividade Física", descricao: "Evitar exercícios intensos por 24h", enviada: true },
      { dia: 3, titulo: "Movimentos Faciais", descricao: "Fazer expressões para fixação", enviada: true },
      { dia: 7, titulo: "Pesquisa de Satisfação", descricao: "Como está o resultado?", enviada: false },
    ]
  },
];

// Pesquisas de satisfação
const pesquisasSatisfacao = [
  { id: 1, paciente: "Marina Oliveira", procedimento: "Preenchimento Labial", data: "12/01/2025", nota: 5, comentario: "Amei o resultado! Ficou muito natural.", profissional: "Dr. Carlos" },
  { id: 2, paciente: "Fernanda Lima", procedimento: "Botox", data: "11/01/2025", nota: 5, comentario: "Excelente atendimento e resultado.", profissional: "Dra. Renata" },
  { id: 3, paciente: "Pedro Alves", procedimento: "Skinbooster", data: "10/01/2025", nota: 4, comentario: "Bom resultado, mas esperava mais hidratação.", profissional: "Dra. Marina" },
  { id: 4, paciente: "Juliana Mendes", procedimento: "Harmonização", data: "08/01/2025", nota: 3, comentario: "Resultado bom, mas tive muito inchaço.", profissional: "Dra. Renata" },
];

interface PacienteCardProps {
  paciente: typeof pacientesAcompanhamento[0];
}

const PacienteCard = ({ paciente }: PacienteCardProps) => {
  const statusConfig = {
    em_acompanhamento: { label: "Em Acompanhamento", color: "bg-primary text-white", icon: Clock },
    concluido: { label: "Concluído", color: "bg-revenue-confirmed text-white", icon: CheckCircle2 },
    atencao: { label: "Atenção", color: "bg-amber-500 text-white", icon: AlertCircle },
  };

  const status = statusConfig[paciente.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <Card className={`glass-card hover:shadow-lg transition-all ${paciente.status === 'atencao' ? 'border-l-4 border-l-amber-500' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white font-semibold">
                {paciente.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{paciente.nome}</h3>
              <p className="text-sm text-muted-foreground">{paciente.procedimento}</p>
            </div>
          </div>
          <Badge className={status.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">D+{paciente.diasPos}</p>
            <p className="text-xs text-muted-foreground">Pós-Proc.</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{paciente.orientacoesEnviadas}</p>
            <p className="text-xs text-muted-foreground">Orientações</p>
          </div>
          <div className="text-center">
            {paciente.respondeuPesquisa ? (
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <p className="text-lg font-bold text-foreground">{(paciente as any).satisfacao}</p>
              </div>
            ) : (
              <p className="text-lg font-bold text-muted-foreground">-</p>
            )}
            <p className="text-xs text-muted-foreground">Satisfação</p>
          </div>
        </div>

        {paciente.proximaOrientacao && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mb-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Próxima orientação:</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{paciente.proximaOrientacao}</p>
          </div>
        )}

        {paciente.notas && (
          <div className="p-3 bg-muted/30 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">{paciente.notas}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{paciente.profissional}</span>
            <span>•</span>
            <span>{paciente.dataProcedimento}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SatisfacaoIcon = ({ nota }: { nota: number }) => {
  if (nota >= 4) return <Smile className="w-5 h-5 text-revenue-confirmed" />;
  if (nota >= 3) return <Meh className="w-5 h-5 text-amber-500" />;
  return <Frown className="w-5 h-5 text-revenue-at-risk" />;
};

export default function PosProcedimento() {
  const [activeSection, setActiveSection] = useState("pos-procedimento");
  const [searchTerm, setSearchTerm] = useState("");

  const emAcompanhamento = pacientesAcompanhamento.filter(p => p.status === "em_acompanhamento").length;
  const comAtencao = pacientesAcompanhamento.filter(p => p.status === "atencao").length;
  const satisfacaoMedia = (pesquisasSatisfacao.reduce((acc, p) => acc + p.nota, 0) / pesquisasSatisfacao.length).toFixed(1);
  const taxaResposta = Math.round((pesquisasSatisfacao.length / pacientesAcompanhamento.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pós-Procedimento</h1>
            <p className="text-muted-foreground">Acompanhamento e satisfação de pacientes</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nova Orientação
          </Button>
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
          <Card className="glass-card border-l-4 border-l-amber-500">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pacientesAcompanhamento.map((paciente) => (
                <PacienteCard key={paciente.id} paciente={paciente} />
              ))}
            </div>
          </TabsContent>

          {/* Tab Orientações */}
          <TabsContent value="orientacoes" className="space-y-6">
            {orientacoesAutomaticas.map((grupo) => (
              <Card key={grupo.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {grupo.procedimento}
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {grupo.orientacoes.map((orientacao, idx) => (
                        <div key={idx} className="flex items-start gap-4 relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-background ${orientacao.enviada ? 'bg-revenue-confirmed' : 'bg-muted'}`}>
                            {orientacao.enviada ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <Clock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Dia {orientacao.dia}</Badge>
                                <span className="font-medium text-foreground">{orientacao.titulo}</span>
                              </div>
                              {orientacao.enviada && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Enviada
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{orientacao.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab Satisfação */}
          <TabsContent value="satisfacao">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Pesquisas de Satisfação Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pesquisasSatisfacao.map((pesquisa) => (
                    <div key={pesquisa.id} className="p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white text-sm">
                              {pesquisa.paciente.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{pesquisa.paciente}</p>
                            <p className="text-sm text-muted-foreground">{pesquisa.procedimento} • {pesquisa.profissional}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <SatisfacaoIcon nota={pesquisa.nota} />
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= pesquisa.nota ? 'text-amber-500 fill-amber-500' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <p className="text-sm text-foreground italic">"{pesquisa.comentario}"</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{pesquisa.data}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Resumo de Satisfação</p>
                      <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4 text-revenue-confirmed" />
                          <span className="font-bold text-foreground">75%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Promotores</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Meh className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-foreground">20%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Neutros</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4 text-revenue-at-risk" />
                          <span className="font-bold text-foreground">5%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Detratores</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
