import { Users, ArrowRight, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  nome: string;
  procedimento: string;
  valorPotencial: number;
  tempoParado: string;
  origem: string;
}

interface EtapaPipeline {
  id: string;
  nome: string;
  cor: string;
  leads: Lead[];
  valorTotal: number;
}

const pipeline: EtapaPipeline[] = [
  {
    id: "novo",
    nome: "Novo Lead",
    cor: "stage-new",
    valorTotal: 25000,
    leads: [
      { id: "1", nome: "Ana Silva", procedimento: "Harmonização Facial", valorPotencial: 8500, tempoParado: "2h", origem: "Instagram" },
      { id: "2", nome: "Carla Santos", procedimento: "Botox", valorPotencial: 2500, tempoParado: "5h", origem: "WhatsApp" },
    ]
  },
  {
    id: "contato",
    nome: "Contato Feito",
    cor: "stage-contacted",
    valorTotal: 18000,
    leads: [
      { id: "3", nome: "Maria Oliveira", procedimento: "Preenchimento Labial", valorPotencial: 3500, tempoParado: "1d", origem: "Google" },
    ]
  },
  {
    id: "avaliacao",
    nome: "Avaliação Agendada",
    cor: "stage-scheduled",
    valorTotal: 42000,
    leads: [
      { id: "4", nome: "Juliana Costa", procedimento: "Lipoaspiração", valorPotencial: 15000, tempoParado: "3d", origem: "Indicação" },
      { id: "5", nome: "Patricia Mendes", procedimento: "Rinoplastia", valorPotencial: 12000, tempoParado: "2d", origem: "Facebook" },
    ]
  },
  {
    id: "vendido",
    nome: "Procedimento Vendido",
    cor: "stage-sold",
    valorTotal: 28500,
    leads: [
      { id: "6", nome: "Fernanda Lima", procedimento: "Harmonização", valorPotencial: 9500, tempoParado: "1d", origem: "Instagram" },
    ]
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const PipelineLeads = () => {
  const totalLeads = pipeline.reduce((acc, etapa) => acc + etapa.leads.length, 0);
  const valorTotal = pipeline.reduce((acc, etapa) => acc + etapa.valorTotal, 0);

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pipeline de Leads</h2>
            <p className="text-sm text-muted-foreground">{totalLeads} leads • {formatCurrency(valorTotal)} potencial</p>
          </div>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {pipeline.map((etapa, index) => (
          <div key={etapa.id} className="space-y-3">
            {/* Etapa Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", etapa.cor)} />
                <span className="text-sm font-medium text-foreground">{etapa.nome}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {etapa.leads.length}
              </span>
            </div>
            
            {/* Valor da Etapa */}
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(etapa.valorTotal)}
            </div>

            {/* Lead Cards */}
            <div className="space-y-2">
              {etapa.leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LeadCardProps {
  lead: Lead;
}

const LeadCard = ({ lead }: LeadCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group border border-transparent hover:border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {lead.nome}
          </h4>
          <p className="text-xs text-muted-foreground">{lead.procedimento}</p>
        </div>
        <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
          {lead.origem}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{lead.tempoParado}</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-primary">
          <DollarSign className="w-3 h-3" />
          <span>{formatCurrency(lead.valorPotencial)}</span>
        </div>
      </div>
    </div>
  );
};
