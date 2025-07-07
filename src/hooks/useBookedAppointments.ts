
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BookedAppointment {
  fecha: string;
  hora: string;
  nombre: string;
}

export const useBookedAppointments = (selectedDate: Date | null) => {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fechaFormateada = selectedDate.toISOString().split('T')[0];

        console.log('Consultando turnos para la fecha:', fechaFormateada);

        const { data, error } = await supabase
          .from('appointments')
          .select('hora')
          .eq('fecha', fechaFormateada)
          .in('estado', ['PENDIENTE', 'CONFIRMADO', 'REALIZADO']) // Todos los estados que ocupan el horario
          .order('hora', { ascending: true });

        if (error) {
          console.error('Error al consultar turnos:', error);
          throw error;
        }

        console.log('Turnos recibidos de Supabase:', data);
        
        // Extraer las horas ocupadas y asegurar que sean únicas
        const ocupiedTimes = data?.map((appointment) => appointment.hora) || [];
        const uniqueOccupiedTimes = [...new Set(ocupiedTimes)];
        
        console.log('Horarios ocupados (únicos):', uniqueOccupiedTimes);
        setBookedSlots(uniqueOccupiedTimes);

      } catch (error) {
        console.error('Error al consultar turnos:', error);
        setError('Error al consultar disponibilidad');
        setBookedSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedAppointments();
  }, [selectedDate]);

  return { bookedSlots, isLoading, error };
};
