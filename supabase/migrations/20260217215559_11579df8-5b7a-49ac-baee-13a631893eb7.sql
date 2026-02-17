
-- Allow authenticated users to create a clinic (only if they don't have one yet)
CREATE POLICY "Users without clinic can create one"
ON public.clinics
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()) IS NULL
);

-- Create clinic_invites table for invite links
CREATE TABLE public.clinic_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  invite_code text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_by uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'staff',
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer DEFAULT NULL,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_invites ENABLE ROW LEVEL SECURITY;

-- Only admins of the clinic can manage invites
CREATE POLICY "Admins can view clinic invites"
ON public.clinic_invites
FOR SELECT
TO authenticated
USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can create clinic invites"
ON public.clinic_invites
FOR INSERT
TO authenticated
WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can update clinic invites"
ON public.clinic_invites
FOR UPDATE
TO authenticated
USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can delete clinic invites"
ON public.clinic_invites
FOR DELETE
TO authenticated
USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Anyone authenticated can read an invite by code (for accepting)
CREATE POLICY "Anyone can read active invites by code"
ON public.clinic_invites
FOR SELECT
TO authenticated
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Trigger for updated_at
CREATE TRIGGER update_clinic_invites_updated_at
BEFORE UPDATE ON public.clinic_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to accept an invite
CREATE OR REPLACE FUNCTION public.accept_clinic_invite(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_profile RECORD;
BEGIN
  -- Check user profile
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid();
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Perfil não encontrado');
  END IF;
  IF v_profile.clinic_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já está vinculado a uma clínica');
  END IF;

  -- Find and validate invite
  SELECT * INTO v_invite FROM public.clinic_invites
  WHERE invite_code = p_invite_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR used_count < max_uses);
  
  IF v_invite IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Convite inválido ou expirado');
  END IF;

  -- Update profile with clinic and role
  UPDATE public.profiles
  SET clinic_id = v_invite.clinic_id, role = v_invite.role, updated_at = now()
  WHERE id = auth.uid();

  -- Increment used count
  UPDATE public.clinic_invites
  SET used_count = used_count + 1
  WHERE id = v_invite.id;

  RETURN jsonb_build_object('success', true, 'clinic_id', v_invite.clinic_id);
END;
$$;
