
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
      const fechaFormateada = selectedDate.toISOString().split('T')[0];

      // Verificar nuevamente si el horario ya está ocupado antes de crear la reserva
      console.log('Verificando disponibilidad antes de crear la reserva...');
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('fecha', fechaFormateada)
        .eq('hora', selectedTime);

      if (checkError) {
        console.error('Error al verificar disponibilidad:', checkError);
        throw new Error('Error al verificar disponibilidad del horario');
      }

      if (existingAppointments && existingAppointments.length > 0) {
        toast.error('Horario no disponible', {
          description: 'Este horario ya ha sido reservado por otro cliente. Por favor selecciona otro horario.',
          duration: 5000,
        });
        setShowConfirmation(false);
        setCurrentStep(2); // Volver a la selección de horario
        return;
      }

      console.log('Enviando datos a Supabase:', {
        nombre: formData.name,
        telefono: formData.phone,
        email: formData.email,
        fecha: fechaFormateada,
        hora: selectedTime,
        servicio: 'Predeterminado',
        observaciones: 'Predeterminado'
      });

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            nombre: formData.name,
            telefono: formData.phone,
            email: formData.email,
            fecha: fechaFormateada,
            hora: selectedTime,
            servicio: 'Predeterminado',
            observaciones: 'Predeterminado'
          }
        ])
        .select();

      if (error) {
        console.error('Error de Supabase:', error);
        
        // Manejar errores específicos de duplicados
        if (error.code === '23505' || error.message.includes('duplicate')) {
          toast.error('Horario no disponible', {
            description: 'Este horario ya ha sido reservado. Por favor selecciona otro horario.',
            duration: 5000,
          });
          setShowConfirmation(false);
          setCurrentStep(2);
          return;
        }
        
        throw error;
      }

      console.log('Turno creado exitosamente en Supabase:', data);

      toast.success('¡Turno registrado exitosamente!', {
        description: 'Tu turno está en estado PENDIENTE hasta confirmar el depósito de la seña. Te contactaremos con los datos bancarios.',
        duration: 8000,
      });
      
      // Resetear el formulario
      setShowConfirmation(false);
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', phone: '', email: '' });

    } catch (error) {
      console.error('Error al enviar el turno:', error);
      
      let errorMessage = 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.';
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error('Error al registrar el turno', {
        description: errorMessage,
        duration: 7000,
      });
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
