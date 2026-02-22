import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  Check,
  User,
  Calendar,
  DollarSign,
  FileText,
  Image,
  Star,
  Tag,
  ChevronRight,
  Plus,
  Filter,
  Sparkles,
  Heart,
  History,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Conversa {
  id: string;
  paciente: string;
  avatar: string;
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  status: 'novo' | 'em-atendimento' | 'aguardando' | 'finalizado';
  etapaFunil: string;
  valorPotencial: number;
  procedimento: string;
  responsavel?: string;
}

interface Mensagem {
  id: string;
  tipo: 'enviada' | 'recebida';
  conteudo: string;
  horario: string;
  status: 'enviado' | 'entregue' | 'lido';
}

interface Template {
  id: string;
  nome: string;
  categoria: string;
  mensagem: string;
  variaveis: string[];
}

const conversas: Conversa[] = [
  { id: "1", paciente: "Ana Carolina Silva", avatar: "AC", ultimaMensagem: "Olá, gostaria de saber mais sobre harmonização facial", horario: "10:32", naoLidas: 2, status: "novo", etapaFunil: "Novo Lead", valorPotencial: 8500, procedimento: "Harmonização Facial" },
  { id: "2", paciente: "Fernanda Lima", avatar: "FL", ultimaMensagem: "Perfeito! Vou confirmar então para quinta", horario: "10:15", naoLidas: 0, status: "em-atendimento", etapaFunil: "Avaliação Agendada", valorPotencial: 15000, procedimento: "Lipoaspiração", responsavel: "Juliana" },
  { id: "3", paciente: "Patricia Mendes", avatar: "PM", ultimaMensagem: "Ainda estou pensando...", horario: "09:45", naoLidas: 0, status: "aguardando", etapaFunil: "Pós-Orçamento", valorPotencial: 5500, procedimento: "Botox + Preenchimento" },
  { id: "4", paciente: "Juliana Costa", avatar: "JC", ultimaMensagem: "Qual o valor do preenchimento labial?", horario: "09:20", naoLidas: 1, status: "novo", etapaFunil: "Novo Lead", valorPotencial: 3500, procedimento: "Preenchimento Labial" },
  { id: "5", paciente: "Maria Fernanda", avatar: "MF", ultimaMensagem: "Muito obrigada pelo atendimento!", horario: "Ontem", naoLidas: 0, status: "finalizado", etapaFunil: "Procedimento Realizado", valorPotencial: 1800, procedimento: "Botox" },
  { id: "6", paciente: "Beatriz Rocha", avatar: "BR", ultimaMensagem: "Posso parcelar em quantas vezes?", horario: "Ontem", naoLidas: 0, status: "em-atendimento", etapaFunil: "Orçamento Enviado", valorPotencial: 12000, procedimento: "Rinoplastia", responsavel: "Carla" },
  { id: "7", paciente: "Luciana Ferreira", avatar: "LF", ultimaMensagem: "Quero agendar minha avaliação", horario: "Ontem", naoLidas: 0, status: "aguardando", etapaFunil: "Contato Feito", valorPotencial: 4200, procedimento: "Bioestimulador" },
];

const mensagensConversaAtual: Mensagem[] = [
  { id: "1", tipo: "recebida", conteudo: "Olá! Boa tarde!", horario: "10:28", status: "lido" },
  { id: "2", tipo: "recebida", conteudo: "Gostaria de saber mais sobre harmonização facial. Vi o perfil de vocês no Instagram e achei os resultados incríveis!", horario: "10:28", status: "lido" },
  { id: "3", tipo: "enviada", conteudo: "Olá Ana! Tudo bem? 😊 Que bom que nos encontrou! A harmonização facial é um dos nossos procedimentos mais procurados.", horario: "10:30", status: "lido" },
  { id: "4", tipo: "enviada", conteudo: "Posso te explicar melhor como funciona. Você tem alguma região específica que gostaria de tratar?", horario: "10:30", status: "lido" },
  { id: "5", tipo: "recebida", conteudo: "Olá, gostaria de saber mais sobre harmonização facial", horario: "10:32", status: "lido" },
];

const templates: Template[] = [
  { id: "1", nome: "Boas-vindas", categoria: "Primeiro Contato", mensagem: "Olá {nome}! Tudo bem? 😊 Que bom receber seu contato! Sou {atendente} da Clínica Estética Plus. Como posso te ajudar hoje?", variaveis: ["nome", "atendente"] },
  { id: "2", nome: "Confirmação de Avaliação", categoria: "Agendamento", mensagem: "Olá {nome}! 📅 Confirmando sua avaliação para {data} às {horario} com {profissional}. Endereço: Rua Example, 123. Confirma sua presença?", variaveis: ["nome", "data", "horario", "profissional"] },
  { id: "3", nome: "Lembrete 24h", categoria: "Agendamento", mensagem: "Oi {nome}! 🔔 Lembrando que amanhã você tem um compromisso conosco às {horario}. Estamos te esperando! 💜", variaveis: ["nome", "horario"] },
  { id: "4", nome: "Pós-Procedimento", categoria: "Cuidados", mensagem: "Olá {nome}! Como você está se sentindo após o procedimento? 💜 Lembre-se dos cuidados que conversamos. Qualquer dúvida, estou aqui!", variaveis: ["nome"] },
  { id: "5", nome: "Follow-up Orçamento", categoria: "Vendas", mensagem: "Oi {nome}! 😊 Tudo bem? Passando para saber se você teve alguma dúvida sobre o orçamento que enviamos. Posso te ajudar com algo?", variaveis: ["nome"] },
  { id: "6", nome: "Recompra", categoria: "Fidelização", mensagem: "Olá {nome}! 💜 Já faz um tempinho desde o último procedimento. Que tal agendar uma avaliação para ver como está tudo? Temos novidades!", variaveis: ["nome"] },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

const WhatsApp = () => {
  const [activeSection, setActiveSection] = useState("whatsapp");
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa>(conversas[0]);
  const [mensagem, setMensagem] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();

  const conversasFiltradas = conversas.filter(c => {
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;
    const matchSearch = c.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.procedimento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const naoLidasTotal = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  const handleSendMessage = () => {
    if (!mensagem.trim()) return;
    const phone = "5511999990000";
    const encodedMessage = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    setMensagem("");
  };

  const handlePhoneCall = () => {
    window.open(`tel:+5511999990000`, "_self");
  };

  const handleVideoCall = () => {
    window.open(`https://meet.google.com/new`, "_blank");
  };

  const handleNewConversation = () => {
    window.open("https://wa.me/", "_blank");
  };

  const handleScheduleAppointment = () => {
    window.location.href = "/agenda";
  };

  const handleSendQuote = () => {
    const quoteMessage = `Olá ${conversaSelecionada.paciente}! Segue o orçamento para ${conversaSelecionada.procedimento}: ${formatCurrency(conversaSelecionada.valorPotencial)}`;
    setMensagem(quoteMessage);
  };

  const handleMarkVIP = () => {
    // Mark as VIP logic - just show feedback for now
    alert(`${conversaSelecionada.paciente} marcado como VIP!`);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection} contentClassName="flex">
      <>
        {/* Lista de Conversas */}
        <div className={cn("w-full md:w-96 border-r border-border flex flex-col bg-card shrink-0", isMobile && showChat && "hidden")}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">WhatsApp</h1>
                  <p className="text-xs text-muted-foreground">{naoLidasTotal} não lidas</p>
                </div>
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNewConversation}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex gap-2 mt-3">
              {["todos", "novo", "em-atendimento", "aguardando"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                    filtroStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {status === "todos" ? "Todos" : status === "novo" ? "Novos" : status === "em-atendimento" ? "Em atendimento" : "Aguardando"}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <ScrollArea className="flex-1">
            {conversasFiltradas.map((conversa) => (
              <ConversaItem
                key={conversa.id}
                conversa={conversa}
                selecionada={conversaSelecionada.id === conversa.id}
                onClick={() => {
                  setConversaSelecionada(conversa);
                  if (isMobile) setShowChat(true);
                }}
              />
            ))}
          </ScrollArea>
        </div>

        {/* Chat Principal */}
        <div className={cn("flex-1 flex flex-col", isMobile && !showChat && "hidden")}>
          {/* Header do Chat */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setShowChat(false)} className="mr-1">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </Button>
              )}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold">
                {conversaSelecionada.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground">{conversaSelecionada.paciente}</h2>
                  <StatusBadge status={conversaSelecionada.status} />
                </div>
                <p className="text-xs text-muted-foreground">{conversaSelecionada.procedimento}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePhoneCall} title="Ligar">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleVideoCall} title="Videochamada">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Mais opções">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mensagens */}
          <ScrollArea className="flex-1 p-4 bg-muted/30">
            <div className="space-y-4 max-w-3xl mx-auto">
              {mensagensConversaAtual.map((msg) => (
                <MensagemBubble key={msg.id} mensagem={msg} />
              ))}
            </div>
          </ScrollArea>

          {/* Templates Quick Access */}
          {showTemplates && (
            <div className="border-t border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">Templates Rápidos</h3>
                <button onClick={() => setShowTemplates(false)} className="text-xs text-muted-foreground hover:text-foreground">
                  Fechar
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {templates.slice(0, 6).map((template) => (
                  <button
                    key={template.id}
                    className="p-3 text-left rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all"
                    onClick={() => {
                      setMensagem(template.mensagem);
                      setShowTemplates(false);
                    }}
                  >
                    <div className="text-xs font-medium text-foreground mb-1">{template.nome}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{template.mensagem.substring(0, 50)}...</div>
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
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Smile className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <button 
                className="p-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors text-white"
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Painel de Contexto do Paciente */}
        <div className={cn("w-80 border-l border-border bg-card p-4 overflow-y-auto", isMobile && "hidden")}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
              {conversaSelecionada.avatar}
            </div>
            <h3 className="font-semibold text-foreground">{conversaSelecionada.paciente}</h3>
            <p className="text-sm text-muted-foreground">{conversaSelecionada.procedimento}</p>
          </div>

          {/* Informações do Lead */}
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Tag className="w-3 h-3" />
                Etapa do Funil
              </div>
              <div className="font-medium text-foreground">{conversaSelecionada.etapaFunil}</div>
            </div>

            <div className="p-3 rounded-lg bg-revenue-recoverable-bg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <DollarSign className="w-3 h-3" />
                Valor Potencial
              </div>
              <div className="font-bold text-lg text-primary">{formatCurrency(conversaSelecionada.valorPotencial)}</div>
            </div>

            {conversaSelecionada.responsavel && (
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <User className="w-3 h-3" />
                  Responsável
                </div>
                <div className="font-medium text-foreground">{conversaSelecionada.responsavel}</div>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Histórico
              </h4>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-muted/50 text-xs">
                  <div className="text-muted-foreground">14/01 10:32</div>
                  <div className="text-foreground">Primeiro contato via Instagram</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-xs">
                  <div className="text-muted-foreground">14/01 10:30</div>
                  <div className="text-foreground">Respondido por Juliana</div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ações Rápidas
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleScheduleAppointment}>
                  <Calendar className="w-4 h-4" />
                  Agendar Avaliação
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleSendQuote}>
                  <FileText className="w-4 h-4" />
                  Enviar Orçamento
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleMarkVIP}>
                  <Star className="w-4 h-4" />
                  Marcar como VIP
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
};

interface ConversaItemProps {
  conversa: Conversa;
  selecionada: boolean;
  onClick: () => void;
}

const ConversaItem = ({ conversa, selecionada, onClick }: ConversaItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b border-border cursor-pointer transition-all hover:bg-muted/50",
        selecionada && "bg-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold">
            {conversa.avatar}
          </div>
          {conversa.naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
              {conversa.naoLidas}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-foreground truncate">{conversa.paciente}</h4>
            <span className="text-xs text-muted-foreground">{conversa.horario}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{conversa.ultimaMensagem}</p>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={conversa.status} small />
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-primary">{formatCurrency(conversa.valorPotencial)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: Conversa['status'];
  small?: boolean;
}

const StatusBadge = ({ status, small }: StatusBadgeProps) => {
  const config = {
    novo: { bg: "bg-blue-100", text: "text-blue-700", label: "Novo" },
    "em-atendimento": { bg: "bg-green-100", text: "text-green-700", label: "Em atendimento" },
    aguardando: { bg: "bg-amber-100", text: "text-amber-700", label: "Aguardando" },
    finalizado: { bg: "bg-gray-100", text: "text-gray-700", label: "Finalizado" },
  };

  const c = config[status];

  return (
    <span className={cn(
      "font-medium rounded-full",
      c.bg, c.text,
      small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
    )}>
      {c.label}
    </span>
  );
};

interface MensagemBubbleProps {
  mensagem: Mensagem;
}

const MensagemBubble = ({ mensagem }: MensagemBubbleProps) => {
  const isEnviada = mensagem.tipo === "enviada";

  return (
    <div className={cn("flex", isEnviada ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-md px-4 py-2 rounded-2xl",
        isEnviada 
          ? "bg-green-500 text-white rounded-br-sm" 
          : "bg-card border border-border text-foreground rounded-bl-sm"
      )}>
        <p className="text-sm">{mensagem.conteudo}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1",
          isEnviada ? "text-green-100" : "text-muted-foreground"
        )}>
          <span className="text-xs">{mensagem.horario}</span>
          {isEnviada && (
            mensagem.status === "lido" ? (
              <CheckCheck className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;
