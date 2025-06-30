
import React from 'react';
import { CheckCircle, Calendar, Clock, User, Phone, Mail, X, AlertTriangle } from 'lucide-react';

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
  isSubmitting?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentData,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  const { date, time, name, phone, email } = appointmentData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Confirmar turno</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              ¿Confirmas que quieres reservar este turno?
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Detalles del turno:</h3>
            
            {date && (
              <div className="flex items-start text-gray-700">
                <Calendar className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-words">
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
                <Clock className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{time} hs</span>
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Tus datos:</h3>
            
            <div className="flex items-start text-gray-700">
              <User className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm break-words">{name}</span>
            </div>
            
            <div className="flex items-start text-gray-700">
              <Phone className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm break-words">{phone}</span>
            </div>
            
            <div className="flex items-start text-gray-700">
              <Mail className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm break-words">{email}</span>
            </div>
          </div>

          {/* Pending Status Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-orange-800">
                <strong>Estado del turno:</strong> Tu turno quedará en estado <strong>PENDIENTE</strong> hasta que confirmes el depósito de la seña vía transferencia bancaria. Te contactaremos con los datos bancarios necesarios.
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Importante:</strong> Recibirás un email de confirmación con todos los detalles. 
              Si necesitas cancelar o reprogramar, contáctanos con al menos 24 horas de anticipación.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`
              flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base
              ${isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              'Confirmar turno'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
