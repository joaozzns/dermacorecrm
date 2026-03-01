
-- Table: lead_interactions
CREATE TABLE public.lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('whatsapp', 'phone', 'email', 'note')),
  content text NOT NULL,
  direction text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions in their clinic"
  ON public.lead_interactions FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Users can create interactions in their clinic"
  ON public.lead_interactions FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic());

CREATE POLICY "Users can update interactions in their clinic"
  ON public.lead_interactions FOR UPDATE
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can delete interactions"
  ON public.lead_interactions FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Table: follow_up_sequences
CREATE TABLE public.follow_up_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'pos-avaliacao',
  steps_count integer NOT NULL DEFAULT 3,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.follow_up_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequences in their clinic"
  ON public.follow_up_sequences FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Users can create sequences in their clinic"
  ON public.follow_up_sequences FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic());

CREATE POLICY "Users can update sequences in their clinic"
  ON public.follow_up_sequences FOR UPDATE
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can delete sequences"
  ON public.follow_up_sequences FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Index for performance
CREATE INDEX idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX idx_lead_interactions_clinic_id ON public.lead_interactions(clinic_id);
CREATE INDEX idx_follow_up_sequences_clinic_id ON public.follow_up_sequences(clinic_id);
