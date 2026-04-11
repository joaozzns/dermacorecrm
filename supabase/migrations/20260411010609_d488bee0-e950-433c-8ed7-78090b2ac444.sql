
-- 1. FIX CRITICAL: Prevent users from changing their own role or clinic_id
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  AND clinic_id IS NOT DISTINCT FROM (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
);

-- 2. FIX CRITICAL: Prevent users from setting clinic_id on INSERT
DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.profiles;

CREATE POLICY "Allow profile creation on signup"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (id = auth.uid() AND clinic_id IS NULL AND role = 'staff'::app_role);

-- 3. FIX: Restrict plans to authenticated users only
DROP POLICY IF EXISTS "Plans are publicly readable" ON public.plans;

CREATE POLICY "Plans are publicly readable"
ON public.plans
FOR SELECT
TO anon, authenticated
USING (is_active = true);
