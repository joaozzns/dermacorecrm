import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePlanLimits } from './usePlanLimits';
import { toast } from 'sonner';

export interface Patient {
  id: string;
  clinic_id: string;
  full_name: string;
  email: string | null;
  phone: string;
  birth_date: string | null;
  cpf: string | null;
  address: string | null;
  medical_history: string | null;
  notes: string | null;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientInput {
  full_name: string;
  email?: string;
  phone: string;
  birth_date?: string;
  cpf?: string;
  address?: string;
  medical_history?: string;
  notes?: string;
  lead_id?: string;
}

export interface UpdatePatientInput {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  cpf?: string;
  address?: string;
  medical_history?: string;
  notes?: string;
}

export function usePatients() {
  const { profile } = useAuth();
  const { isAtLimit } = usePlanLimits();
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data as Patient[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createPatient = useMutation({
    mutationFn: async (input: CreatePatientInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      if (isAtLimit('patients')) {
        throw new Error('Limite de pacientes atingido. Faça upgrade do seu plano para continuar.');
      }
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          clinic_id: profile.clinic_id,
          full_name: input.full_name,
          email: input.email || null,
          phone: input.phone,
          birth_date: input.birth_date || null,
          cpf: input.cpf || null,
          address: input.address || null,
          medical_history: input.medical_history || null,
          notes: input.notes || null,
          lead_id: input.lead_id || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar paciente: ' + error.message);
    }
  });

  const updatePatient = useMutation({
    mutationFn: async (input: UpdatePatientInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar paciente: ' + error.message);
    }
  });

  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover paciente: ' + error.message);
    }
  });

  return {
    patients,
    isLoading,
    error,
    createPatient,
    updatePatient,
    deletePatient
  };
}
