
import { useState } from 'react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

export const useAppointmentForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
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

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const resetForm = () => {
    setShowConfirmation(false);
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleConfirmAppointment = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !selectedDate || !selectedTime) {
      toast.error('Error de validación', {
        description: 'Por favor completa todos los campos requeridos: nombre, teléfono, email, fecha y hora.',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

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

      await fetch('https://script.google.com/macros/s/AKfycbwvdGku9fKwC3QwcXR1WeGkblhzltbOj1Mvnlg5srFNnTO5dINOG3p1uoqFaKOXV4edcQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      toast.success('¡Turno enviado exitosamente!', {
        description: 'Hemos recibido tu solicitud de turno. Te contactaremos pronto para confirmar.',
        duration: 5000,
      });

      console.log('Turno enviado exitosamente:', dataToSend);
      resetForm();

    } catch (error) {
      console.error('Error detallado al enviar el turno:', error);
      
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

  return {
    selectedDate,
    selectedTime,
    formData,
    currentStep,
    showConfirmation,
    isSubmitting,
    handleDateSelect,
    handleTimeSelect,
    handleFormSubmit,
    handleConfirmAppointment,
    setShowConfirmation
  };
};
