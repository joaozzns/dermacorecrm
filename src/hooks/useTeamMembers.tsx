import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePlanLimits } from './usePlanLimits';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  clinic_id: string;
  profile_id: string | null;
  specialty: string | null;
  registration_number: string | null;
  work_schedule: {
    horarios?: string[];
    diasTrabalho?: string[];
  } | null;
  monthly_goal: number | null;
  current_revenue: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: 'admin' | 'staff';
  };
}

export interface CreateTeamMemberInput {
  profile_id?: string;
  specialty?: string;
  registration_number?: string;
  work_schedule?: {
    horarios?: string[];
    diasTrabalho?: string[];
  };
  monthly_goal?: number;
}

export interface UpdateTeamMemberInput {
  id: string;
  specialty?: string;
  registration_number?: string;
  work_schedule?: {
    horarios?: string[];
    diasTrabalho?: string[];
  };
  monthly_goal?: number;
  current_revenue?: number;
  is_active?: boolean;
}

export function useTeamMembers() {
  const { profile } = useAuth();
  const { isAtLimit } = usePlanLimits();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['team_members', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles (id, full_name, avatar_url, role)
        `)
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createTeamMember = useMutation({
    mutationFn: async (input: CreateTeamMemberInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      if (isAtLimit('professionals')) {
        throw new Error('Limite de profissionais atingido. Faça upgrade do seu plano para continuar.');
      }
      
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          clinic_id: profile.clinic_id,
          profile_id: input.profile_id || null,
          specialty: input.specialty || null,
          registration_number: input.registration_number || null,
          work_schedule: input.work_schedule || null,
          monthly_goal: input.monthly_goal || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast.success('Profissional cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao cadastrar profissional: ' + error.message);
    }
  });

  const updateTeamMember = useMutation({
    mutationFn: async (input: UpdateTeamMemberInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast.success('Profissional atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar profissional: ' + error.message);
    }
  });

  const deleteTeamMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast.success('Profissional removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover profissional: ' + error.message);
    }
  });

  return {
    teamMembers,
    isLoading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
}
