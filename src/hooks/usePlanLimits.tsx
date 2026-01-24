import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PlanLimits {
  planName: string;
  maxProfessionals: number | null;
  maxPatients: number | null;
  maxLeadsPerMonth: number | null;
  features: string[];
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';
  daysRemaining: number;
}

interface UsageData {
  currentProfessionals: number;
  currentPatients: number;
  currentLeadsThisMonth: number;
}

export const usePlanLimits = () => {
  const { user, profile } = useAuth();

  const { data: planLimits, isLoading: isLoadingPlan } = useQuery({
    queryKey: ['plan-limits', profile?.clinic_id],
    queryFn: async (): Promise<PlanLimits | null> => {
      if (!profile?.clinic_id) return null;

      const { data, error } = await supabase.rpc('get_clinic_plan_limits');
      
      if (error || !data || data.length === 0) {
        // Return default trial plan if no subscription
        return {
          planName: 'Trial',
          maxProfessionals: 2,
          maxPatients: 50,
          maxLeadsPerMonth: 10,
          features: ['Funcionalidades básicas'],
          subscriptionStatus: 'trial',
          daysRemaining: 7,
        };
      }

      const plan = data[0];
      return {
        planName: plan.plan_name,
        maxProfessionals: plan.max_professionals,
        maxPatients: plan.max_patients,
        maxLeadsPerMonth: plan.max_leads_per_month,
        features: plan.features as string[],
        subscriptionStatus: plan.subscription_status,
        daysRemaining: plan.days_remaining,
      };
    },
    enabled: !!user && !!profile?.clinic_id,
  });

  const { data: usage, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['plan-usage', profile?.clinic_id],
    queryFn: async (): Promise<UsageData> => {
      if (!profile?.clinic_id) {
        return { currentProfessionals: 0, currentPatients: 0, currentLeadsThisMonth: 0 };
      }

      const [professionalsRes, patientsRes, leadsRes] = await Promise.all([
        supabase
          .from('team_members')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('patients')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      return {
        currentProfessionals: professionalsRes.count ?? 0,
        currentPatients: patientsRes.count ?? 0,
        currentLeadsThisMonth: leadsRes.count ?? 0,
      };
    },
    enabled: !!user && !!profile?.clinic_id,
  });

  const isAtLimit = (type: 'professionals' | 'patients' | 'leads') => {
    if (!planLimits || !usage) return false;

    switch (type) {
      case 'professionals':
        return planLimits.maxProfessionals !== null && 
               usage.currentProfessionals >= planLimits.maxProfessionals;
      case 'patients':
        return planLimits.maxPatients !== null && 
               usage.currentPatients >= planLimits.maxPatients;
      case 'leads':
        return planLimits.maxLeadsPerMonth !== null && 
               usage.currentLeadsThisMonth >= planLimits.maxLeadsPerMonth;
      default:
        return false;
    }
  };

  const getUsagePercentage = (type: 'professionals' | 'patients' | 'leads') => {
    if (!planLimits || !usage) return 0;

    switch (type) {
      case 'professionals':
        if (planLimits.maxProfessionals === null) return 0;
        return Math.min(100, (usage.currentProfessionals / planLimits.maxProfessionals) * 100);
      case 'patients':
        if (planLimits.maxPatients === null) return 0;
        return Math.min(100, (usage.currentPatients / planLimits.maxPatients) * 100);
      case 'leads':
        if (planLimits.maxLeadsPerMonth === null) return 0;
        return Math.min(100, (usage.currentLeadsThisMonth / planLimits.maxLeadsPerMonth) * 100);
      default:
        return 0;
    }
  };

  return {
    planLimits,
    usage,
    isLoading: isLoadingPlan || isLoadingUsage,
    isAtLimit,
    getUsagePercentage,
  };
};