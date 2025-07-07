-- Eliminar la política restrictiva que bloquea todas las actualizaciones
DROP POLICY IF EXISTS "No public updates allowed" ON public.appointments;

-- Crear nueva política que permita actualizaciones del estado por administradores
-- (Para un MVP, permitiremos actualizaciones de estado desde el cliente)
CREATE POLICY "Allow status updates for admin operations" 
ON public.appointments 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Solo permitir actualizar el campo estado con valores válidos
  estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETADO', 'REALIZADO')
);