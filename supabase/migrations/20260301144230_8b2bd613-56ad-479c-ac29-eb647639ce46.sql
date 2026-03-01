
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_lead', 'appointment_confirmed', 'new_appointment', 'lead_cooling', 'general')),
  title text NOT NULL,
  description text,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notifications in their clinic"
  ON public.notifications FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Users can insert notifications in their clinic"
  ON public.notifications FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic());

CREATE POLICY "Users can update notifications in their clinic"
  ON public.notifications FOR UPDATE
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can delete notifications"
  ON public.notifications FOR DELETE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE INDEX idx_notifications_clinic_id ON public.notifications(clinic_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(clinic_id, is_read);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
