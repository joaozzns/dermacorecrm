import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  User,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  MoreHorizontal,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Sequencia {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'pos-avaliacao' | 'pos-orcamento' | 'recompra' | 'reativacao' | 'aniversario';
  leadsAtivos: number;
  taxaResposta: number;
  receitaRecuperada: number;
  ativa: boolean;
  etapas: number;
}

interface LeadEsfriando {
  id: string;
  nome: string;
  procedimento: string;
  valorPotencial: number;
  ultimoContato: string;
  diasParado: number;
  etapaFunil: string;
  motivoEsfriamento: string;
  probabilidade: number;
  acaoRecomendada: string;
}

const sequencias: Sequencia[] = [
  { id: "1", nome: "Pós-Avaliação", descricao: "Follow-up automático após avaliação presencial", tipo: "pos-avaliacao", leadsAtivos: 24, taxaResposta: 68, receitaRecuperada: 45000, ativa: true, etapas: 5 },
  { id: "2", nome: "Pós-Orçamento", descricao: "Recuperação de leads que receberam orçamento", tipo: "pos-orcamento", leadsAtivos: 18, taxaResposta: 42, receitaRecuperada: 32000, ativa: true, etapas: 4 },
  { id: "3", nome: "Recompra 90 dias", descricao: "Lembrete de manutenção após 90 dias", tipo: "recompra", leadsAtivos: 35, taxaResposta: 55, receitaRecuperada: 28000, ativa: true, etapas: 3 },
  { id: "4", nome: "Reativação", descricao: "Recuperação de leads inativos há 6+ meses", tipo: "reativacao", leadsAtivos: 42, taxaResposta: 22, receitaRecuperada: 15000, ativa: false, etapas: 6 },
  { id: "5", nome: "Aniversário", descricao: "Mensagem especial de aniversário", tipo: "aniversario", leadsAtivos: 8, taxaResposta: 85, receitaRecuperada: 12000, ativa: true, etapas: 2 },
];

const leadsEsfriando: LeadEsfriando[] = [
  { id: "1", nome: "Ana Carolina Silva", procedimento: "Harmonização Facial", valorPotencial: 8500, ultimoContato: "5 dias atrás", diasParado: 5, etapaFunil: "Pós-Avaliação", motivoEsfriamento: "Sem resposta após orçamento", probabilidade: 65, acaoRecomendada: "Enviar benefício exclusivo" },
  { id: "2", nome: "Fernanda Lima", procedimento: "Lipoaspiração", valorPotencial: 15000, ultimoContato: "7 dias atrás", diasParado: 7, etapaFunil: "Avaliação Agendada", motivoEsfriamento: "Cancelou avaliação", probabilidade: 45, acaoRecomendada: "Reagendar com desconto" },
  { id: "3", nome: "Patricia Mendes", procedimento: "Botox + Preenchimento", valorPotencial: 5500, ultimoContato: "3 dias atrás", diasParado: 3, etapaFunil: "Contato Feito", motivoEsfriamento: "Pediu tempo para pensar", probabilidade: 72, acaoRecomendada: "Enviar depoimentos" },
  { id: "4", nome: "Juliana Costa", procedimento: "Rinoplastia", valorPotencial: 12000, ultimoContato: "10 dias atrás", diasParado: 10, etapaFunil: "Orçamento Enviado", motivoEsfriamento: "Comparando preços", probabilidade: 38, acaoRecomendada: "Destacar diferenciais" },
  { id: "5", nome: "Beatriz Rocha", procedimento: "Bioestimulador", valorPotencial: 4200, ultimoContato: "4 dias atrás", diasParado: 4, etapaFunil: "Novo Lead", motivoEsfriamento: "Não atendeu ligação", probabilidade: 55, acaoRecomendada: "Tentar WhatsApp" },
  { id: "6", nome: "Luciana Ferreira", procedimento: "Skinbooster", valorPotencial: 1800, ultimoContato: "8 dias atrás", diasParado: 8, etapaFunil: "Pós-Orçamento", motivoEsfriamento: "Disse que está sem dinheiro", probabilidade: 25, acaoRecomendada: "Oferecer parcelamento" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

const Followup = () => {
  const [activeSection, setActiveSection] = useState("followup");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const receitaEmRisco = leadsEsfriando.reduce((acc, lead) => acc + lead.valorPotencial, 0);
  const receitaRecuperada = sequencias.reduce((acc, seq) => acc + seq.receitaRecuperada, 0);
  const totalLeadsAtivos = sequencias.reduce((acc, seq) => acc + seq.leadsAtivos, 0);
  const taxaMediaResposta = Math.round(sequencias.reduce((acc, seq) => acc + seq.taxaResposta, 0) / sequencias.length);

  const handleNewSequence = () => {
    alert("Funcionalidade de nova sequência em desenvolvimento. Em breve disponível!");
  };

  const handleLeadWhatsApp = (lead: LeadEsfriando) => {
    const message = encodeURIComponent(`Olá ${lead.nome}! Tudo bem? Passando para verificar se tem alguma dúvida sobre ${lead.procedimento}.`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleLeadCall = (lead: LeadEsfriando) => {
    window.open(`tel:+5511999990000`, "_self");
  };

  const handleLeadEmail = (lead: LeadEsfriando) => {
    const subject = encodeURIComponent(`Sobre seu interesse em ${lead.procedimento}`);
    const body = encodeURIComponent(`Olá ${lead.nome},\n\nEsperamos que esteja bem!\n\nGostaríamos de conversar sobre ${lead.procedimento}.\n\nAtenciosamente,\nEquipe da Clínica`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  const filteredLeads = leadsEsfriando.filter(lead => {
    const matchSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.procedimento.toLowerCase().includes(searchTerm.toLowerCase());
    if (filtroStatus === "todos") return matchSearch;
    if (filtroStatus === "critico") return matchSearch && lead.diasParado > 7;
    if (filtroStatus === "atencao") return matchSearch && lead.diasParado > 3 && lead.diasParado <= 7;
    if (filtroStatus === "novo") return matchSearch && lead.diasParado <= 3;
    return matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Follow-up</h1>
                <p className="text-sm text-muted-foreground">Recupere faturamento com sequências inteligentes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar lead..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              
              <button className="btn-premium flex items-center gap-2 text-white text-sm py-2" onClick={handleNewSequence}>
                <Plus className="w-4 h-4" />
                Nova Sequência
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Receita em Risco</span>
                <div className="p-2 rounded-lg bg-revenue-lost-bg">
                  <AlertTriangle className="w-5 h-5 text-revenue-lost" />
                </div>
              </div>
              <div className="text-3xl font-bold text-revenue-lost">{formatCurrency(receitaEmRisco)}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-revenue-lost">
                <ArrowDownRight className="w-3 h-3" />
                <span>{leadsEsfriando.length} leads esfriando</span>
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Receita Recuperada</span>
                <div className="p-2 rounded-lg bg-revenue-confirmed-bg">
                  <TrendingUp className="w-5 h-5 text-revenue-confirmed" />
                </div>
              </div>
              <div className="text-3xl font-bold text-revenue-confirmed">{formatCurrency(receitaRecuperada)}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-revenue-confirmed">
                <ArrowUpRight className="w-3 h-3" />
                <span>+23% este mês</span>
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Leads em Sequências</span>
                <div className="p-2 rounded-lg bg-secondary">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{totalLeadsAtivos}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Em {sequencias.filter(s => s.ativa).length} sequências ativas
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Taxa de Resposta</span>
                <div className="p-2 rounded-lg bg-revenue-recoverable-bg">
                  <Target className="w-5 h-5 text-revenue-recoverable" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{taxaMediaResposta}%</div>
              <Progress value={taxaMediaResposta} className="mt-3 h-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Leads Esfriando */}
            <div className="col-span-2 space-y-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-revenue-at-risk to-amber-400 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Leads Esfriando</h2>
                      <p className="text-sm text-muted-foreground">Ação necessária para não perder a venda</p>
                    </div>
                  </div>
                  
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="critico">Crítico (&gt;7 dias)</SelectItem>
                      <SelectItem value="atencao">Atenção (3-7 dias)</SelectItem>
                      <SelectItem value="novo">Novo (&lt;3 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <LeadEsfriandoCard key={lead.id} lead={lead} onWhatsApp={handleLeadWhatsApp} onCall={handleLeadCall} onEmail={handleLeadEmail} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sequências Automáticas */}
            <div className="space-y-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Sequências</h2>
                      <p className="text-sm text-muted-foreground">Automações ativas</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {sequencias.map((sequencia) => (
                    <SequenciaCard key={sequencia.id} sequencia={sequencia} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface LeadEsfriandoCardProps {
  lead: LeadEsfriando;
  onWhatsApp: (lead: LeadEsfriando) => void;
  onCall: (lead: LeadEsfriando) => void;
  onEmail: (lead: LeadEsfriando) => void;
}

const LeadEsfriandoCard = ({ lead, onWhatsApp, onCall, onEmail }: LeadEsfriandoCardProps) => {
  const urgencia = lead.diasParado > 7 ? "critico" : lead.diasParado > 3 ? "atencao" : "novo";
  
  const urgenciaConfig = {
    critico: { bg: "bg-revenue-lost-bg", border: "border-l-revenue-lost", text: "text-revenue-lost", label: "Crítico" },
    atencao: { bg: "bg-revenue-at-risk-bg", border: "border-l-revenue-at-risk", text: "text-revenue-at-risk", label: "Atenção" },
    novo: { bg: "bg-revenue-paused-bg", border: "border-l-revenue-paused", text: "text-revenue-paused", label: "Monitorar" },
  };

  const config = urgenciaConfig[urgencia];
  const probColor = lead.probabilidade >= 60 ? "text-revenue-confirmed" : lead.probabilidade >= 40 ? "text-revenue-at-risk" : "text-revenue-lost";

  return (
    <div className={cn("p-4 rounded-r-xl border-l-4 transition-all hover:shadow-md cursor-pointer group", config.bg, config.border)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{lead.nome}</h4>
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", config.bg, config.text)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{lead.procedimento}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{formatCurrency(lead.valorPotencial)}</div>
          <div className={cn("text-xs font-medium", probColor)}>{lead.probabilidade}% chance</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lead.ultimoContato}
        </span>
        <span>{lead.etapaFunil}</span>
      </div>
      
      <div className="p-2 rounded-lg bg-white/50 mb-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Motivo:</span> {lead.motivoEsfriamento}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-primary/10">
          <p className="text-xs font-medium text-primary">💡 {lead.acaoRecomendada}</p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="WhatsApp" onClick={() => onWhatsApp(lead)}>
            <MessageCircle className="w-4 h-4 text-green-600" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Ligar" onClick={() => onCall(lead)}>
            <Phone className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Email" onClick={() => onEmail(lead)}>
            <Mail className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SequenciaCardProps {
  sequencia: Sequencia;
}

const SequenciaCard = ({ sequencia }: SequenciaCardProps) => {
  return (
    <div className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{sequencia.nome}</h4>
            {sequencia.ativa ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-revenue-confirmed-bg text-revenue-confirmed flex items-center gap-1">
                <Play className="w-3 h-3" /> Ativa
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Pause className="w-3 h-3" /> Pausada
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{sequencia.descricao}</p>
        </div>
        <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="p-2 rounded-lg bg-muted/50">
          <div className="text-sm font-bold text-foreground">{sequencia.leadsAtivos}</div>
          <div className="text-xs text-muted-foreground">Leads</div>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <div className="text-sm font-bold text-primary">{sequencia.taxaResposta}%</div>
          <div className="text-xs text-muted-foreground">Resposta</div>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <div className="text-sm font-bold text-revenue-confirmed">{formatCurrency(sequencia.receitaRecuperada)}</div>
          <div className="text-xs text-muted-foreground">Recuperado</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{sequencia.etapas} etapas</span>
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default Followup;
