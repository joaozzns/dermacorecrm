import { Users, ArrowRight, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeads, Lead } from "@/hooks/useLeads";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EtapaPipeline {
  id: string;
  nome: string;
  cor: string;
  leads: Lead[];
}

const statusMap: Record<string, { nome: string; cor: string }> = {
  novo: { nome: "Novo Lead", cor: "stage-new" },
  contatado: { nome: "Contato Feito", cor: "stage-contacted" },
  qualificado: { nome: "Qualificado", cor: "stage-scheduled" },
  agendado: { nome: "Agendado", cor: "stage-sold" },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

// Demo leads data
const DEMO_LEADS: Lead[] = [
  { id: '1', name: 'Ana Silva', phone: '11999999999', status: 'novo', source: 'Instagram', interest: 'Harmonização Facial', clinic_id: '', created_at: new Date(Date.now() - 2*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '2', name: 'Carlos Santos', phone: '11999999998', status: 'novo', source: 'WhatsApp', interest: 'Botox', clinic_id: '', created_at: new Date(Date.now() - 5*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '3', name: 'Maria Oliveira', phone: '11999999997', status: 'contatado', source: 'Instagram', interest: 'Preenchimento Labial', clinic_id: '', created_at: new Date(Date.now() - 24*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '4', name: 'Sonya B.', phone: '11999999996', status: 'contatado', source: 'Indicação', interest: 'Limpeza de Pele', clinic_id: '', created_at: new Date(Date.now() - 48*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '5', name: 'Juliana Costa', phone: '11999999995', status: 'qualificado', source: 'Google', interest: 'Microagulhamento', clinic_id: '', created_at: new Date(Date.now() - 72*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '6', name: 'Patricia Mendes', phone: '11999999994', status: 'qualificado', source: 'Instagram', interest: 'Peeling Químico', clinic_id: '', created_at: new Date(Date.now() - 96*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '7', name: 'Fernanda Lima', phone: '11999999993', status: 'agendado', source: 'Indicação', interest: 'Harmonização Facial', clinic_id: '', created_at: new Date(Date.now() - 120*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
  { id: '8', name: 'Roberta N.', phone: '11999999992', status: 'agendado', source: 'WhatsApp', interest: 'Procedimento Estético', clinic_id: '', created_at: new Date(Date.now() - 140*3600000).toISOString(), updated_at: '', notes: null, email: null, assigned_to: null, last_contact_at: null },
];

export const PipelineLeads = ({ isDemo = false }: { isDemo?: boolean }) => {
  const { leads: realLeads, isLoading: realLoading } = useLeads();
  const navigate = useNavigate();

  const leads = isDemo ? DEMO_LEADS : realLeads;
  const isLoading = !isDemo && realLoading;

  // Only show active pipeline stages (exclude convertido/perdido)
  const activeLeads = leads.filter(l => !['convertido', 'perdido'].includes(l.status));

  const pipeline: EtapaPipeline[] = Object.entries(statusMap).map(([status, config]) => ({
    id: status,
    nome: config.nome,
    cor: config.cor,
    leads: activeLeads.filter(l => l.status === status),
  }));

  const totalLeads = activeLeads.length;

  if (isLoading) {
    return (
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pipeline de Leads</h2>
            <p className="text-sm text-muted-foreground">{totalLeads} leads ativos</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/leads")}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pipeline.map((etapa) => (
          <div key={etapa.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", etapa.cor)} />
                <span className="text-sm font-medium text-foreground">{etapa.nome}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {etapa.leads.length}
              </span>
            </div>

            <div className="space-y-2">
              {etapa.leads.length === 0 ? (
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground">Nenhum lead</p>
                </div>
              ) : (
                etapa.leads.slice(0, 3).map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))
              )}
              {etapa.leads.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{etapa.leads.length - 3} mais
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadCard = ({ lead }: { lead: Lead }) => {
  const timeAgo = formatDistanceToNow(new Date(lead.created_at), {
    addSuffix: false,
    locale: ptBR,
  });

  return (
    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group border border-transparent hover:border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {lead.name}
          </h4>
          <p className="text-xs text-muted-foreground">{lead.interest || "Sem interesse definido"}</p>
        </div>
        {lead.source && (
          <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
            {lead.source}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
