import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionStepProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isCompleted: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionStep: React.FC<AccordionStepProps> = ({
  title,
  subtitle,
  icon,
  isOpen,
  isCompleted,
  isDisabled,
  onToggle,
  children
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg border-2 transition-all duration-300",
      isOpen 
        ? "border-blue-300 shadow-blue-100" 
        : isCompleted 
          ? "border-green-300 shadow-green-100"
          : "border-gray-200"
    )}>
      <button
        onClick={onToggle}
        disabled={isDisabled}
        className={cn(
          "w-full flex items-center justify-between p-4 sm:p-6 text-left transition-all duration-200",
          "hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <div className="flex items-center space-x-4">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300",
            isCompleted 
              ? "bg-green-100 text-green-600"
              : isOpen 
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
          )}>
            {icon}
          </div>
          <div>
            <h3 className={cn(
              "text-lg sm:text-xl font-semibold transition-colors duration-300",
              isCompleted 
                ? "text-green-700"
                : isOpen 
                  ? "text-blue-700"
                  : "text-gray-600"
            )}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <ChevronDown className={cn(
          "w-5 h-5 text-gray-400 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
          <div className="pt-4 sm:pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};