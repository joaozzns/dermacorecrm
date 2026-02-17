
-- Fix: Allow users to view their own profile (even without a clinic)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());
