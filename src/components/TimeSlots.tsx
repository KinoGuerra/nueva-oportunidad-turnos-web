
import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotsProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, onTimeSelect, selectedTime }) => {
  // Horarios disponibles (esto se puede hacer dinámico más adelante)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Simular horarios ocupados (esto vendría de una base de datos)
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

  const unavailableSlots = getUnavailableSlots(selectedDate);
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

  const availableSlots = isWeekend 
    ? unavailableSlots 
    : timeSlots.filter(slot => !unavailableSlots.includes(slot));

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4 mr-2" />
        <span>
          {selectedDate.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </span>
      </div>

      {availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No hay horarios disponibles</div>
          <div className="text-sm text-gray-400">Selecciona otra fecha</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableSlots.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                border-2 hover:scale-105 active:scale-95
                ${selectedTime === time
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {availableSlots.length > 0 && (
        <div className="text-xs text-gray-500 text-center mt-4">
          {availableSlots.length} horarios disponibles
        </div>
      )}
    </div>
  );
};
