-- Drop the old policy
DROP POLICY IF EXISTS "Users without clinic can create one" ON public.clinics;

-- Recreate using the security definer function get_my_clinic()
CREATE POLICY "Users without clinic can create one"
ON public.clinics
FOR INSERT
TO authenticated
WITH CHECK (get_my_clinic() IS NULL);
