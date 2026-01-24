-- Create subscription status enum (may already exist, so use IF NOT EXISTS pattern)
DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create plans table with features and limits (NULL allowed for unlimited)
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  price_monthly numeric NOT NULL DEFAULT 0,
  max_professionals integer, -- NULL = unlimited
  max_patients integer, -- NULL = unlimited
  max_leads_per_month integer, -- NULL = unlimited
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  status subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(clinic_id)
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans are publicly readable (for pricing page)
CREATE POLICY "Plans are publicly readable"
ON public.plans FOR SELECT
USING (is_active = true);

-- Subscriptions policies
CREATE POLICY "Users can view their clinic subscription"
ON public.subscriptions FOR SELECT
USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can update their clinic subscription"
ON public.subscriptions FOR UPDATE
USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Insert default plans
INSERT INTO public.plans (name, slug, description, price_monthly, max_professionals, max_patients, max_leads_per_month, features, sort_order) VALUES
(
  'Essencial',
  'essencial',
  'Ideal para clínicas iniciantes',
  197,
  2,
  500,
  50,
  '["Agenda online ilimitada", "Gestão de pacientes", "Lembretes WhatsApp", "Relatórios básicos", "Suporte por email"]'::jsonb,
  1
),
(
  'Profissional',
  'profissional',
  'Mais popular para clínicas em crescimento',
  397,
  5,
  2000,
  200,
  '["Tudo do Essencial", "IA para conversão de leads", "Automações WhatsApp", "Controle financeiro completo", "Fotos antes/depois", "Relatórios avançados", "Suporte prioritário"]'::jsonb,
  2
),
(
  'Enterprise',
  'enterprise',
  'Para redes de clínicas',
  797,
  NULL,
  NULL,
  NULL,
  '["Tudo do Profissional", "Multi-unidades", "API personalizada", "Integrações customizadas", "Gerente de conta dedicado", "Treinamento presencial", "SLA garantido"]'::jsonb,
  3
);

-- Function to check plan limits
CREATE OR REPLACE FUNCTION public.get_clinic_plan_limits()
RETURNS TABLE (
  plan_name text,
  max_professionals integer,
  max_patients integer,
  max_leads_per_month integer,
  features jsonb,
  subscription_status subscription_status,
  days_remaining integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.name,
    p.max_professionals,
    p.max_patients,
    p.max_leads_per_month,
    p.features,
    s.status,
    GREATEST(0, EXTRACT(DAY FROM s.current_period_end - now())::integer) as days_remaining
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.clinic_id = get_my_clinic()
$$;

-- Trigger for updated_at
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();