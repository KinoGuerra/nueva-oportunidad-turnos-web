
import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface AppointmentSummaryProps {
  selectedDate: Date | null;
  selectedTime: string | null;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({ 
  selectedDate, 
  selectedTime 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del turno</h3>
      {!selectedDate && !selectedTime ? (
        <div className="text-gray-500 text-center py-4">
          Selecciona fecha y horario para ver el resumen
        </div>
      ) : (
        <div className="space-y-3">
          {selectedDate ? (
            <div className="flex items-center text-gray-700">
              <CalendarDays className="w-4 h-4 mr-2 text-blue-600" />
              <span>{selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>Fecha no seleccionada</span>
            </div>
          )}
          {selectedTime ? (
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>{selectedTime}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>Horario no seleccionado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
