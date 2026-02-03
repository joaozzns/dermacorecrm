-- 1. Create enum for quote status
CREATE TYPE public.quote_status AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired');

-- 2. Create procedure_categories table
CREATE TABLE public.procedure_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create procedures table
CREATE TABLE public.procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.procedure_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  status public.quote_status NOT NULL DEFAULT 'draft',
  valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_quote_number_per_clinic UNIQUE (clinic_id, quote_number)
);

-- 5. Create quote_items table
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES public.procedures(id) ON DELETE SET NULL,
  procedure_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create indexes for better performance
CREATE INDEX idx_procedure_categories_clinic ON public.procedure_categories(clinic_id);
CREATE INDEX idx_procedures_clinic ON public.procedures(clinic_id);
CREATE INDEX idx_procedures_category ON public.procedures(category_id);
CREATE INDEX idx_quotes_clinic ON public.quotes(clinic_id);
CREATE INDEX idx_quotes_patient ON public.quotes(patient_id);
CREATE INDEX idx_quotes_lead ON public.quotes(lead_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quote_items_quote ON public.quote_items(quote_id);

-- 7. Create updated_at triggers
CREATE TRIGGER update_procedure_categories_updated_at
  BEFORE UPDATE ON public.procedure_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_procedures_updated_at
  BEFORE UPDATE ON public.procedures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create function to generate sequential quote numbers
CREATE OR REPLACE FUNCTION public.generate_quote_number(p_clinic_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year TEXT;
  v_next_seq INTEGER;
  v_quote_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(quote_number FROM 'ORC-' || v_year || '-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO v_next_seq
  FROM public.quotes
  WHERE clinic_id = p_clinic_id
    AND quote_number LIKE 'ORC-' || v_year || '-%';
  
  v_quote_number := 'ORC-' || v_year || '-' || LPAD(v_next_seq::TEXT, 4, '0');
  
  RETURN v_quote_number;
END;
$$;

-- 9. Enable RLS on all new tables
ALTER TABLE public.procedure_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies for procedure_categories
CREATE POLICY "Users can view categories in their clinic"
  ON public.procedure_categories FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can create categories"
  ON public.procedure_categories FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can update categories"
  ON public.procedure_categories FOR UPDATE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can delete categories"
  ON public.procedure_categories FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- 11. RLS Policies for procedures
CREATE POLICY "Users can view procedures in their clinic"
  ON public.procedures FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can create procedures"
  ON public.procedures FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can update procedures"
  ON public.procedures FOR UPDATE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can delete procedures"
  ON public.procedures FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- 12. RLS Policies for quotes
CREATE POLICY "Users can view quotes in their clinic"
  ON public.quotes FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Users can create quotes in their clinic"
  ON public.quotes FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic());

CREATE POLICY "Users can update quotes in their clinic"
  ON public.quotes FOR UPDATE
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can delete quotes"
  ON public.quotes FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- 13. RLS Policies for quote_items (access via quote's clinic)
CREATE POLICY "Users can view quote items for their clinic quotes"
  ON public.quote_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quotes q 
    WHERE q.id = quote_id AND q.clinic_id = get_my_clinic()
  ));

CREATE POLICY "Users can create quote items for their clinic quotes"
  ON public.quote_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quotes q 
    WHERE q.id = quote_id AND q.clinic_id = get_my_clinic()
  ));

CREATE POLICY "Users can update quote items for their clinic quotes"
  ON public.quote_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.quotes q 
    WHERE q.id = quote_id AND q.clinic_id = get_my_clinic()
  ));

CREATE POLICY "Users can delete quote items for their clinic quotes"
  ON public.quote_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.quotes q 
    WHERE q.id = quote_id AND q.clinic_id = get_my_clinic()
  ));