import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface QuoteItem {
  id: string;
  quote_id: string;
  procedure_id: string | null;
  procedure_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  clinic_id: string;
  quote_number: string;
  patient_id: string | null;
  lead_id: string | null;
  status: QuoteStatus;
  valid_until: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  payment_terms: string | null;
  notes: string | null;
  created_by: string | null;
  sent_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
  patient?: { id: string; full_name: string; phone: string } | null;
  lead?: { id: string; name: string; phone: string } | null;
}

export interface CreateQuoteItemInput {
  procedure_id?: string;
  procedure_name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

export interface CreateQuoteInput {
  patient_id?: string;
  lead_id?: string;
  valid_until?: string;
  discount_percent?: number;
  discount_amount?: number;
  payment_terms?: string;
  notes?: string;
  items: CreateQuoteItemInput[];
}

export interface UpdateQuoteInput {
  id: string;
  status?: QuoteStatus;
  valid_until?: string;
  discount_percent?: number;
  discount_amount?: number;
  payment_terms?: string;
  notes?: string;
  sent_at?: string;
  approved_at?: string;
}

export function useQuotes() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading, error } = useQuery({
    queryKey: ['quotes', profile?.clinic_id],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          items:quote_items(*),
          patient:patients(id, full_name, phone),
          lead:leads(id, name, phone)
        `)
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!profile?.clinic_id,
  });

  const generateQuoteNumber = async (clinicId: string): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_quote_number', {
      p_clinic_id: clinicId
    });
    
    if (error) throw error;
    return data as string;
  };

  const createQuote = useMutation({
    mutationFn: async (input: CreateQuoteInput) => {
      if (!profile?.clinic_id) throw new Error('Usuário não está vinculado a uma clínica');
      
      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const discountPercent = input.discount_percent || 0;
      const discountAmount = input.discount_amount || (subtotal * discountPercent / 100);
      const total = subtotal - discountAmount;
      
      // Generate quote number
      const quoteNumber = await generateQuoteNumber(profile.clinic_id);
      
      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          clinic_id: profile.clinic_id,
          quote_number: quoteNumber,
          patient_id: input.patient_id || null,
          lead_id: input.lead_id || null,
          valid_until: input.valid_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          total,
          payment_terms: input.payment_terms || null,
          notes: input.notes || null,
          created_by: profile.id
        })
        .select()
        .single();
      
      if (quoteError) throw quoteError;
      
      // Create quote items
      const itemsToInsert = input.items.map(item => ({
        quote_id: quote.id,
        procedure_id: item.procedure_id || null,
        procedure_name: item.procedure_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        notes: item.notes || null
      }));
      
      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
      
      return quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar orçamento: ' + error.message);
    }
  });

  const updateQuote = useMutation({
    mutationFn: async (input: UpdateQuoteInput) => {
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar orçamento: ' + error.message);
    }
  });

  const sendQuote = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ 
          status: 'sent' as QuoteStatus,
          sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento marcado como enviado!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao enviar orçamento: ' + error.message);
    }
  });

  const approveQuote = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ 
          status: 'approved' as QuoteStatus,
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento aprovado!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao aprovar orçamento: ' + error.message);
    }
  });

  const rejectQuote = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' as QuoteStatus })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento rejeitado.');
    },
    onError: (error: Error) => {
      toast.error('Erro ao rejeitar orçamento: ' + error.message);
    }
  });

  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover orçamento: ' + error.message);
    }
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    sendQuote,
    approveQuote,
    rejectQuote,
    deleteQuote
  };
}
