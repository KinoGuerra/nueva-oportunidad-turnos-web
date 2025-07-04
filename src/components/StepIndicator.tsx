import React from 'react';
import { CalendarDays, Clock, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Fecha', icon: CalendarDays },
  { id: 2, name: 'Horario', icon: Clock },
  { id: 3, name: 'Datos', icon: FileText },
  { id: 4, name: 'Confirmación', icon: Check }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8 px-4">
      {steps.map((step, index) => {
        const isActive = currentStep >= step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              "flex flex-col items-center space-y-2",
              "transition-all duration-300"
            )}>
              <div className={cn(
                "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300",
                isCompleted 
                  ? "bg-green-500 border-green-500 text-white"
                  : isActive 
                    ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                    : "bg-gray-100 border-gray-300 text-gray-400"
              )}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className={cn(
                "text-xs sm:text-sm font-medium transition-colors duration-300",
                isActive ? "text-blue-600" : "text-gray-400"
              )}>
                {step.name}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 sm:w-12 h-0.5 transition-colors duration-300",
                currentStep > step.id ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};