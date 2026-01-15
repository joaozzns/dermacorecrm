-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

-- Create enum for lead status
CREATE TYPE public.lead_status AS ENUM ('novo', 'contatado', 'qualificado', 'agendado', 'convertido', 'perdido');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou');

-- Create clinics table
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  status lead_status NOT NULL DEFAULT 'novo',
  source TEXT,
  interest TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  birth_date DATE,
  cpf TEXT,
  address TEXT,
  medical_history TEXT,
  notes TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status NOT NULL DEFAULT 'agendado',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table for additional team info
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  specialty TEXT,
  registration_number TEXT,
  work_schedule JSONB,
  monthly_goal NUMERIC(10,2),
  current_revenue NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_clinic_id ON public.profiles(clinic_id);
CREATE INDEX idx_leads_clinic_id ON public.leads(clinic_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_patients_clinic_id ON public.patients(clinic_id);
CREATE INDEX idx_appointments_clinic_id ON public.appointments(clinic_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_team_members_clinic_id ON public.team_members(clinic_id);

-- Enable RLS on all tables
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's clinic_id (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_my_clinic()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Helper function to get user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- RLS Policies for clinics
CREATE POLICY "Users can view their own clinic"
  ON public.clinics FOR SELECT
  USING (id = public.get_my_clinic());

CREATE POLICY "Admins can update their clinic"
  ON public.clinics FOR UPDATE
  USING (id = public.get_my_clinic() AND public.get_my_role() = 'admin');

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their clinic"
  ON public.profiles FOR SELECT
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Allow profile creation on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- RLS Policies for leads
CREATE POLICY "Users can view leads in their clinic"
  ON public.leads FOR SELECT
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can create leads in their clinic"
  ON public.leads FOR INSERT
  WITH CHECK (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can update leads in their clinic"
  ON public.leads FOR UPDATE
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can delete leads in their clinic"
  ON public.leads FOR DELETE
  USING (clinic_id = public.get_my_clinic());

-- RLS Policies for patients
CREATE POLICY "Users can view patients in their clinic"
  ON public.patients FOR SELECT
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can create patients in their clinic"
  ON public.patients FOR INSERT
  WITH CHECK (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can update patients in their clinic"
  ON public.patients FOR UPDATE
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Admins can delete patients"
  ON public.patients FOR DELETE
  USING (clinic_id = public.get_my_clinic() AND public.get_my_role() = 'admin');

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments in their clinic"
  ON public.appointments FOR SELECT
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can create appointments in their clinic"
  ON public.appointments FOR INSERT
  WITH CHECK (clinic_id = public.get_my_clinic());

CREATE POLICY "Users can update appointments in their clinic"
  ON public.appointments FOR UPDATE
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE
  USING (clinic_id = public.get_my_clinic() AND public.get_my_role() = 'admin');

-- RLS Policies for team_members
CREATE POLICY "Users can view team members in their clinic"
  ON public.team_members FOR SELECT
  USING (clinic_id = public.get_my_clinic());

CREATE POLICY "Admins can create team members"
  ON public.team_members FOR INSERT
  WITH CHECK (clinic_id = public.get_my_clinic() AND public.get_my_role() = 'admin');

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  USING (clinic_id = public.get_my_clinic() AND public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  USING (clinic_id = public.get_my_clinic() AND public.get_my_role() = 'admin');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();