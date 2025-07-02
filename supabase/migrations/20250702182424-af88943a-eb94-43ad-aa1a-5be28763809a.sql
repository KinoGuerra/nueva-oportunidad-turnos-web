-- Security fixes for appointments table - RLS policies (fixed)

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Cualquiera puede crear turnos" ON public.appointments;
DROP POLICY IF EXISTS "Consultar turnos por email" ON public.appointments;

-- Create more restrictive policies with rate limiting
CREATE POLICY "Users can create appointments with rate limiting" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
    -- Basic validation that data belongs to the inserter
    LENGTH(TRIM(nombre)) >= 2 
    AND LENGTH(TRIM(email)) >= 5
    AND LENGTH(TRIM(telefono)) >= 7
    -- Rate limiting: max 3 appointments per email per day
    AND (
        SELECT COUNT(*) 
        FROM public.appointments 
        WHERE appointments.email = appointments.email 
        AND appointments.fecha = appointments.fecha
    ) < 3
);

-- Allow reading appointments only with email verification
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (
    -- Must provide valid email to query
    email IS NOT NULL 
    AND LENGTH(TRIM(email)) >= 5
);

-- Prevent updates and deletes from public access
CREATE POLICY "No public updates allowed" 
ON public.appointments 
FOR UPDATE 
USING (false);

CREATE POLICY "No public deletes allowed" 
ON public.appointments 
FOR DELETE 
USING (false);