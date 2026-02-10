-- Add stripe_price_id column to plans table
ALTER TABLE public.plans ADD COLUMN stripe_price_id text UNIQUE;

-- Populate with existing Stripe price IDs from create-checkout
UPDATE public.plans SET stripe_price_id = 'price_1SuCg0FMQoBY59cUPqcmrZvZ' WHERE slug = 'essencial';
UPDATE public.plans SET stripe_price_id = 'price_1SuCgYFMQoBY59cUSqOZ00g' WHERE slug = 'profissional';
UPDATE public.plans SET stripe_price_id = 'price_1SuCgyFMQoBY59cUju0ko18z' WHERE slug = 'enterprise';