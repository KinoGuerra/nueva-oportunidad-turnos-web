
import React from 'react';
import { CalendarDays, Clock, User } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8 px-2">
      <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
        currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Fecha</span>
      </div>
      <div className={`w-4 sm:w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
        currentStep >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Horario</span>
      </div>
      <div className={`w-4 sm:w-8 h-0.5 ${currentStep >= 3 ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
        currentStep >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <User className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Datos</span>
      </div>
    </div>
  );
};
