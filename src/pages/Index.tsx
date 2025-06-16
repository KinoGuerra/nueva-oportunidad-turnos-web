
import React, { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { TimeSlots } from '../components/TimeSlots';
import { AppointmentForm } from '../components/AppointmentForm';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { CalendarDays, Clock, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirmAppointment = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !selectedDate || !selectedTime) {
      alert('Por favor completa todos los campos requeridos: nombre, teléfono, email, fecha y hora.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear la fecha para enviar
      const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Preparar los datos para enviar
      const dataToSend = {
        nombre: formData.name,
        telefono: formData.phone,
        email: formData.email,
        fecha: fechaFormateada,
        hora: selectedTime,
        servicio: 'Consulta general', // Valor por defecto
        observaciones: '' // Valor por defecto
      };

      console.log('Enviando datos a Google Apps Script:', dataToSend);

      // Hacer el POST request a la API de Google Apps Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbwvdGku9fKwC3QwcXR1WeGkblhzltbOj1Mvnlg5srFNnTO5dINOG3p1uoqFaKOXV4edcQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        toast.success('¡Turno confirmado exitosamente!', {
          description: 'Recibirás un email de confirmación en breve.',
          duration: 5000,
        });

        console.log('Turno confirmado exitosamente:', dataToSend);
        
        // Resetear el formulario
        setShowConfirmation(false);
        setCurrentStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setFormData({ name: '', phone: '', email: '' });
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al enviar el turno:', error);
      toast.error('Error al confirmar el turno', {
        description: 'Por favor intenta nuevamente o contacta al soporte.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Turnos Nueva Oportunidad
            </h1>
            <p className="text-gray-600 text-lg">
              Reserva tu turno de forma fácil y rápida
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
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

        {/* Main Content */}
        <div className="space-y-6">
          {/* Summary Section - Always visible */}
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

          {/* Calendar and Time Selection Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
              Selecciona fecha y horario
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Fecha disponible</h3>
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>

              {/* Time Slots - Always visible */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Horarios disponibles</h3>
                <TimeSlots 
                  selectedDate={selectedDate} 
                  onTimeSelect={handleTimeSelect}
                  selectedTime={selectedTime}
                />
              </div>
            </div>
          </div>

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
          ...formData
        }}
      />
    </div>
  );
};

export default Index;
