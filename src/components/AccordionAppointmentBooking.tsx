import React, { useState } from 'react';
import { CalendarDays, Clock, FileText, Check, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { StepIndicator } from './StepIndicator';
import { AccordionStep } from './AccordionStep';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { AppointmentForm } from './AppointmentForm';
import { ConfirmationModal } from './ConfirmationModal';

export const AccordionAppointmentBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
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
    setCurrentStep(4);
    setShowConfirmation(true);
  };

  const handleConfirmAppointment = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !selectedDate || !selectedTime) {
      toast.error('Error de validación', {
        description: 'Por favor completa todos los campos requeridos.',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const fechaFormateada = selectedDate.toISOString().split('T')[0];

      // Verificar disponibilidad
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('fecha', fechaFormateada)
        .eq('hora', selectedTime);

      if (checkError) {
        throw new Error('Error al verificar disponibilidad del horario');
      }

      if (existingAppointments && existingAppointments.length > 0) {
        toast.error('Horario no disponible', {
          description: 'Este horario ya ha sido reservado. Por favor selecciona otro horario.',
          duration: 5000,
        });
        setShowConfirmation(false);
        setCurrentStep(2);
        return;
      }

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
            observaciones: 'Predeterminado',
            estado: 'CONFIRMADO'
          }
        ])
        .select();

      if (error) {
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

      toast.success('¡Turno confirmado exitosamente!', {
        description: 'Tu turno ha sido confirmado y guardado en el sistema. Te contactaremos pronto.',
        duration: 8000,
      });
      
      // Resetear todo
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

  const toggleStep = (step: number) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && selectedDate) {
      setCurrentStep(2);
    } else if (step === 3 && selectedDate && selectedTime) {
      setCurrentStep(3);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-4">
        {/* Paso 1: Seleccionar Fecha */}
        <AccordionStep
          title="Seleccionar Fecha"
          subtitle={selectedDate ? selectedDate.toLocaleDateString('es-ES', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
          }) : "Elige el día para tu turno"}
          icon={<CalendarDays className="w-6 h-6" />}
          isOpen={currentStep === 1}
          isCompleted={selectedDate !== null}
          onToggle={() => toggleStep(1)}
        >
          <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </AccordionStep>

        {/* Paso 2: Seleccionar Horario */}
        <AccordionStep
          title="Seleccionar Horario"
          subtitle={selectedTime ? `Hora seleccionada: ${selectedTime}` : "Elige tu horario preferido"}
          icon={<Clock className="w-6 h-6" />}
          isOpen={currentStep === 2}
          isCompleted={selectedTime !== null}
          isDisabled={!selectedDate}
          onToggle={() => toggleStep(2)}
        >
          <TimeSlots 
            selectedDate={selectedDate} 
            onTimeSelect={handleTimeSelect}
            selectedTime={selectedTime}
          />
        </AccordionStep>

        {/* Paso 3: Datos Personales */}
        <AccordionStep
          title="Datos Personales"
          subtitle={formData.name ? `Cliente: ${formData.name}` : "Completa tu información de contacto"}
          icon={<FileText className="w-6 h-6" />}
          isOpen={currentStep === 3}
          isCompleted={formData.name !== '' && formData.phone !== '' && formData.email !== ''}
          isDisabled={!selectedDate || !selectedTime}
          onToggle={() => toggleStep(3)}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <User className="w-5 h-5" />
              <span className="font-medium">Información de contacto</span>
            </div>
            <AppointmentForm onSubmit={handleFormSubmit} />
          </div>
        </AccordionStep>

        {/* Paso 4: Confirmación (solo visual, la modal maneja la confirmación real) */}
        <AccordionStep
          title="Confirmación"
          subtitle="Revisa tu información y confirma el turno"
          icon={<Check className="w-6 h-6" />}
          isOpen={currentStep === 4}
          isCompleted={false}
          isDisabled={!formData.name || !formData.phone || !formData.email}
          onToggle={() => setCurrentStep(4)}
        >
          <div className="text-center py-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <Check className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¡Todo listo para confirmar!
              </h3>
              <p className="text-gray-600 mb-4">
                Se abrirá una ventana de confirmación para revisar todos los detalles de tu turno.
              </p>
            </div>
          </div>
        </AccordionStep>
      </div>

      {/* Modal de Confirmación */}
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