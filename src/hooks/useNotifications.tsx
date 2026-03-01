import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  clinic_id: string;
  type: 'new_lead' | 'appointment_confirmed' | 'new_appointment' | 'lead_cooling' | 'general';
  title: string;
  description: string | null;
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export function useNotifications() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as unknown) as Notification[];
    },
    enabled: !!profile?.clinic_id,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const createNotification = useMutation({
    mutationFn: async (input: { type: Notification['type']; title: string; description?: string; metadata?: Record<string, any> }) => {
      if (!profile?.clinic_id) return;
      const { error } = await supabase
        .from('notifications' as any)
        .insert({
          clinic_id: profile.clinic_id,
          type: input.type,
          title: input.title,
          description: input.description || null,
          metadata: input.metadata || {},
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!profile?.clinic_id) return;
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('clinic_id', profile.clinic_id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return { notifications, unreadCount, isLoading, createNotification, markAsRead, markAllAsRead };
}
