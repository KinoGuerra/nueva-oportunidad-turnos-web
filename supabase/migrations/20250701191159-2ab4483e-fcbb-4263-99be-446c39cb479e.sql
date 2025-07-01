
-- Crear tabla para almacenar los turnos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  servicio TEXT DEFAULT 'Predeterminado',
  observaciones TEXT DEFAULT 'Predeterminado',
  estado TEXT DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX idx_appointments_email ON public.appointments(email);

-- Crear índice para búsquedas por fecha
CREATE INDEX idx_appointments_fecha ON public.appointments(fecha);

-- Crear índice compuesto para verificar disponibilidad de horarios
CREATE INDEX idx_appointments_fecha_hora ON public.appointments(fecha, hora);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda crear turnos (sistema público)
CREATE POLICY "Cualquiera puede crear turnos" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Política para permitir que cualquiera pueda consultar turnos por email
CREATE POLICY "Consultar turnos por email" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_appointments_updated_at 
  BEFORE UPDATE ON public.appointments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
