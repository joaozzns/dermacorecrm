import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ClinicInfo {
  id: string;
  name: string;
  legal_name: string | null;
  cnpj: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  instagram: string | null;
  facebook: string | null;
  business_hours: string | null;
  logo_url: string | null;
}

export interface NotificationPreferences {
  emailNovoLead: boolean;
  emailAgendamento: boolean;
  emailNoShow: boolean;
  pushNovoLead: boolean;
  pushLembrete: boolean;
  pushInadimplencia: boolean;
  whatsappConfirmacao: boolean;
  whatsappLembrete24h: boolean;
  whatsappLembrete2h: boolean;
  whatsappPosProcedimento: boolean;
}

export interface AgendaPreferences {
  duracaoPadrao: string;
  intervaloMinimo: string;
  antecedenciaMinima: string;
  confirmacaoAutomatica: boolean;
  lembreteAutomatico: boolean;
  permitirRemarcacao: boolean;
  limiteDesmarcacao: string;
}

const defaultNotifications: NotificationPreferences = {
  emailNovoLead: true,
  emailAgendamento: true,
  emailNoShow: true,
  pushNovoLead: true,
  pushLembrete: true,
  pushInadimplencia: false,
  whatsappConfirmacao: true,
  whatsappLembrete24h: true,
  whatsappLembrete2h: true,
  whatsappPosProcedimento: true,
};

const defaultAgenda: AgendaPreferences = {
  duracaoPadrao: "60",
  intervaloMinimo: "15",
  antecedenciaMinima: "2",
  confirmacaoAutomatica: true,
  lembreteAutomatico: true,
  permitirRemarcacao: true,
  limiteDesmarcacao: "24",
};

export function useClinicSettings() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: clinic, isLoading: isLoadingClinic } = useQuery({
    queryKey: ['clinic', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return null;
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', profile.clinic_id)
        .maybeSingle();
      if (error) throw error;
      return data as ClinicInfo | null;
    },
    enabled: !!profile?.clinic_id,
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['clinic_settings', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return null;
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.clinic_id,
  });

  const notificationPreferences: NotificationPreferences = {
    ...defaultNotifications,
    ...(settings?.notification_preferences as Partial<NotificationPreferences> || {}),
  };

  const agendaPreferences: AgendaPreferences = {
    ...defaultAgenda,
    ...(settings?.agenda_preferences as Partial<AgendaPreferences> || {}),
  };

  const updateClinicInfo = useMutation({
    mutationFn: async (updates: Partial<Omit<ClinicInfo, 'id'>>) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');
      const { error } = await supabase
        .from('clinics')
        .update(updates)
        .eq('id', profile.clinic_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      toast.success('Dados da clínica salvos com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao salvar dados: ' + error.message);
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: { notification_preferences?: NotificationPreferences; agenda_preferences?: AgendaPreferences }) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');

      const payload = {
        clinic_id: profile.clinic_id,
        notification_preferences: (updates.notification_preferences ?? {}) as unknown as Json,
        agenda_preferences: (updates.agenda_preferences ?? {}) as unknown as Json,
      };

      // Upsert: insert if not exists, update if exists
      const { error } = await supabase
        .from('clinic_settings')
        .upsert([payload], { onConflict: 'clinic_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_settings'] });
      toast.success('Preferências salvas com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao salvar preferências: ' + error.message);
    },
  });

  return {
    clinic,
    notificationPreferences,
    agendaPreferences,
    isLoading: isLoadingClinic || isLoadingSettings,
    updateClinicInfo,
    updateSettings,
  };
}
