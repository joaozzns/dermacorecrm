
CREATE OR REPLACE FUNCTION public.accept_clinic_invite(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_profile RECORD;
  v_max_professionals integer;
  v_current_count integer;
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

  -- Check plan professional limit
  SELECT p.max_professionals INTO v_max_professionals
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.clinic_id = v_invite.clinic_id
    AND s.status IN ('active', 'trial')
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_max_professionals IS NOT NULL THEN
    SELECT count(*) INTO v_current_count
    FROM team_members
    WHERE clinic_id = v_invite.clinic_id AND is_active = true;

    IF v_current_count >= v_max_professionals THEN
      RETURN jsonb_build_object('success', false, 'error', 'Limite de profissionais do plano atingido. Peça ao administrador para fazer upgrade do plano.');
    END IF;
  END IF;

  -- Update profile with clinic and role
  UPDATE public.profiles
  SET clinic_id = v_invite.clinic_id, role = v_invite.role, updated_at = now()
  WHERE id = auth.uid();

  -- Auto-create team_member record
  INSERT INTO public.team_members (clinic_id, profile_id, is_active)
  VALUES (v_invite.clinic_id, auth.uid(), true);

  -- Increment used count
  UPDATE public.clinic_invites
  SET used_count = used_count + 1
  WHERE id = v_invite.id;

  RETURN jsonb_build_object('success', true, 'clinic_id', v_invite.clinic_id);
END;
$$;
