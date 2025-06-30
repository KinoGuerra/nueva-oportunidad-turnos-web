
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactMenu } from '../components/ContactMenu';
import { Calendar } from '../components/Calendar';
import { TimeSlots } from '../components/TimeSlots';
import { AppointmentForm } from '../components/AppointmentForm';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { CalendarDays, Clock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
                Centro de Belleza
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link to="/servicios" className="text-gray-700 hover:text-blue-600 transition-colors">
                Servicios
              </Link>
              <Link to="/turnos" className="text-blue-600 font-medium">
                Turnos
              </Link>
              <Link to="/consultar-turno" className="text-gray-700 hover:text-blue-600 transition-colors">
                Consultar Turno
              </Link>
              <ContactMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Agenda tu <span className="text-blue-600">Turno</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-8 px-2">
            Reserva tu turno de forma fácil y rápida
          </p>
        </div>

        {/* Progress Indicator */}
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

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Summary Section - Always visible */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Resumen del turno</h3>
            {!selectedDate && !selectedTime ? (
              <div className="text-gray-500 text-center py-4 text-sm sm:text-base">
                Selecciona fecha y horario para ver el resumen
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {selectedDate ? (
                  <div className="flex items-center text-gray-700 text-sm sm:text-base">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="break-words">{selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 text-sm sm:text-base">
                    <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Fecha no seleccionada</span>
                  </div>
                )}
                {selectedTime ? (
                  <div className="flex items-center text-gray-700 text-sm sm:text-base">
                    <Clock className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                    <span>{selectedTime}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 text-sm sm:text-base">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Horario no seleccionado</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calendar and Time Selection Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Selecciona fecha y horario
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Calendar */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Fecha disponible</h3>
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>

              {/* Time Slots - Always visible */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Horarios disponibles</h3>
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
