-- Create a security definer function to handle clinic creation
CREATE OR REPLACE FUNCTION public.create_clinic_for_user(p_clinic_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_clinic_id uuid;
  v_existing_clinic_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Usuário não autenticado');
  END IF;

  -- Check if user already has a clinic
  SELECT clinic_id INTO v_existing_clinic_id FROM public.profiles WHERE id = v_user_id;
  IF v_existing_clinic_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já está vinculado a uma clínica');
  END IF;

  -- Create the clinic
  INSERT INTO public.clinics (name) VALUES (p_clinic_name) RETURNING id INTO v_clinic_id;

  -- Update profile with clinic_id and admin role
  UPDATE public.profiles SET clinic_id = v_clinic_id, role = 'admin', updated_at = now() WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'clinic_id', v_clinic_id);
END;
$$;
