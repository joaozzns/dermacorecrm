import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNotifications } from './useNotifications';

const NOTIFICATION_SOUND_URL = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgkKu0markup';

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Pleasant notification chime - two tones
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.setValueAtTime(1108.73, audioCtx.currentTime + 0.1); // C#6
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.4);
  } catch {
    // Audio not available, silently ignore
  }
}

export function useRealtimeNotifications() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { createNotification } = useNotifications();
  const hasInitialized = useRef(false);

  const handleNewLead = useCallback((payload: any) => {
    const lead = payload.new as { name?: string; source?: string };
    const title = `Novo lead: ${lead.name || 'Sem nome'}`;
    const description = lead.source ? `Origem: ${lead.source}` : 'Lead cadastrado agora';

    toast.info(`🆕 ${title}`, { description, duration: 6000 });
    playNotificationSound();

    createNotification.mutate({
      type: 'new_lead',
      title,
      description,
      metadata: payload.new,
    });

    queryClient.invalidateQueries({ queryKey: ['leads'] });
  }, [createNotification, queryClient]);

  const handleAppointmentUpdate = useCallback((payload: any) => {
    const appt = payload.new as { status?: string; title?: string };
    if (appt.status === 'confirmado') {
      const title = `Agendamento confirmado: ${appt.title || ''}`;

      toast.success(`✅ ${title}`, { duration: 5000 });
      playNotificationSound();

      createNotification.mutate({
        type: 'appointment_confirmed',
        title,
        metadata: payload.new,
      });

      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  }, [createNotification, queryClient]);

  const handleNewAppointment = useCallback((payload: any) => {
    const appt = payload.new as { title?: string };
    const title = `Novo agendamento: ${appt.title || ''}`;

    toast.info(`📅 ${title}`, { duration: 5000 });
    playNotificationSound();

    createNotification.mutate({
      type: 'new_appointment',
      title,
      metadata: payload.new,
    });

    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  }, [createNotification, queryClient]);

  useEffect(() => {
    if (!profile?.clinic_id || hasInitialized.current) return;
    hasInitialized.current = true;

    const channel = supabase
      .channel('clinic-notifications-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads', filter: `clinic_id=eq.${profile.clinic_id}` },
        handleNewLead
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'appointments', filter: `clinic_id=eq.${profile.clinic_id}` },
        handleAppointmentUpdate
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments', filter: `clinic_id=eq.${profile.clinic_id}` },
        handleNewAppointment
      )
      .subscribe();

    return () => {
      hasInitialized.current = false;
      supabase.removeChannel(channel);
    };
  }, [profile?.clinic_id, handleNewLead, handleAppointmentUpdate, handleNewAppointment]);
}
