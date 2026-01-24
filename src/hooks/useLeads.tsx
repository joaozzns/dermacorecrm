import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePlanLimits } from './usePlanLimits';
import { toast } from 'sonner';

export type LeadStatus = 'novo' | 'contatado' | 'qualificado' | 'agendado' | 'convertido' | 'perdido';

export interface Lead {
  id: string;
  clinic_id: string;
  name: string;
  email: string | null;
  phone: string;
  status: LeadStatus;
  source: string | null;
  interest: string | null;
  notes: string | null;
  assigned_to: string | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  name: string;
  email?: string;
  phone: string;
  source?: string;
  interest?: string;
  notes?: string;
}

export interface UpdateLeadInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  source?: string;
  interest?: string;
  notes?: string;
  assigned_to?: string;
  last_contact_at?: string;
}

export function useLeads() {
  const { profile } = useAuth();
  const { isAtLimit } = usePlanLimits();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createLead = useMutation({
    mutationFn: async (input: CreateLeadInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      if (isAtLimit('leads')) {
        throw new Error('Limite de leads do mês atingido. Faça upgrade do seu plano para continuar.');
      }
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          clinic_id: profile.clinic_id,
          name: input.name,
          email: input.email || null,
          phone: input.phone,
          source: input.source || null,
          interest: input.interest || null,
          notes: input.notes || null,
          status: 'novo' as LeadStatus
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar lead: ' + error.message);
    }
  });

  const updateLead = useMutation({
    mutationFn: async (input: UpdateLeadInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar lead: ' + error.message);
    }
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover lead: ' + error.message);
    }
  });

  return {
    leads,
    isLoading,
    error,
    createLead,
    updateLead,
    deleteLead
  };
}
