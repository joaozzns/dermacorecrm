
CREATE TABLE public.automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'boas-vindas',
  trigger_event text NOT NULL DEFAULT 'novo_lead',
  delay_hours integer NOT NULL DEFAULT 0,
  message_template text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT 'whatsapp',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automations" ON public.automations FOR SELECT USING (clinic_id = get_my_clinic());
CREATE POLICY "Admins can create automations" ON public.automations FOR INSERT WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');
CREATE POLICY "Admins can update automations" ON public.automations FOR UPDATE USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');
CREATE POLICY "Admins can delete automations" ON public.automations FOR DELETE USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
