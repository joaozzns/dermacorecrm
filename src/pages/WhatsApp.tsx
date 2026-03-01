import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  MessageCircle, Send, Search, Phone, Video, MoreVertical,
  Paperclip, Smile, Clock, CheckCheck, Check, User, Calendar,
  DollarSign, FileText, Star, Tag, ChevronRight, Plus,
  Sparkles, History, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { useLeadInteractions, type LeadInteraction } from "@/hooks/useLeadInteractions";
import { useQuotes } from "@/hooks/useQuotes";
import { toast } from "sonner";

const templates = [
  { id: "1", nome: "Boas-vindas", categoria: "Primeiro Contato", mensagem: "Olá {nome}! Tudo bem? 😊 Que bom receber seu contato! Como posso te ajudar hoje?" },
  { id: "2", nome: "Confirmação de Avaliação", categoria: "Agendamento", mensagem: "Olá {nome}! 📅 Confirmando sua avaliação. Confirma sua presença?" },
  { id: "3", nome: "Lembrete 24h", categoria: "Agendamento", mensagem: "Oi {nome}! 🔔 Lembrando que amanhã você tem um compromisso conosco. Estamos te esperando! 💜" },
  { id: "4", nome: "Pós-Procedimento", categoria: "Cuidados", mensagem: "Olá {nome}! Como você está se sentindo após o procedimento? 💜 Qualquer dúvida, estou aqui!" },
  { id: "5", nome: "Follow-up Orçamento", categoria: "Vendas", mensagem: "Oi {nome}! 😊 Passando para saber se você teve alguma dúvida sobre o orçamento que enviamos." },
  { id: "6", nome: "Recompra", categoria: "Fidelização", mensagem: "Olá {nome}! 💜 Já faz um tempinho desde o último procedimento. Que tal agendar uma avaliação?" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
  novo: { label: "Novo", bg: "bg-blue-100", text: "text-blue-700" },
  contatado: { label: "Contatado", bg: "bg-green-100", text: "text-green-700" },
  qualificado: { label: "Qualificado", bg: "bg-purple-100", text: "text-purple-700" },
  agendado: { label: "Agendado", bg: "bg-amber-100", text: "text-amber-700" },
  convertido: { label: "Convertido", bg: "bg-emerald-100", text: "text-emerald-700" },
  perdido: { label: "Perdido", bg: "bg-gray-100", text: "text-gray-700" },
};

const WhatsApp = () => {
  const [activeSection, setActiveSection] = useState("whatsapp");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();

  const { leads, isLoading: leadsLoading } = useLeads();
  const { quotes } = useQuotes();
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;
  const { interactions, isLoading: interactionsLoading, createInteraction } = useLeadInteractions(selectedLeadId || undefined);

  // Auto-select first lead
  useEffect(() => {
    if (!selectedLeadId && leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  const filteredLeads = leads.filter(l => {
    const matchStatus = filtroStatus === "todos" || l.status === filtroStatus;
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (l.interest || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getLastContactLabel = (lead: Lead) => {
    if (!lead.last_contact_at) return "Sem contato";
    const diff = Date.now() - new Date(lead.last_contact_at).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    return `${days} dias atrás`;
  };

  const handleSendMessage = async () => {
    if (!mensagem.trim() || !selectedLead) return;
    
    // Register the interaction
    await createInteraction.mutateAsync({
      lead_id: selectedLead.id,
      type: 'whatsapp',
      content: mensagem,
      direction: 'outbound',
    });

    // Open WhatsApp
    const phone = selectedLead.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(mensagem);
    window.open(`https://wa.me/55${phone}?text=${encodedMessage}`, "_blank");
    setMensagem("");
    toast.success("Interação registrada!");
  };

  const handlePhoneCall = async () => {
    if (!selectedLead) return;
    await createInteraction.mutateAsync({
      lead_id: selectedLead.id,
      type: 'phone',
      content: 'Ligação realizada',
      direction: 'outbound',
    });
    window.open(`tel:+55${selectedLead.phone.replace(/\D/g, '')}`, "_self");
  };

  const getLeadQuoteTotal = (leadId: string) => {
    const leadQuotes = quotes.filter(q => q.lead_id === leadId && (q.status === 'sent' || q.status === 'approved'));
    return leadQuotes.reduce((acc, q) => acc + Number(q.total), 0);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection} contentClassName="flex">
      <>
        {/* Lista de Leads */}
        <div className={cn("w-full md:w-96 border-r border-border flex flex-col bg-card shrink-0", isMobile && showChat && "hidden")}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">WhatsApp</h1>
                  <p className="text-xs text-muted-foreground">{leads.length} leads</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar lead..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex gap-2 mt-3 overflow-x-auto">
              {["todos", "novo", "contatado", "qualificado", "agendado"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                    filtroStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {status === "todos" ? "Todos" : statusLabels[status]?.label || status}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {leadsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhum lead encontrado
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => { setSelectedLeadId(lead.id); if (isMobile) setShowChat(true); }}
                  className={cn(
                    "p-4 border-b border-border cursor-pointer transition-all hover:bg-muted/50",
                    selectedLeadId === lead.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold shrink-0">
                      {lead.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground truncate">{lead.name}</h4>
                        <span className="text-xs text-muted-foreground">{getLastContactLabel(lead)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{lead.interest || 'Sem interesse definido'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn("px-2 py-0.5 text-[10px] font-medium rounded-full", statusLabels[lead.status]?.bg, statusLabels[lead.status]?.text)}>
                          {statusLabels[lead.status]?.label}
                        </span>
                        {getLeadQuoteTotal(lead.id) > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs font-medium text-primary">{formatCurrency(getLeadQuoteTotal(lead.id))}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat */}
        <div className={cn("flex-1 flex flex-col", isMobile && !showChat && "hidden")}>
          {selectedLead ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <Button variant="ghost" size="icon" onClick={() => setShowChat(false)} className="mr-1">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </Button>
                  )}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold">
                    {selectedLead.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-foreground">{selectedLead.name}</h2>
                      <span className={cn("px-2 py-0.5 text-[10px] font-medium rounded-full", statusLabels[selectedLead.status]?.bg, statusLabels[selectedLead.status]?.text)}>
                        {statusLabels[selectedLead.status]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedLead.interest || selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handlePhoneCall} title="Ligar">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Interactions */}
              <ScrollArea className="flex-1 p-4 bg-muted/30">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {interactionsLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : interactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      Nenhuma interação registrada. Envie uma mensagem para começar!
                    </div>
                  ) : (
                    interactions.map((interaction) => {
                      const isOut = interaction.direction === 'outbound';
                      const typeIcons: Record<string, string> = { whatsapp: '💬', phone: '📞', email: '📧', note: '📝' };
                      return (
                        <div key={interaction.id} className={cn("flex", isOut ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-md px-4 py-2 rounded-2xl",
                            isOut ? "bg-green-500 text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
                          )}>
                            <p className="text-sm">{typeIcons[interaction.type] || ''} {interaction.content}</p>
                            <div className={cn("flex items-center justify-end gap-1 mt-1", isOut ? "text-green-100" : "text-muted-foreground")}>
                              <span className="text-xs">
                                {new Date(interaction.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isOut && <CheckCheck className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Templates */}
              {showTemplates && (
                <div className="border-t border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-foreground">Templates Rápidos</h3>
                    <button onClick={() => setShowTemplates(false)} className="text-xs text-muted-foreground hover:text-foreground">Fechar</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        className="p-3 text-left rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all"
                        onClick={() => {
                          setMensagem(t.mensagem.replace('{nome}', selectedLead.name.split(' ')[0]));
                          setShowTemplates(false);
                        }}
                      >
                        <div className="text-xs font-medium text-foreground mb-1">{t.nome}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{t.mensagem.substring(0, 50)}...</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setShowTemplates(!showTemplates)}>
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite uma mensagem..."
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <button
                    className="p-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors text-white disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={createInteraction.isPending}
                  >
                    {createInteraction.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione um lead para começar
            </div>
          )}
        </div>

        {/* Context Panel */}
        {selectedLead && (
          <div className={cn("w-80 border-l border-border bg-card p-4 overflow-y-auto", isMobile && "hidden")}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                {selectedLead.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-semibold text-foreground">{selectedLead.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedLead.interest || 'Sem interesse definido'}</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Phone className="w-3 h-3" />
                  Telefone
                </div>
                <div className="font-medium text-foreground">{selectedLead.phone}</div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Tag className="w-3 h-3" />
                  Status
                </div>
                <span className={cn("px-2 py-1 text-xs font-medium rounded-full", statusLabels[selectedLead.status]?.bg, statusLabels[selectedLead.status]?.text)}>
                  {statusLabels[selectedLead.status]?.label}
                </span>
              </div>

              {selectedLead.source && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Star className="w-3 h-3" />
                    Origem
                  </div>
                  <div className="font-medium text-foreground">{selectedLead.source}</div>
                </div>
              )}

              {getLeadQuoteTotal(selectedLead.id) > 0 && (
                <div className="p-3 rounded-lg bg-revenue-recoverable-bg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <DollarSign className="w-3 h-3" />
                    Valor Orçamento
                  </div>
                  <div className="font-bold text-lg text-primary">{formatCurrency(getLeadQuoteTotal(selectedLead.id))}</div>
                </div>
              )}

              {selectedLead.notes && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <FileText className="w-3 h-3" />
                    Notas
                  </div>
                  <div className="text-sm text-foreground">{selectedLead.notes}</div>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ações Rápidas
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => window.location.href = '/agenda'}>
                    <Calendar className="w-4 h-4" />
                    Agendar Avaliação
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => window.location.href = '/orcamentos'}>
                    <FileText className="w-4 h-4" />
                    Ver Orçamentos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

export default WhatsApp;
