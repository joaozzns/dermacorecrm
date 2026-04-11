import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Article {
  id: string;
  clinic_id: string | null;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  tags: string[] | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  is_published?: boolean;
  tags?: string[];
  sort_order?: number;
}

export function useArticles(category?: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', profile?.clinic_id, category],
    queryFn: async () => {
      if (!profile?.clinic_id) return [];
      let query = supabase
        .from('content_articles')
        .select('*')
        .eq('clinic_id', profile.clinic_id)
        .order('created_at', { ascending: false });
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
    enabled: !!profile?.clinic_id,
  });

  const createArticle = useMutation({
    mutationFn: async (input: ArticleInput) => {
      if (!profile?.clinic_id) throw new Error('Sem clínica');
      const { data, error } = await supabase
        .from('content_articles')
        .insert({
          clinic_id: profile.clinic_id,
          author_id: profile.id,
          title: input.title,
          slug: input.slug,
          category: input.category,
          content: input.content,
          excerpt: input.excerpt || null,
          cover_image_url: input.cover_image_url || null,
          is_published: input.is_published || false,
          published_at: input.is_published ? new Date().toISOString() : null,
          tags: input.tags || [],
          sort_order: input.sort_order || 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo criado com sucesso!');
    },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const updateArticle = useMutation({
    mutationFn: async ({ id, ...input }: ArticleInput & { id: string }) => {
      const updates: Record<string, unknown> = { ...input };
      if (input.is_published) updates.published_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('content_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo atualizado!');
    },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('content_articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Artigo removido!');
    },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  return { articles, isLoading, createArticle, updateArticle, deleteArticle };
}
