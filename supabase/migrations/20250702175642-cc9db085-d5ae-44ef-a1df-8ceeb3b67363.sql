-- Security fixes for appointments table (fixed version)

-- 1. Add unique constraint to prevent duplicate appointments (same date + time)
ALTER TABLE public.appointments 
ADD CONSTRAINT unique_appointment_datetime 
UNIQUE (fecha, hora);

-- 2. Add validation function for email format
CREATE OR REPLACE FUNCTION public.validate_email(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Add validation function for phone format
CREATE OR REPLACE FUNCTION public.validate_phone(phone_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Accept formats like: +54123456789, 123456789, (123) 456-7890
    RETURN phone_input ~* '^(\+?[1-9]\d{1,14}|[\(\)\d\s\-\.]{7,15})$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Add validation trigger for appointments
CREATE OR REPLACE FUNCTION public.validate_appointment_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate email format
    IF NOT public.validate_email(NEW.email) THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    -- Validate phone format
    IF NOT public.validate_phone(NEW.telefono) THEN
        RAISE EXCEPTION 'Invalid phone format: %', NEW.telefono;
    END IF;
    
    -- Validate name is not empty
    IF LENGTH(TRIM(NEW.nombre)) < 2 THEN
        RAISE EXCEPTION 'Name must be at least 2 characters long';
    END IF;
    
    -- Validate appointment is in the future (with some tolerance for same day)
    IF NEW.fecha < CURRENT_DATE THEN
        RAISE EXCEPTION 'Cannot create appointments for past dates';
    END IF;
    
    -- Validate business hours (9:00 to 18:30)
    IF NEW.hora < '09:00'::TIME OR NEW.hora > '18:30'::TIME THEN
        RAISE EXCEPTION 'Appointments must be between 9:00 AM and 6:30 PM';
    END IF;
    
    -- Validate estado values
    IF NEW.estado NOT IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO') THEN
        RAISE EXCEPTION 'Invalid estado value: %', NEW.estado;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the validation trigger
DROP TRIGGER IF EXISTS validate_appointment_trigger ON public.appointments;
CREATE TRIGGER validate_appointment_trigger
    BEFORE INSERT OR UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_appointment_data();

-- 5. Add constraint for valid time slots (30-minute intervals)
ALTER TABLE public.appointments 
ADD CONSTRAINT valid_time_slots 
CHECK (
    EXTRACT(MINUTE FROM hora) IN (0, 30)
);

-- 6. Add constraint for reasonable future dates (max 6 months ahead)
CREATE OR REPLACE FUNCTION public.validate_appointment_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha > CURRENT_DATE + INTERVAL '6 months' THEN
        RAISE EXCEPTION 'Appointments cannot be scheduled more than 6 months in advance';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_appointment_date_trigger ON public.appointments;
CREATE TRIGGER validate_appointment_date_trigger
    BEFORE INSERT OR UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_appointment_date();

-- 7. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_email_fecha ON public.appointments(email, fecha);
CREATE INDEX IF NOT EXISTS idx_appointments_estado ON public.appointments(estado);