
import React from 'react';
import { CheckCircle, Calendar, Clock, User, Phone, Mail, X } from 'lucide-react';

interface AppointmentData {
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  email: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentData: AppointmentData;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentData
}) => {
  if (!isOpen) return null;

  const { date, time, name, phone, email } = appointmentData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Confirmar turno</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              ¿Confirmas que quieres reservar este turno?
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Detalles del turno:</h3>
            
            {date && (
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-sm">
                  {date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            
            {time && (
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-sm">{time} hs</span>
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Tus datos:</h3>
            
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-3 text-blue-600" />
              <span className="text-sm">{name}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Phone className="w-4 h-4 mr-3 text-blue-600" />
              <span className="text-sm">{phone}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-3 text-blue-600" />
              <span className="text-sm">{email}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Recibirás un email de confirmación con todos los detalles. 
              Si necesitas cancelar o reprogramar, contáctanos con al menos 24 horas de anticipación.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirmar turno
          </button>
        </div>
      </div>
    </div>
  );
};
