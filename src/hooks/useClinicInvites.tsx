import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ClinicInvite {
  id: string;
  clinic_id: string;
  invite_code: string;
  created_by: string;
  role: 'admin' | 'staff';
  is_active: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
}

export function useClinicInvites() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['clinic_invites', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      const { data, error } = await supabase
        .from('clinic_invites')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClinicInvite[];
    },
    enabled: !!profile?.clinic_id && profile?.role === 'admin',
  });

  const createInvite = useMutation({
    mutationFn: async (params: { role?: 'admin' | 'staff'; max_uses?: number; expires_in_days?: number }) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica vinculada');
      const payload: {
        clinic_id: string;
        created_by: string;
        role: 'admin' | 'staff';
        max_uses?: number;
        expires_at?: string;
      } = {
        clinic_id: profile.clinic_id,
        created_by: profile.id,
        role: params.role || 'staff',
      };
      if (params.max_uses) payload.max_uses = params.max_uses;
      if (params.expires_in_days) {
        const expires = new Date();
        expires.setDate(expires.getDate() + params.expires_in_days);
        payload.expires_at = expires.toISOString();
      }
      const { data, error } = await supabase
        .from('clinic_invites')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data as ClinicInvite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_invites'] });
      toast.success('Link de convite criado!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar convite: ' + error.message);
    },
  });

  const deactivateInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('clinic_invites')
        .update({ is_active: false })
        .eq('id', inviteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_invites'] });
      toast.success('Convite desativado');
    },
    onError: (error: Error) => {
      toast.error('Erro: ' + error.message);
    },
  });

  const acceptInvite = useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data, error } = await supabase.rpc('accept_clinic_invite', { p_invite_code: inviteCode });
      if (error) throw error;
      const result = data as unknown as { success: boolean; error?: string; clinic_id?: string };
      if (!result.success) throw new Error(result.error || 'Erro ao aceitar convite');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      toast.success('Convite aceito! Você foi vinculado à clínica.');
      // Reload to refresh profile
      window.location.reload();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { invites, isLoading, createInvite, deactivateInvite, acceptInvite };
}
