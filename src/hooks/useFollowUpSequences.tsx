import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FollowUpSequence {
  id: string;
  clinic_id: string;
  name: string;
  description: string | null;
  type: string;
  steps_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSequenceInput {
  name: string;
  description?: string;
  type: string;
  steps_count?: number;
}

export function useFollowUpSequences() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: sequences = [], isLoading } = useQuery({
    queryKey: ['follow_up_sequences', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];

      const { data, error } = await supabase
        .from('follow_up_sequences' as any)
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown) as FollowUpSequence[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createSequence = useMutation({
    mutationFn: async (input: CreateSequenceInput) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');

      const { data, error } = await supabase
        .from('follow_up_sequences' as any)
        .insert({
          clinic_id: profile.clinic_id,
          name: input.name,
          description: input.description || null,
          type: input.type,
          steps_count: input.steps_count || 3,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow_up_sequences'] });
      toast.success('Sequência criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar sequência: ' + error.message);
    },
  });

  const toggleSequence = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('follow_up_sequences' as any)
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow_up_sequences'] });
      toast.success('Sequência atualizada!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar sequência: ' + error.message);
    },
  });

  const deleteSequence = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('follow_up_sequences' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow_up_sequences'] });
      toast.success('Sequência removida!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover sequência: ' + error.message);
    },
  });

  return { sequences, isLoading, createSequence, toggleSequence, deleteSequence };
}
