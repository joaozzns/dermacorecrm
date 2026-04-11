
-- Fix views to use security_invoker = on
ALTER VIEW public.plans_public SET (security_invoker = on);
ALTER VIEW public.subscriptions_safe SET (security_invoker = on);
