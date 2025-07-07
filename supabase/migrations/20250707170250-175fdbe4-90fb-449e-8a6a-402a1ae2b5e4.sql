-- Actualizar función de validación para incluir el estado REALIZADO
CREATE OR REPLACE FUNCTION public.validate_appointment_data()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
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
    
    -- Validate estado values - agregando REALIZADO
    IF NEW.estado NOT IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'REALIZADO') THEN
        RAISE EXCEPTION 'Invalid estado value: %', NEW.estado;
    END IF;
    
    RETURN NEW;
END;
$function$;