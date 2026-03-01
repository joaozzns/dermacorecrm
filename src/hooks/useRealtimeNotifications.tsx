import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRealtimeNotifications() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile?.clinic_id) return;

    const channel = supabase
      .channel('clinic-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `clinic_id=eq.${profile.clinic_id}`,
        },
        (payload) => {
          const lead = payload.new as { name?: string; source?: string };
          toast.info(`🆕 Novo lead: ${lead.name || 'Sem nome'}`, {
            description: lead.source ? `Origem: ${lead.source}` : 'Lead cadastrado agora',
            duration: 6000,
          });
          queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `clinic_id=eq.${profile.clinic_id}`,
        },
        (payload) => {
          const appt = payload.new as { status?: string; title?: string };
          if (appt.status === 'confirmado') {
            toast.success(`✅ Agendamento confirmado: ${appt.title || ''}`, {
              duration: 5000,
            });
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `clinic_id=eq.${profile.clinic_id}`,
        },
        (payload) => {
          const appt = payload.new as { title?: string };
          toast.info(`📅 Novo agendamento: ${appt.title || ''}`, {
            duration: 5000,
          });
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.clinic_id, queryClient]);
}
