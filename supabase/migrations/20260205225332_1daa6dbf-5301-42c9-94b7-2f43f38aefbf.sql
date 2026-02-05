
-- Add stripe_subscription_id to subscriptions table for webhook sync
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create index for fast lookup by stripe_subscription_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON public.subscriptions (stripe_subscription_id);
