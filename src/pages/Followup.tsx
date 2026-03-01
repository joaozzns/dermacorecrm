import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  RefreshCw, Clock, AlertTriangle, TrendingUp, DollarSign,
  Play, Pause, ChevronRight, MessageCircle, Mail, Phone, User, Zap,
  Target, ArrowDownRight, Plus, MoreHorizontal, Search, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { useQuotes } from "@/hooks/useQuotes";
import { useFollowUpSequences } from "@/hooks/useFollowUpSequences";
import { useLeadInteractions } from "@/hooks/useLeadInteractions";

const tipoLabels: Record<string, string> = {
  'pos-avaliacao': 'Pós-Avaliação',
  'pos-orcamento': 'Pós-Orçamento',
  'recompra': 'Recompra',
  'reativacao': 'Reativação',
  'aniversario': 'Aniversário',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

interface ColdLead {
  lead: Lead;
  diasParado: number;
  urgencia: 'critico' | 'atencao' | 'monitorar';
  quoteTotal: number;
}

const Followup = () => {
  const [activeSection, setActiveSection] = useState("followup");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewSeqDialogOpen, setIsNewSeqDialogOpen] = useState(false);
  const [newSeqName, setNewSeqName] = useState("");
  const [newSeqDesc, setNewSeqDesc] = useState("");
  const [newSeqType, setNewSeqType] = useState("pos-avaliacao");
  const [newSeqEtapas, setNewSeqEtapas] = useState("3");

  const { leads } = useLeads();
  const { quotes } = useQuotes();
  const { sequences, isLoading: seqLoading, createSequence, toggleSequence } = useFollowUpSequences();
  const { createInteraction } = useLeadInteractions();

  // Calculate cold leads
  const coldLeads: ColdLead[] = leads
    .filter(l => l.status !== 'convertido' && l.status !== 'perdido')
    .map(lead => {
      const lastContact = lead.last_contact_at ? new Date(lead.last_contact_at) : new Date(lead.created_at);
      const diasParado = Math.floor((Date.now() - lastContact.getTime()) / 86400000);
      const leadQuotes = quotes.filter(q => q.lead_id === lead.id);
      const quoteTotal = leadQuotes.reduce((acc, q) => acc + Number(q.total), 0);
      const urgencia: ColdLead['urgencia'] = diasParado > 7 ? 'critico' : diasParado > 3 ? 'atencao' : 'monitorar';
      return { lead, diasParado, urgencia, quoteTotal };
    })
    .filter(cl => cl.diasParado >= 3)
    .sort((a, b) => b.diasParado - a.diasParado);

  const receitaEmRisco = coldLeads.reduce((acc, cl) => acc + cl.quoteTotal, 0);

  const filteredColdLeads = coldLeads.filter(cl => {
    const matchSearch = cl.lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (cl.lead.interest || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filtroStatus === "todos") return matchSearch;
    if (filtroStatus === "critico") return matchSearch && cl.urgencia === 'critico';
    if (filtroStatus === "atencao") return matchSearch && cl.urgencia === 'atencao';
    if (filtroStatus === "novo") return matchSearch && cl.urgencia === 'monitorar';
    return matchSearch;
  });

  const handleCreateSequence = async () => {
    if (!newSeqName.trim()) {
      toast.error("Nome da sequência é obrigatório");
      return;
    }
    try {
      await createSequence.mutateAsync({
        name: newSeqName.trim(),
        description: newSeqDesc.trim() || `Sequência de ${tipoLabels[newSeqType] || newSeqType}`,
        type: newSeqType,
        steps_count: parseInt(newSeqEtapas) || 3,
      });
      setNewSeqName("");
      setNewSeqDesc("");
      setNewSeqType("pos-avaliacao");
      setNewSeqEtapas("3");
      setIsNewSeqDialogOpen(false);
    } catch {}
  };

  const handleLeadWhatsApp = async (cl: ColdLead) => {
    const phone = cl.lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${cl.lead.name.split(' ')[0]}! Tudo bem? Passando para verificar se tem alguma dúvida sobre ${cl.lead.interest || 'nossos serviços'}.`);
    
    await createInteraction.mutateAsync({
      lead_id: cl.lead.id,
      type: 'whatsapp',
      content: `Follow-up via WhatsApp - ${cl.lead.interest || 'geral'}`,
      direction: 'outbound',
    });
    
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  const handleLeadCall = async (cl: ColdLead) => {
    const phone = cl.lead.phone.replace(/\D/g, '');
    await createInteraction.mutateAsync({
      lead_id: cl.lead.id,
      type: 'phone',
      content: 'Ligação de follow-up',
      direction: 'outbound',
    });
    window.open(`tel:+55${phone}`, "_self");
  };

  const handleLeadEmail = async (cl: ColdLead) => {
    if (cl.lead.email) {
      await createInteraction.mutateAsync({
        lead_id: cl.lead.id,
        type: 'email',
        content: `Email de follow-up sobre ${cl.lead.interest || 'serviços'}`,
        direction: 'outbound',
      });
      const subject = encodeURIComponent(`Sobre seu interesse em ${cl.lead.interest || 'nossos serviços'}`);
      window.open(`mailto:${cl.lead.email}?subject=${subject}`, "_self");
    } else {
      toast.error("Lead não possui e-mail cadastrado");
    }
  };

  const urgenciaConfig = {
    critico: { bg: "bg-revenue-lost-bg", border: "border-l-revenue-lost", text: "text-revenue-lost", label: "Crítico" },
    atencao: { bg: "bg-revenue-at-risk-bg", border: "border-l-revenue-at-risk", text: "text-revenue-at-risk", label: "Atenção" },
    monitorar: { bg: "bg-revenue-paused-bg", border: "border-l-revenue-paused", text: "text-revenue-paused", label: "Monitorar" },
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 md:px-8 py-4">
            <div className="flex items-center gap-3 ml-12 md:ml-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-foreground">Follow-up</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Recupere faturamento com sequências inteligentes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
              <div className="relative shrink-0 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar lead..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 md:w-64 pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              
              <button className="btn-premium flex items-center gap-2 text-white text-sm py-2 shrink-0" onClick={() => setIsNewSeqDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Nova Sequência</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Receita em Risco</span>
                <div className="p-2 rounded-lg bg-revenue-lost-bg">
                  <AlertTriangle className="w-5 h-5 text-revenue-lost" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-revenue-lost">{formatCurrency(receitaEmRisco)}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-revenue-lost">
                <ArrowDownRight className="w-3 h-3" />
                <span>{coldLeads.length} leads esfriando</span>
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Leads Esfriando</span>
                <div className="p-2 rounded-lg bg-revenue-at-risk-bg">
                  <Clock className="w-5 h-5 text-revenue-at-risk" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{coldLeads.length}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {coldLeads.filter(c => c.urgencia === 'critico').length} críticos
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Sequências Ativas</span>
                <div className="p-2 rounded-lg bg-secondary">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {sequences.filter(s => s.is_active).length}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                de {sequences.length} total
              </div>
            </div>
            
            <div className="card-premium p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Leads Totais</span>
                <div className="p-2 rounded-lg bg-revenue-recoverable-bg">
                  <Target className="w-5 h-5 text-revenue-recoverable" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary">{leads.length}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {leads.filter(l => l.status === 'convertido').length} convertidos
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cold Leads */}
            <div className="lg:col-span-2 space-y-6">
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
                      <SelectItem value="novo">Monitorar (&lt;3 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredColdLeads.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      {coldLeads.length === 0 ? "🎉 Nenhum lead esfriando! Todos estão sendo acompanhados." : "Nenhum lead encontrado com esse filtro."}
                    </div>
                  ) : (
                    filteredColdLeads.map((cl) => {
                      const config = urgenciaConfig[cl.urgencia];
                      return (
                        <div key={cl.lead.id} className={cn("p-4 rounded-r-xl border-l-4 transition-all hover:shadow-md cursor-pointer group", config.bg, config.border)}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{cl.lead.name}</h4>
                                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", config.bg, config.text)}>
                                  {config.label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{cl.lead.interest || 'Sem interesse definido'}</p>
                            </div>
                            {cl.quoteTotal > 0 && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">{formatCurrency(cl.quoteTotal)}</div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cl.diasParado} dias sem contato
                            </span>
                            <span>{cl.lead.source || 'Origem indefinida'}</span>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-background/50 rounded-lg transition-colors" title="WhatsApp" onClick={() => handleLeadWhatsApp(cl)}>
                                <MessageCircle className="w-4 h-4 text-revenue-confirmed" />
                              </button>
                              <button className="p-2 hover:bg-background/50 rounded-lg transition-colors" title="Ligar" onClick={() => handleLeadCall(cl)}>
                                <Phone className="w-4 h-4 text-primary" />
                              </button>
                              <button className="p-2 hover:bg-background/50 rounded-lg transition-colors" title="Email" onClick={() => handleLeadEmail(cl)}>
                                <Mail className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Sequences */}
            <div className="space-y-6">
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Sequências</h2>
                      <p className="text-sm text-muted-foreground">Automações configuradas</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {seqLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : sequences.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      Nenhuma sequência criada. Clique em "Nova Sequência" para começar.
                    </div>
                  ) : (
                    sequences.map((seq) => (
                      <div key={seq.id} className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{seq.name}</h4>
                              {seq.is_active ? (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-revenue-confirmed-bg text-revenue-confirmed flex items-center gap-1">
                                  <Play className="w-3 h-3" /> Ativa
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                                  <Pause className="w-3 h-3" /> Pausada
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{seq.description}</p>
                          </div>
                          <button
                            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded"
                            onClick={() => toggleSequence.mutate({ id: seq.id, is_active: !seq.is_active })}
                            title={seq.is_active ? "Pausar" : "Ativar"}
                          >
                            {seq.is_active ? <Pause className="w-4 h-4 text-muted-foreground" /> : <Play className="w-4 h-4 text-primary" />}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{seq.steps_count} etapas • {tipoLabels[seq.type] || seq.type}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Sequence Dialog */}
      <Dialog open={isNewSeqDialogOpen} onOpenChange={setIsNewSeqDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Nova Sequência de Follow-up
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="seq-name">Nome da Sequência *</Label>
              <Input
                id="seq-name"
                placeholder="Ex: Pós-Consulta Premium"
                value={newSeqName}
                onChange={(e) => setNewSeqName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seq-desc">Descrição</Label>
              <Textarea
                id="seq-desc"
                placeholder="Descreva o objetivo desta sequência"
                value={newSeqDesc}
                onChange={(e) => setNewSeqDesc(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={newSeqType} onValueChange={setNewSeqType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pos-avaliacao">Pós-Avaliação</SelectItem>
                    <SelectItem value="pos-orcamento">Pós-Orçamento</SelectItem>
                    <SelectItem value="recompra">Recompra</SelectItem>
                    <SelectItem value="reativacao">Reativação</SelectItem>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seq-etapas">Nº de Etapas</Label>
                <Input
                  id="seq-etapas"
                  type="number"
                  min="1"
                  max="10"
                  value={newSeqEtapas}
                  onChange={(e) => setNewSeqEtapas(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateSequence} disabled={createSequence.isPending}>
              {createSequence.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Plus className="w-4 h-4 mr-2" />
              Criar Sequência
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Followup;
