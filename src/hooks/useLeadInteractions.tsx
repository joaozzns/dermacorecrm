import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type InteractionType = 'whatsapp' | 'phone' | 'email' | 'note';
export type InteractionDirection = 'inbound' | 'outbound';

export interface LeadInteraction {
  id: string;
  clinic_id: string;
  lead_id: string;
  type: InteractionType;
  content: string;
  direction: InteractionDirection;
  created_by: string | null;
  created_at: string;
}

export interface CreateInteractionInput {
  lead_id: string;
  type: InteractionType;
  content: string;
  direction?: InteractionDirection;
}

export function useLeadInteractions(leadId?: string) {
  const { profile, session } = useAuth();
  const queryClient = useQueryClient();

  const { data: interactions = [], isLoading } = useQuery({
    queryKey: ['lead_interactions', profile?.clinic_id, leadId],
    queryFn: async () => {
      if (!profile?.clinic_id || !leadId) return [];

      const { data, error } = await supabase
        .from('lead_interactions' as any)
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data as unknown) as LeadInteraction[];
    },
    enabled: !!profile?.clinic_id && !!leadId,
  });

  const createInteraction = useMutation({
    mutationFn: async (input: CreateInteractionInput) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');

      const { data, error } = await supabase
        .from('lead_interactions' as any)
        .insert({
          clinic_id: profile.clinic_id,
          lead_id: input.lead_id,
          type: input.type,
          content: input.content,
          direction: input.direction || 'outbound',
          created_by: session?.user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update lead's last_contact_at
      await supabase
        .from('leads')
        .update({ last_contact_at: new Date().toISOString() })
        .eq('id', input.lead_id);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead_interactions'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao registrar interação: ' + error.message);
    },
  });

  return { interactions, isLoading, createInteraction };
}
