import { usePlanLimits } from "@/hooks/usePlanLimits";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, TrendingUp, Crown, AlertTriangle, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface UsageItemProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  max: number | null;
  percentage: number;
  isAtLimit: boolean;
}

const UsageItem = ({ icon, label, current, max, percentage, isAtLimit }: UsageItemProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-medium ${isAtLimit ? 'text-destructive' : 'text-foreground'}`}>
          {current}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">
          {max === null ? '∞' : max}
        </span>
        {isAtLimit && <AlertTriangle className="w-4 h-4 text-destructive" />}
      </div>
    </div>
    <Progress 
      value={max === null ? 0 : percentage} 
      className={`h-2 ${isAtLimit ? '[&>div]:bg-destructive' : ''}`}
    />
  </div>
);

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    trial: { label: 'Trial', variant: 'secondary' },
    active: { label: 'Ativo', variant: 'default' },
    past_due: { label: 'Pagamento pendente', variant: 'destructive' },
    canceled: { label: 'Cancelado', variant: 'outline' },
    expired: { label: 'Expirado', variant: 'destructive' },
  };

  const config = statusConfig[status] || statusConfig.trial;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPlanIcon = (planName: string) => {
  switch (planName.toLowerCase()) {
    case 'enterprise':
      return <Crown className="w-5 h-5 text-amber-500" />;
    case 'profissional':
      return <Zap className="w-5 h-5 text-primary" />;
    default:
      return <Zap className="w-5 h-5 text-muted-foreground" />;
  }
};

export const PlanUsageCard = () => {
  const { planLimits, usage, isLoading, isAtLimit, getUsagePercentage } = usePlanLimits();

  if (isLoading) {
    return (
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!planLimits || !usage) {
    return null;
  }

  const hasAnyLimit = isAtLimit('professionals') || isAtLimit('patients') || isAtLimit('leads');

  return (
    <div className="card-premium p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getPlanIcon(planLimits.planName)}
          <div>
            <h3 className="font-semibold text-foreground">Plano {planLimits.planName}</h3>
            {planLimits.daysRemaining > 0 && planLimits.subscriptionStatus !== 'active' && (
              <p className="text-xs text-muted-foreground">
                {planLimits.daysRemaining} dias restantes
              </p>
            )}
          </div>
        </div>
        {getStatusBadge(planLimits.subscriptionStatus)}
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4">
        <UsageItem
          icon={<Users className="w-4 h-4" />}
          label="Profissionais"
          current={usage.currentProfessionals}
          max={planLimits.maxProfessionals}
          percentage={getUsagePercentage('professionals')}
          isAtLimit={isAtLimit('professionals')}
        />
        <UsageItem
          icon={<UserCheck className="w-4 h-4" />}
          label="Pacientes"
          current={usage.currentPatients}
          max={planLimits.maxPatients}
          percentage={getUsagePercentage('patients')}
          isAtLimit={isAtLimit('patients')}
        />
        <UsageItem
          icon={<TrendingUp className="w-4 h-4" />}
          label="Leads este mês"
          current={usage.currentLeadsThisMonth}
          max={planLimits.maxLeadsPerMonth}
          percentage={getUsagePercentage('leads')}
          isAtLimit={isAtLimit('leads')}
        />
      </div>

      {/* Upgrade CTA */}
      {(hasAnyLimit || planLimits.subscriptionStatus === 'trial') && (
        <Link to="/configuracoes">
          <Button 
            className="w-full btn-gold text-white"
            size="sm"
          >
            <Crown className="w-4 h-4 mr-2" />
            {hasAnyLimit ? 'Fazer upgrade' : 'Ver planos'}
          </Button>
        </Link>
      )}
    </div>
  );
};