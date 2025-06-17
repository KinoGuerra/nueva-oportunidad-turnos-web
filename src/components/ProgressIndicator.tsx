
import React from 'react';
import { CalendarDays, Clock, User } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <CalendarDays className="w-5 h-5" />
        <span className="hidden sm:inline">Fecha</span>
      </div>
      <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        currentStep >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <Clock className="w-5 h-5" />
        <span className="hidden sm:inline">Horario</span>
      </div>
      <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        currentStep >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">Datos</span>
      </div>
    </div>
  );
};
