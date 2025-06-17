
import { useState, useEffect } from 'react';

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
        const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        console.log('Consultando turnos para la fecha:', fechaFormateada);

        // Hacer GET request para obtener los turnos de la fecha seleccionada
        const response = await fetch(`https://script.google.com/macros/s/AKfycbwvdGku9fKwC3QwcXR1WeGkblhzltbOj1Mvnlg5srFNnTO5dINOG3p1uoqFaKOXV4edcQ/exec?fecha=${encodeURIComponent(fechaFormateada)}`, {
          method: 'GET',
          mode: 'cors'
        });

        if (response.okay) {
          const data = await response.json();
          console.log('Turnos recibidos de la API:', data);
          
          // Extraer las horas ocupadas
          const ocupiedTimes = data.map((appointment: BookedAppointment) => appointment.hora);
          setBookedSlots(ocupiedTimes);
          console.log('Horarios ocupados:', ocupiedTimes);
        } else {
          console.warn('No se pudieron obtener los turnos reservados');
          setBookedSlots([]);
        }
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
