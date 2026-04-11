
-- 1. Remove overly permissive policy on clinic_invites
DROP POLICY IF EXISTS "Anyone can read active invites by code" ON public.clinic_invites;

-- 2. Create a safe view for plans that hides stripe_price_id
CREATE OR REPLACE VIEW public.plans_public AS
SELECT id, name, slug, description, price_monthly, max_professionals, max_patients, max_leads_per_month, features, sort_order, is_active, created_at, updated_at
FROM public.plans;

-- Grant access to the view
GRANT SELECT ON public.plans_public TO anon, authenticated;

-- 3. Restrict subscriptions - only admins see stripe IDs
-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their clinic subscription" ON public.subscriptions;

-- Admins see everything
CREATE POLICY "Admins can view full subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  clinic_id = get_my_clinic() AND get_my_role() = 'admin'::app_role
);

-- Staff sees subscription but we'll use a view to hide stripe fields
CREATE OR REPLACE VIEW public.subscriptions_safe AS
SELECT 
  id, clinic_id, plan_id, status, trial_ends_at,
  current_period_start, current_period_end, canceled_at,
  created_at, updated_at
FROM public.subscriptions;

GRANT SELECT ON public.subscriptions_safe TO authenticated;
