import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Automation {
  id: string;
  clinic_id: string;
  name: string;
  type: string;
  trigger_event: string;
  delay_hours: number;
  message_template: string;
  channel: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAutomationInput {
  name: string;
  type: string;
  trigger_event: string;
  delay_hours: number;
  message_template: string;
  channel: string;
}

export function useAutomations() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ['automations', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      const { data, error } = await supabase
        .from('automations' as any)
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as unknown) as Automation[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createAutomation = useMutation({
    mutationFn: async (input: CreateAutomationInput) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');
      const { data, error } = await supabase
        .from('automations' as any)
        .insert({ clinic_id: profile.clinic_id, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automação criada com sucesso!');
    },
    onError: (error: Error) => toast.error('Erro ao criar automação: ' + error.message),
  });

  const updateAutomation = useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateAutomationInput> & { id: string }) => {
      const { error } = await supabase
        .from('automations' as any)
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automação atualizada!');
    },
    onError: (error: Error) => toast.error('Erro ao atualizar: ' + error.message),
  });

  const toggleAutomation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('automations' as any)
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Status atualizado!');
    },
    onError: (error: Error) => toast.error('Erro ao atualizar: ' + error.message),
  });

  const deleteAutomation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('automations' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automação removida!');
    },
    onError: (error: Error) => toast.error('Erro ao remover: ' + error.message),
  });

  return { automations, isLoading, createAutomation, updateAutomation, toggleAutomation, deleteAutomation };
}
