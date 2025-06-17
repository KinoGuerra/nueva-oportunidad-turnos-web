
import React from 'react';
import { User } from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { AppointmentSummary } from '../components/AppointmentSummary';
import { CalendarSection } from '../components/CalendarSection';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

const Index = () => {
  const {
    selectedDate,
    selectedTime,
    currentStep,
    showConfirmation,
    isSubmitting,
    handleDateSelect,
    handleTimeSelect,
    handleFormSubmit,
    handleConfirmAppointment,
    setShowConfirmation
  } = useAppointmentForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Gestión de Turnos - Centro de belleza
            </h1>
            <p className="text-gray-600 text-lg">
              Reserva tu turno de forma fácil y rápida
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ProgressIndicator currentStep={currentStep} />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Summary Section */}
          <AppointmentSummary 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />

          {/* Calendar and Time Selection Section */}
          <CalendarSection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
          />

          {/* Form Section */}
          {selectedDate && selectedTime && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Tus datos
              </h2>
              <AppointmentForm onSubmit={handleFormSubmit} />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmAppointment}
        isSubmitting={isSubmitting}
        appointmentData={{
          date: selectedDate,
          time: selectedTime,
          name: '',
          phone: '',
          email: ''
        }}
      />
    </div>
  );
};

export default Index;
