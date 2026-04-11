
-- Allow anon to read plans again (needed for landing/pricing page)
DROP POLICY IF EXISTS "Authenticated users can read active plans" ON public.plans;

CREATE POLICY "Active plans are publicly readable"
ON public.plans
FOR SELECT
TO anon, authenticated
USING (is_active = true);
