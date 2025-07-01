
import React from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { useBookedAppointments } from '../hooks/useBookedAppointments';

interface TimeSlotsProps {
  selectedDate: Date | null;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, onTimeSelect, selectedTime }) => {
  const { bookedSlots, isLoading, error } = useBookedAppointments(selectedDate);

  // Horarios disponibles (esto se puede hacer dinámico más adelante)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Simular horarios ocupados adicionales (esto vendría de una base de datos local si fuera necesario)
  const getUnavailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const unavailable = [];
    
    // Ejemplo: los lunes tienen menos disponibilidad
    if (dayOfWeek === 1) {
      unavailable.push('10:00', '14:30', '16:00');
    }
    
    // Ejemplo: los findes de semana tienen horarios limitados
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return timeSlots.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        return hour >= 10 && hour <= 16;
      }).slice(0, 6); // Solo 6 horarios disponibles
    }
    
    return unavailable;
  };

  // Si no hay fecha seleccionada, mostrar todos los horarios pero deshabilitados
  let availableSlots = timeSlots;
  let unavailableSlots: string[] = [];
  let isWeekend = false;

  if (selectedDate) {
    unavailableSlots = getUnavailableSlots(selectedDate);
    isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    
    // Combinar horarios no disponibles por reglas de negocio y horarios ya reservados
    const allUnavailableSlots = [...unavailableSlots, ...bookedSlots];
    
    availableSlots = isWeekend 
      ? unavailableSlots.filter(slot => !bookedSlots.includes(slot))
      : timeSlots.filter(slot => !allUnavailableSlots.includes(slot));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4 mr-2" />
        <span>
          {selectedDate 
            ? selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })
            : 'Selecciona una fecha para ver horarios disponibles'
          }
        </span>
        {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((time) => {
          const isAvailable = selectedDate && availableSlots.includes(time);
          const isSelected = selectedTime === time;
          const isBooked = bookedSlots.includes(time);
          
          return (
            <button
              key={time}
              onClick={() => isAvailable && onTimeSelect(time)}
              disabled={!selectedDate || !isAvailable || isBooked}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                border-2 hover:scale-105 active:scale-95 relative
                ${!selectedDate 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                    : isBooked
                      ? 'bg-red-100 text-red-600 border-red-300 cursor-not-allowed'
                      : isAvailable
                        ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }
              `}
            >
              {time}
              {isBooked && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 text-center mt-4">
        {!selectedDate 
          ? 'Selecciona una fecha para habilitar los horarios'
          : isLoading
            ? 'Consultando disponibilidad...'
            : `${availableSlots.length} horarios disponibles${bookedSlots.length > 0 ? ` • ${bookedSlots.length} ya reservados` : ''}`
        }
      </div>
    </div>
  );
};
