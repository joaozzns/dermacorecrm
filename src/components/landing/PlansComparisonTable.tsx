import { Check, X } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  max_professionals: number | null;
  max_patients: number | null;
  max_leads_per_month: number | null;
}

interface PlansComparisonTableProps {
  plans: Plan[];
}

type FeatureValue = boolean | string | number | null;

interface FeatureRow {
  name: string;
  essencial: FeatureValue;
  profissional: FeatureValue;
  enterprise: FeatureValue;
}

interface FeatureCategory {
  category: string;
  features: FeatureRow[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatLimit = (value: number | null) => {
  if (value === null) return "Ilimitado";
  return value.toLocaleString("pt-BR");
};

const getComparisonData = (plans: Plan[]): FeatureCategory[] => {
  const essencial = plans.find((p) => p.slug === "essencial");
  const profissional = plans.find((p) => p.slug === "profissional");
  const enterprise = plans.find((p) => p.slug === "enterprise");

  return [
    {
      category: "Limites",
      features: [
        {
          name: "Profissionais",
          essencial: formatLimit(essencial?.max_professionals ?? 2),
          profissional: formatLimit(profissional?.max_professionals ?? 5),
          enterprise: formatLimit(enterprise?.max_professionals ?? null),
        },
        {
          name: "Pacientes",
          essencial: formatLimit(essencial?.max_patients ?? 500),
          profissional: formatLimit(profissional?.max_patients ?? 2000),
          enterprise: formatLimit(enterprise?.max_patients ?? null),
        },
        {
          name: "Leads por mês",
          essencial: formatLimit(essencial?.max_leads_per_month ?? 50),
          profissional: formatLimit(profissional?.max_leads_per_month ?? 200),
          enterprise: formatLimit(enterprise?.max_leads_per_month ?? null),
        },
      ],
    },
    {
      category: "Agenda & Pacientes",
      features: [
        { name: "Agenda online ilimitada", essencial: true, profissional: true, enterprise: true },
        { name: "Gestão de pacientes", essencial: true, profissional: true, enterprise: true },
        { name: "Lembretes WhatsApp", essencial: true, profissional: true, enterprise: true },
        { name: "Histórico completo", essencial: true, profissional: true, enterprise: true },
      ],
    },
    {
      category: "Marketing & Vendas",
      features: [
        { name: "IA para conversão de leads", essencial: false, profissional: true, enterprise: true },
        { name: "Automações WhatsApp", essencial: false, profissional: true, enterprise: true },
        { name: "Fotos antes/depois", essencial: false, profissional: true, enterprise: true },
        { name: "CRM de leads", essencial: true, profissional: true, enterprise: true },
      ],
    },
    {
      category: "Gestão Financeira",
      features: [
        { name: "Relatórios básicos", essencial: true, profissional: true, enterprise: true },
        { name: "Relatórios avançados", essencial: false, profissional: true, enterprise: true },
        { name: "Controle financeiro completo", essencial: false, profissional: true, enterprise: true },
        { name: "Metas por profissional", essencial: false, profissional: true, enterprise: true },
      ],
    },
    {
      category: "Suporte & Integrações",
      features: [
        { name: "Suporte por email", essencial: true, profissional: true, enterprise: true },
        { name: "Suporte prioritário", essencial: false, profissional: true, enterprise: true },
        { name: "Multi-unidades", essencial: false, profissional: false, enterprise: true },
        { name: "API personalizada", essencial: false, profissional: false, enterprise: true },
        { name: "Integrações customizadas", essencial: false, profissional: false, enterprise: true },
        { name: "Gerente de conta dedicado", essencial: false, profissional: false, enterprise: true },
        { name: "Treinamento presencial", essencial: false, profissional: false, enterprise: true },
        { name: "SLA garantido", essencial: false, profissional: false, enterprise: true },
      ],
    },
  ];
};

const FeatureCell = ({ value, isPopular }: { value: FeatureValue; isPopular: boolean }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={cn("w-5 h-5 mx-auto", isPopular ? "text-primary" : "text-green-500")} />
    ) : (
      <X className="w-5 h-5 mx-auto text-muted-foreground/40" />
    );
  }

  return (
    <span className={cn("font-medium", isPopular && "text-primary")}>
      {value}
    </span>
  );
};

export const PlansComparisonTable = ({ plans }: PlansComparisonTableProps) => {
  const comparisonData = getComparisonData(plans);

  const essencial = plans.find((p) => p.slug === "essencial");
  const profissional = plans.find((p) => p.slug === "profissional");
  const enterprise = plans.find((p) => p.slug === "enterprise");

  return (
    <ScrollReveal className="mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Compare todos os recursos
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Veja em detalhes o que cada plano oferece para sua clínica
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-[240px] bg-muted/30 font-semibold text-foreground">
                Recurso
              </TableHead>
              <TableHead className="text-center bg-muted/30 min-w-[140px]">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{essencial?.name || "Essencial"}</p>
                  <p className="text-sm text-muted-foreground">
                    {essencial ? formatCurrency(essencial.price_monthly) : "R$ 197"}/mês
                  </p>
                </div>
              </TableHead>
              <TableHead className="text-center bg-primary/10 min-w-[160px] relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                  Mais Popular
                </Badge>
                <div className="space-y-1 pt-2">
                  <p className="font-semibold text-primary">{profissional?.name || "Profissional"}</p>
                  <p className="text-sm text-primary/80">
                    {profissional ? formatCurrency(profissional.price_monthly) : "R$ 397"}/mês
                  </p>
                </div>
              </TableHead>
              <TableHead className="text-center bg-muted/30 min-w-[140px]">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{enterprise?.name || "Enterprise"}</p>
                  <p className="text-sm text-muted-foreground">
                    {enterprise ? formatCurrency(enterprise.price_monthly) : "R$ 797"}/mês
                  </p>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((category) => (
              <>
                <TableRow key={category.category} className="bg-muted/20 hover:bg-muted/30">
                  <TableCell
                    colSpan={4}
                    className="font-semibold text-sm uppercase tracking-wide text-muted-foreground py-3"
                  >
                    {category.category}
                  </TableCell>
                </TableRow>
                {category.features.map((feature) => (
                  <TableRow key={feature.name} className="hover:bg-muted/10">
                    <TableCell className="font-medium text-foreground">
                      {feature.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <FeatureCell value={feature.essencial} isPopular={false} />
                    </TableCell>
                    <TableCell className="text-center bg-primary/5">
                      <FeatureCell value={feature.profissional} isPopular={true} />
                    </TableCell>
                    <TableCell className="text-center">
                      <FeatureCell value={feature.enterprise} isPopular={false} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollReveal>
  );
};
