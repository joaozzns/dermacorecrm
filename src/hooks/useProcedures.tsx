import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ProcedureCategory {
  id: string;
  clinic_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Procedure {
  id: string;
  clinic_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  duration_minutes: number;
  base_price: number;
  cost: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category?: ProcedureCategory;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  sort_order?: number;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateProcedureInput {
  name: string;
  category_id?: string;
  description?: string;
  duration_minutes?: number;
  base_price: number;
  cost?: number;
  notes?: string;
}

export interface UpdateProcedureInput {
  id: string;
  name?: string;
  category_id?: string | null;
  description?: string;
  duration_minutes?: number;
  base_price?: number;
  cost?: number | null;
  is_active?: boolean;
  notes?: string;
}

export function useProcedures() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['procedure-categories', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('procedure_categories')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as ProcedureCategory[];
    },
    enabled: !!profile?.clinic_id,
  });

  // Fetch procedures with category
  const { data: procedures = [], isLoading: proceduresLoading } = useQuery({
    queryKey: ['procedures', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('procedures')
        .select('*, category:procedure_categories(*)')
        .eq('clinic_id', profile.clinic_id)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Procedure[];
    },
    enabled: !!profile?.clinic_id,
  });

  // Category mutations
  const createCategory = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      const { data, error } = await supabase
        .from('procedure_categories')
        .insert({
          clinic_id: profile.clinic_id,
          name: input.name,
          description: input.description || null,
          icon: input.icon || null,
          sort_order: input.sort_order || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-categories'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar categoria: ' + error.message);
    }
  });

  const updateCategory = useMutation({
    mutationFn: async (input: UpdateCategoryInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('procedure_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-categories'] });
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar categoria: ' + error.message);
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('procedure_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-categories'] });
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      toast.success('Categoria removida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover categoria: ' + error.message);
    }
  });

  // Procedure mutations
  const createProcedure = useMutation({
    mutationFn: async (input: CreateProcedureInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      const { data, error } = await supabase
        .from('procedures')
        .insert({
          clinic_id: profile.clinic_id,
          name: input.name,
          category_id: input.category_id || null,
          description: input.description || null,
          duration_minutes: input.duration_minutes || 60,
          base_price: input.base_price,
          cost: input.cost || null,
          notes: input.notes || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      toast.success('Procedimento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar procedimento: ' + error.message);
    }
  });

  const updateProcedure = useMutation({
    mutationFn: async (input: UpdateProcedureInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('procedures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      toast.success('Procedimento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar procedimento: ' + error.message);
    }
  });

  const deleteProcedure = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
      toast.success('Procedimento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover procedimento: ' + error.message);
    }
  });

  return {
    categories,
    procedures,
    isLoading: categoriesLoading || proceduresLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createProcedure,
    updateProcedure,
    deleteProcedure
  };
}
