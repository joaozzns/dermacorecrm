import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado' | 'faltou';

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  professional_id: string | null;
  title: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patients?: {
    id: string;
    full_name: string;
    phone: string;
  };
  profiles?: {
    id: string;
    full_name: string;
  };
}

export interface CreateAppointmentInput {
  patient_id: string;
  professional_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  id: string;
  patient_id?: string;
  professional_id?: string;
  title?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export function useAppointments(date?: Date) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', profile?.clinic_id, date?.toISOString()],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients (id, full_name, phone),
          profiles (id, full_name)
        `)
        .eq('clinic_id', profile.clinic_id)
        .order('start_time', { ascending: true });
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createAppointment = useMutation({
    mutationFn: async (input: CreateAppointmentInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          clinic_id: profile.clinic_id,
          patient_id: input.patient_id,
          professional_id: input.professional_id || null,
          title: input.title,
          start_time: input.start_time,
          end_time: input.end_time,
          notes: input.notes || null,
          status: 'agendado' as AppointmentStatus
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar agendamento: ' + error.message);
    }
  });

  const updateAppointment = useMutation({
    mutationFn: async (input: UpdateAppointmentInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar agendamento: ' + error.message);
    }
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover agendamento: ' + error.message);
    }
  });

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}
