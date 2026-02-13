
-- Create a secure view that masks sensitive patient fields for staff users
CREATE VIEW public.patients_safe
WITH (security_invoker=on) AS
SELECT 
  id, 
  clinic_id, 
  full_name, 
  email, 
  phone, 
  birth_date,
  CASE WHEN get_my_role() = 'admin' THEN cpf ELSE '***.***.***-**' END as cpf,
  address,
  CASE WHEN get_my_role() = 'admin' THEN medical_history ELSE NULL END as medical_history,
  CASE WHEN get_my_role() = 'admin' THEN notes ELSE NULL END as notes,
  lead_id, 
  created_at, 
  updated_at
FROM public.patients;
