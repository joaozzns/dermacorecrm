import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  DollarSign,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Star,
  TrendingUp,
  Instagram,
  Globe,
  Share2,
  User,
  ChevronDown,
  ArrowRight,
  Sparkles
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

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  procedimento: string;
  valorPotencial: number;
  origem: 'instagram' | 'facebook' | 'google' | 'indicacao' | 'whatsapp' | 'site';
  etapa: string;
  tempoParado: string;
  score: number;
  ultimoContato?: string;
  responsavel?: string;
  observacoes?: string;
}

interface EtapaPipeline {
  id: string;
  nome: string;
  cor: string;
  bgCor: string;
}

const etapas: EtapaPipeline[] = [
  { id: "novo", nome: "Novo Lead", cor: "bg-blue-500", bgCor: "bg-blue-50" },
  { id: "contato", nome: "Contato Feito", cor: "bg-purple-500", bgCor: "bg-purple-50" },
  { id: "avaliacao", nome: "Avaliação Agendada", cor: "bg-amber-500", bgCor: "bg-amber-50" },
  { id: "vendido", nome: "Procedimento Vendido", cor: "bg-emerald-500", bgCor: "bg-emerald-50" },
  { id: "realizado", nome: "Procedimento Realizado", cor: "bg-teal-600", bgCor: "bg-teal-50" },
  { id: "pos", nome: "Pós Procedimento", cor: "bg-cyan-500", bgCor: "bg-cyan-50" },
];

const leadsData: Lead[] = [
  { id: "1", nome: "Ana Carolina Silva", email: "ana@email.com", telefone: "(11) 99999-1234", procedimento: "Harmonização Facial", valorPotencial: 8500, origem: "instagram", etapa: "novo", tempoParado: "2h", score: 92 },
  { id: "2", nome: "Carla Santos Oliveira", email: "carla@email.com", telefone: "(11) 98888-5678", procedimento: "Botox", valorPotencial: 2500, origem: "whatsapp", etapa: "novo", tempoParado: "5h", score: 78 },
  { id: "3", nome: "Juliana Costa", email: "juliana@email.com", telefone: "(11) 97777-9012", procedimento: "Preenchimento Labial", valorPotencial: 3500, origem: "google", etapa: "novo", tempoParado: "1d", score: 65 },
  { id: "4", nome: "Maria Oliveira", email: "maria@email.com", telefone: "(11) 96666-3456", procedimento: "Skinbooster", valorPotencial: 1800, origem: "facebook", etapa: "contato", tempoParado: "3h", score: 85 },
  { id: "5", nome: "Patricia Mendes", email: "patricia@email.com", telefone: "(11) 95555-7890", procedimento: "Bioestimulador", valorPotencial: 4200, origem: "indicacao", etapa: "contato", tempoParado: "1d", score: 88 },
  { id: "6", nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(11) 94444-1234", procedimento: "Lipoaspiração", valorPotencial: 15000, origem: "instagram", etapa: "avaliacao", tempoParado: "2d", score: 95 },
  { id: "7", nome: "Beatriz Rocha", email: "beatriz@email.com", telefone: "(11) 93333-5678", procedimento: "Rinoplastia", valorPotencial: 12000, origem: "google", etapa: "avaliacao", tempoParado: "1d", score: 72 },
  { id: "8", nome: "Luciana Ferreira", email: "luciana@email.com", telefone: "(11) 92222-9012", procedimento: "Harmonização Facial", valorPotencial: 9500, origem: "instagram", etapa: "vendido", tempoParado: "4h", score: 98 },
  { id: "9", nome: "Amanda Costa", email: "amanda@email.com", telefone: "(11) 91111-3456", procedimento: "Botox + Preenchimento", valorPotencial: 5500, origem: "indicacao", etapa: "vendido", tempoParado: "2d", score: 90 },
  { id: "10", nome: "Gabriela Santos", email: "gabriela@email.com", telefone: "(11) 90000-7890", procedimento: "Peeling", valorPotencial: 1200, origem: "site", etapa: "realizado", tempoParado: "5d", score: 100 },
  { id: "11", nome: "Isabela Martins", email: "isabela@email.com", telefone: "(11) 89999-1234", procedimento: "Limpeza de Pele", valorPotencial: 350, origem: "whatsapp", etapa: "pos", tempoParado: "7d", score: 100 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

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
  const [activeSection, setActiveSection] = useState("leads");
  const [filtroOrigem, setFiltroOrigem] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState(leadsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getLeadsByEtapa = (etapaId: string) => {
    return leads.filter(lead => {
      const matchEtapa = lead.etapa === etapaId;
      const matchOrigem = filtroOrigem === "todos" || lead.origem === filtroOrigem;
      const matchSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.procedimento.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEtapa && matchOrigem && matchSearch;
    });
  };

  const getValorTotalEtapa = (etapaId: string) => {
    return getLeadsByEtapa(etapaId).reduce((acc, lead) => acc + lead.valorPotencial, 0);
  };

  const totalLeads = leads.length;
  const valorTotal = leads.reduce((acc, lead) => acc + lead.valorPotencial, 0);
  const leadsNovos = leads.filter(l => l.etapa === "novo").length;
  const taxaConversao = Math.round((leads.filter(l => l.etapa === "vendido" || l.etapa === "realizado" || l.etapa === "pos").length / totalLeads) * 100);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (etapaId: string) => {
    if (draggedLead) {
      setLeads(prev => prev.map(lead => 
        lead.id === draggedLead.id ? { ...lead, etapa: etapaId } : lead
      ));
      setDraggedLead(null);
    }
  };

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
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Nome do lead" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" placeholder="(11) 99999-9999" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@exemplo.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="procedimento">Procedimento de Interesse</Label>
                      <Input id="procedimento" placeholder="Ex: Harmonização Facial" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="valor">Valor Potencial</Label>
                        <Input id="valor" type="number" placeholder="R$ 0,00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="origem">Origem</Label>
                        <Select>
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
                    </div>
                    <Button className="w-full btn-premium text-white">
                      Cadastrar Lead
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
              <div className="text-xs text-revenue-confirmed mt-1">+12 esta semana</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Valor Potencial Total</span>
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-gradient-gold">{formatCurrency(valorTotal)}</div>
            </div>
            
            <div className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Leads Novos (48h)</span>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{leadsNovos}</div>
              <div className="text-xs text-revenue-at-risk mt-1">Ação necessária</div>
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
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(getValorTotalEtapa(etapa.id))}
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
  const scoreColor = lead.score >= 80 ? "text-revenue-confirmed" : lead.score >= 60 ? "text-revenue-at-risk" : "text-revenue-paused";
  const scoreBg = lead.score >= 80 ? "bg-revenue-confirmed-bg" : lead.score >= 60 ? "bg-revenue-at-risk-bg" : "bg-revenue-paused-bg";

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="card-premium p-4 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {lead.nome}
          </h4>
          <p className="text-sm text-muted-foreground truncate">{lead.procedimento}</p>
        </div>
        <div className={cn("px-2 py-1 rounded-lg text-xs font-bold", scoreBg, scoreColor)}>
          {lead.score}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {origemIcons[lead.origem]}
          <span>{origemLabels[lead.origem]}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{lead.tempoParado}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-semibold text-primary">
          <DollarSign className="w-4 h-4" />
          <span>{formatCurrency(lead.valorPotencial)}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="WhatsApp">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Ligar">
            <Phone className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Email">
            <Mail className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Agendar">
            <Calendar className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
