
import React, { useState } from 'react';
import { User, Phone, Mail } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface AppointmentFormProps {
  onSubmit: (data: FormData) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido (8-15 dígitos)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simular delay de envío
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const formatPhone = (value: string) => {
    // Remover todos los caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 15 dígitos
    const truncated = numbers.slice(0, 15);
    
    // Formatear con espacios cada 3-4 dígitos
    if (truncated.length <= 3) return truncated;
    if (truncated.length <= 7) return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
    return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre completo */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          Nombre completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="Ingresa tu nombre completo"
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            ${errors.name 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 focus:border-blue-400'
            }
          `}
        />
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center">
            {errors.name}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Phone className="w-4 h-4 mr-2 text-gray-500" />
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="123 456 789"
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            ${errors.phone 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 focus:border-blue-400'
            }
          `}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 flex items-center">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Mail className="w-4 h-4 mr-2 text-gray-500" />
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="tu@email.com"
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            ${errors.email 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 focus:border-blue-400'
            }
          `}
        />
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center">
            {errors.email}
          </p>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200
          ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Enviando...
          </div>
        ) : (
          'Reservar turno'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Al enviar confirmas que los datos son correctos y aceptas nuestros términos de servicio.
      </p>
    </form>
  );
};
