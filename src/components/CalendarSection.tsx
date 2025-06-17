
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';

interface CalendarSectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
        Selecciona fecha y horario
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Fecha disponible</h3>
          <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Horarios disponibles</h3>
          <TimeSlots 
            selectedDate={selectedDate} 
            onTimeSelect={onTimeSelect}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  );
};
