import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  Users, 
  Plus, 
  Search, 
  Clock,
  DollarSign,
  MessageCircle,
  Phone,
  Mail,
  TrendingUp,
  Instagram,
  Globe,
  Share2,
  User,
  Sparkles,
  Loader2
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLeads, Lead, LeadStatus } from "@/hooks/useLeads";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EtapaPipeline {
  id: LeadStatus;
  nome: string;
  cor: string;
  bgCor: string;
}

const etapas: EtapaPipeline[] = [
  { id: "novo", nome: "Novo Lead", cor: "bg-blue-500", bgCor: "bg-blue-50" },
  { id: "contatado", nome: "Contato Feito", cor: "bg-purple-500", bgCor: "bg-purple-50" },
  { id: "qualificado", nome: "Qualificado", cor: "bg-amber-500", bgCor: "bg-amber-50" },
  { id: "agendado", nome: "Agendado", cor: "bg-emerald-500", bgCor: "bg-emerald-50" },
  { id: "convertido", nome: "Convertido", cor: "bg-teal-600", bgCor: "bg-teal-50" },
  { id: "perdido", nome: "Perdido", cor: "bg-red-500", bgCor: "bg-red-50" },
];

const origemIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4 text-pink-500" />,
  facebook: <Share2 className="w-4 h-4 text-blue-600" />,
  google: <Globe className="w-4 h-4 text-red-500" />,
  indicacao: <User className="w-4 h-4 text-purple-500" />,
  whatsapp: <MessageCircle className="w-4 h-4 text-green-500" />,
  site: <Globe className="w-4 h-4 text-gray-500" />,
};

const origemLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  indicacao: "Indicação",
  whatsapp: "WhatsApp",
  site: "Site",
};

const Leads = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { leads, isLoading, createLead, updateLead } = useLeads();
  
  const [activeSection, setActiveSection] = useState("leads");
  const [filtroOrigem, setFiltroOrigem] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInterest, setFormInterest] = useState("");
  const [formSource, setFormSource] = useState("");

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  // Show message if user doesn't have a clinic
  if (!authLoading && user && !profile?.clinic_id) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Configure sua clínica</h2>
            <p className="text-muted-foreground mb-4">
              Você precisa estar vinculado a uma clínica para gerenciar leads.
            </p>
            <Button onClick={() => navigate("/configuracoes")}>
              Ir para Configurações
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getLeadsByEtapa = (etapaId: LeadStatus) => {
    return leads.filter(lead => {
      const matchEtapa = lead.status === etapaId;
      const matchOrigem = filtroOrigem === "todos" || lead.source === filtroOrigem;
      const matchSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (lead.interest?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      return matchEtapa && matchOrigem && matchSearch;
    });
  };

  const totalLeads = leads.length;
  const leadsNovos = leads.filter(l => l.status === "novo").length;
  const leadsConvertidos = leads.filter(l => l.status === "convertido").length;
  const taxaConversao = totalLeads > 0 ? Math.round((leadsConvertidos / totalLeads) * 100) : 0;

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (etapaId: LeadStatus) => {
    if (draggedLead && draggedLead.status !== etapaId) {
      updateLead.mutate({ id: draggedLead.id, status: etapaId });
      setDraggedLead(null);
    }
  };

  const handleCreateLead = async () => {
    if (!formName || !formPhone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    
    await createLead.mutateAsync({
      name: formName,
      phone: formPhone,
      email: formEmail || undefined,
      interest: formInterest || undefined,
      source: formSource || undefined,
    });
    
    // Reset form
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormInterest("");
    setFormSource("");
    setIsDialogOpen(false);
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Leads</h1>
                <p className="text-sm text-muted-foreground">Gerencie e converta seus leads em clientes</p>
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
              
              <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas origens</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="btn-premium flex items-center gap-2 text-white text-sm py-2">
                    <Plus className="w-4 h-4" />
                    Novo Lead
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Lead</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input 
                        id="nome" 
                        placeholder="Nome do lead" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input 
                          id="telefone" 
                          placeholder="(11) 99999-9999" 
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="email@exemplo.com" 
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="procedimento">Procedimento de Interesse</Label>
                      <Input 
                        id="procedimento" 
                        placeholder="Ex: Harmonização Facial" 
                        value={formInterest}
                        onChange={(e) => setFormInterest(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origem">Origem</Label>
                      <Select value={formSource} onValueChange={setFormSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="indicacao">Indicação</SelectItem>
                          <SelectItem value="site">Site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full btn-premium text-white" 
                      onClick={handleCreateLead}
                      disabled={createLead.isPending}
                    >
                      {createLead.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar Lead"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total de Leads</span>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalLeads}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Leads Novos</span>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{leadsNovos}</div>
              {leadsNovos > 0 && (
                <div className="text-xs text-revenue-at-risk mt-1">Ação necessária</div>
              )}
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Convertidos</span>
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-revenue-confirmed">{leadsConvertidos}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                <TrendingUp className="w-5 h-5 text-revenue-confirmed" />
              </div>
              <div className="text-2xl font-bold text-revenue-confirmed">{taxaConversao}%</div>
              <div className="text-xs text-muted-foreground mt-1">Meta: 35%</div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {etapas.map((etapa) => (
                <div 
                  key={etapa.id}
                  className="w-80 flex-shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(etapa.id)}
                >
                  {/* Etapa Header */}
                  <div className={cn("rounded-t-xl p-4", etapa.bgCor)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-3 h-3 rounded-full", etapa.cor)} />
                        <span className="font-semibold text-foreground">{etapa.nome}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-white/80 px-2 py-0.5 rounded-full">
                        {getLeadsByEtapa(etapa.id).length}
                      </span>
                    </div>
                  </div>

                  {/* Lead Cards */}
                  <div className="bg-muted/30 rounded-b-xl p-3 space-y-3 min-h-[400px] border border-t-0 border-border">
                    {getLeadsByEtapa(etapa.id).map((lead) => (
                      <LeadCard 
                        key={lead.id} 
                        lead={lead} 
                        onDragStart={() => handleDragStart(lead)}
                      />
                    ))}
                    
                    {getLeadsByEtapa(etapa.id).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhum lead nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface LeadCardProps {
  lead: Lead;
  onDragStart: () => void;
}

const LeadCard = ({ lead, onDragStart }: LeadCardProps) => {
  const tempoParado = lead.updated_at 
    ? formatDistanceToNow(new Date(lead.updated_at), { addSuffix: false, locale: ptBR })
    : "recente";

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="card-premium p-4 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {lead.name}
          </h4>
          {lead.interest && (
            <p className="text-sm text-muted-foreground truncate">{lead.interest}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        {lead.source && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {origemIcons[lead.source] || <Globe className="w-4 h-4" />}
            <span>{origemLabels[lead.source] || lead.source}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{tempoParado}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">{lead.phone}</span>
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
            title="WhatsApp"
            onClick={() => {
              const msg = encodeURIComponent(`Olá ${lead.name}! Tudo bem?`);
              window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
            }}
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
          </button>
          <button 
            className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
            title="Ligar"
            onClick={() => window.open(`tel:${lead.phone}`, "_self")}
          >
            <Phone className="w-4 h-4 text-blue-600" />
          </button>
          {lead.email && (
            <button 
              className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
              title="Email"
              onClick={() => {
                const subject = encodeURIComponent(`Contato - ${lead.interest || "Procedimento"}`);
                window.open(`mailto:${lead.email}?subject=${subject}`, "_self");
              }}
            >
              <Mail className="w-4 h-4 text-purple-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
