
-- Create content articles table for CMS
CREATE TABLE public.content_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES public.clinics(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  category text NOT NULL DEFAULT 'blog',
  content text NOT NULL DEFAULT '',
  excerpt text,
  cover_image_url text,
  author_id uuid REFERENCES auth.users(id),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read published articles (public content)
CREATE POLICY "Published articles are publicly readable"
ON public.content_articles
FOR SELECT
USING (is_published = true);

-- Admins can manage articles for their clinic
CREATE POLICY "Admins can manage their clinic articles"
ON public.content_articles
FOR ALL
TO authenticated
USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin')
WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Indexes
CREATE INDEX idx_content_articles_slug ON public.content_articles(slug);
CREATE INDEX idx_content_articles_category ON public.content_articles(category);
CREATE INDEX idx_content_articles_published ON public.content_articles(is_published, published_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_content_articles_updated_at
BEFORE UPDATE ON public.content_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
