import { TrendingUp, TrendingDown, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricaReceitaProps {
  total: number;
  confirmada: number;
  emRisco: number;
  parada: number;
  recuperavel: number;
  variacao: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const MetricaReceita = ({
  total,
  confirmada,
  emRisco,
  parada,
  recuperavel,
  variacao
}: MetricaReceitaProps) => {
  const isPositive = variacao >= 0;

  return (
    <div className="card-premium p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Receita Potencial do Período</span>
          </div>
          <div className="metric-value-gold text-5xl">{formatCurrency(total)}</div>
          <div className={cn(
            "flex items-center gap-1 mt-3",
            isPositive ? "text-revenue-confirmed" : "text-revenue-lost"
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isPositive ? "+" : ""}{variacao}% vs. período anterior
            </span>
          </div>
        </div>
        
        <button className="btn-gold flex items-center gap-2 text-sm">
          Ver detalhes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-4 gap-4">
        <RevenueCard
          label="Confirmada"
          value={confirmada}
          percentage={total === 0 ? 0 : (confirmada / total) * 100}
          variant="confirmed"
        />
        <RevenueCard
          label="Em Risco"
          value={emRisco}
          percentage={total === 0 ? 0 : (emRisco / total) * 100}
          variant="at-risk"
          alert
        />
        <RevenueCard
          label="Parada em Leads"
          value={parada}
          percentage={total === 0 ? 0 : (parada / total) * 100}
          variant="paused"
        />
        <RevenueCard
          label="Recuperável"
          value={recuperavel}
          percentage={total === 0 ? 0 : (recuperavel / total) * 100}
          variant="recoverable"
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-3 rounded-full overflow-hidden flex bg-muted">
          <div 
            className="bg-revenue-confirmed transition-all duration-500"
            style={{ width: `${total === 0 ? 0 : (confirmada / total) * 100}%` }}
          />
          <div 
            className="bg-revenue-at-risk transition-all duration-500"
            style={{ width: `${total === 0 ? 0 : (emRisco / total) * 100}%` }}
          />
          <div 
            className="bg-revenue-paused transition-all duration-500"
            style={{ width: `${total === 0 ? 0 : (parada / total) * 100}%` }}
          />
          <div 
            className="bg-revenue-recoverable transition-all duration-500"
            style={{ width: `${total === 0 ? 0 : (recuperavel / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface RevenueCardProps {
  label: string;
  value: number;
  percentage: number;
  variant: 'confirmed' | 'at-risk' | 'paused' | 'recoverable';
  alert?: boolean;
}

const RevenueCard = ({ label, value, percentage, variant, alert }: RevenueCardProps) => {
  const variantClasses = {
    confirmed: "revenue-confirmed",
    "at-risk": "revenue-at-risk",
    paused: "revenue-paused",
    recoverable: "revenue-recoverable",
  };

  const dotColors = {
    confirmed: "bg-revenue-confirmed",
    "at-risk": "bg-revenue-at-risk",
    paused: "bg-revenue-paused",
    recoverable: "bg-revenue-recoverable",
  };

  return (
    <div className={cn("revenue-card relative", variantClasses[variant])}>
      {alert && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-revenue-at-risk animate-pulse" />
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("w-2 h-2 rounded-full", dotColors[variant])} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {formatCurrency(value)}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {percentage.toFixed(1)}% do total
      </div>
    </div>
  );
};
