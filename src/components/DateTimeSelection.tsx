
import React from 'react';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { CalendarDays } from 'lucide-react';

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
        Selecciona fecha y horario
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Calendar */}
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Fecha disponible</h3>
          <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} />
        </div>

        {/* Time Slots - Always visible */}
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Horarios disponibles</h3>
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
