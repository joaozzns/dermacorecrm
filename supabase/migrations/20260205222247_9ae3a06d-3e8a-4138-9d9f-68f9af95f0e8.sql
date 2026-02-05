
-- Expand clinics table
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS legal_name text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS cnpj text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS business_hours text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS logo_url text;

-- Create clinic_settings table
CREATE TABLE public.clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL UNIQUE REFERENCES public.clinics(id) ON DELETE CASCADE,
  notification_preferences jsonb NOT NULL DEFAULT '{}',
  agenda_preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their clinic settings"
  ON public.clinic_settings FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can update their clinic settings"
  ON public.clinic_settings FOR UPDATE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can insert their clinic settings"
  ON public.clinic_settings FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE TRIGGER update_clinic_settings_updated_at
  BEFORE UPDATE ON public.clinic_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
