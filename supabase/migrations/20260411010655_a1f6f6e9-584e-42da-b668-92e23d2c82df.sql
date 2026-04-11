
-- 1. Remove stripe_price_id from public access by dropping direct table policy for anon
-- and using the plans_public view instead
DROP POLICY IF EXISTS "Plans are publicly readable" ON public.plans;

-- Only authenticated users can read plans (edge functions use service role)
CREATE POLICY "Authenticated users can read active plans"
ON public.plans
FOR SELECT
TO authenticated
USING (is_active = true);

-- Anon users use plans_public view (no stripe_price_id)
-- plans_public view already exists with security_invoker=on

-- 2. The clinic creation policy is actually safe because:
-- create_clinic_for_user() is SECURITY DEFINER and checks existing clinic_id
-- The INSERT policy on clinics requires get_my_clinic() IS NULL
-- The profile UPDATE policy prevents users from clearing their clinic_id
-- So this is a false positive - mark as acceptable
