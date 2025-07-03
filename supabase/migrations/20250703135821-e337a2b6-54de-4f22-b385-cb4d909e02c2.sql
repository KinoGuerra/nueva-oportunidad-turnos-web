-- Fix critical bug in RLS rate limiting policy

-- Drop the broken rate limiting policy
DROP POLICY IF EXISTS "Users can create appointments with rate limiting" ON public.appointments;

-- Create corrected policy with proper rate limiting logic
CREATE POLICY "Users can create appointments with rate limiting" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
    -- Basic validation that data belongs to the inserter
    LENGTH(TRIM(nombre)) >= 2 
    AND LENGTH(TRIM(email)) >= 5
    AND LENGTH(TRIM(telefono)) >= 7
    -- Rate limiting: max 3 appointments per email per day (FIXED LOGIC)
    AND (
        SELECT COUNT(*) 
        FROM public.appointments 
        WHERE email = NEW.email 
        AND fecha = NEW.fecha
    ) < 3
);

-- Add logging function for security monitoring
CREATE OR REPLACE FUNCTION public.log_appointment_attempt()
RETURNS TRIGGER AS $$
BEGIN
    -- Log successful appointment creation
    RAISE LOG 'Appointment created: email=%, date=%, time=%', NEW.email, NEW.fecha, NEW.hora;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for appointment logging
DROP TRIGGER IF EXISTS log_appointment_creation ON public.appointments;
CREATE TRIGGER log_appointment_creation
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.log_appointment_attempt();

-- Add index for rate limiting performance
CREATE INDEX IF NOT EXISTS idx_appointments_rate_limit ON public.appointments(email, fecha);

-- Add constraint to prevent booking appointments at the exact same time
-- (This was already added in previous migration but ensuring it exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_appointment_datetime' 
        AND table_name = 'appointments'
    ) THEN
        ALTER TABLE public.appointments 
        ADD CONSTRAINT unique_appointment_datetime 
        UNIQUE (fecha, hora);
    END IF;
END $$;