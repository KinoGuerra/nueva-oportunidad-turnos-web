
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { TurnosHeader } from '../components/TurnosHeader';
import { TurnosHero } from '../components/TurnosHero';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { AppointmentSummary } from '../components/AppointmentSummary';
import { DateTimeSelection } from '../components/DateTimeSelection';
import { AppointmentForm } from '../components/AppointmentForm';
import { ConfirmationModal } from '../components/ConfirmationModal';

const Turnos = () => {
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
      toast.error('Error de validación', {
        description: 'Por favor completa todos los campos requeridos: nombre, teléfono, email, fecha y hora.',
        duration: 5000,
      });
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

      // Preparar los datos para enviar con valores fijos para servicio y observaciones
      const dataToSend = {
        nombre: formData.name,
        telefono: formData.phone,
        email: formData.email,
        fecha: fechaFormateada,
        hora: selectedTime,
        servicio: 'Predeterminado',
        observaciones: 'Predeterminado'
      };

      console.log('Enviando datos a Google Apps Script:', dataToSend);

      // Intentar con diferentes configuraciones de fetch
      const response = await fetch('https://script.google.com/macros/s/AKfycbwvdGku9fKwC3QwcXR1WeGkblhzltbOj1Mvnlg5srFNnTO5dINOG3p1uoqFaKOXV4edcQ/exec', {
        method: 'POST',
        mode: 'no-cors', // Cambiar a no-cors para evitar problemas de CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Respuesta recibida:', response);

      // Con no-cors, no podemos leer el response, así que asumimos éxito si no hay error
      toast.success('¡Turno registrado exitosamente!', {
        description: 'Tu turno está en estado PENDIENTE hasta confirmar el depósito de la seña. Te contactaremos con los datos bancarios.',
        duration: 8000,
      });

      console.log('Turno enviado exitosamente:', dataToSend);
      
      // Resetear el formulario
      setShowConfirmation(false);
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', phone: '', email: '' });

    } catch (error) {
      console.error('Error detallado al enviar el turno:', error);
      console.error('Tipo de error:', typeof error);
      console.error('Mensaje del error:', error instanceof Error ? error.message : 'Error desconocido');
      
      // Mostrar diferentes mensajes según el tipo de error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Problema de conexión', {
          description: 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet e intenta nuevamente.',
          duration: 7000,
        });
      } else {
        toast.error('Error al enviar el turno', {
          description: 'Ha ocurrido un error inesperado. Por favor intenta nuevamente o contacta al soporte.',
          duration: 7000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TurnosHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <TurnosHero />
        <ProgressIndicator currentStep={currentStep} />

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          <AppointmentSummary selectedDate={selectedDate} selectedTime={selectedTime} />
          <DateTimeSelection 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
          />

          {/* Form Section */}
          {selectedDate && selectedTime && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
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

export default Turnos;
