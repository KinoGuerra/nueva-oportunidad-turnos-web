
import React, { useState } from 'react';
import { Phone, Mail, Instagram, MapPin, ChevronDown } from 'lucide-react';

export const ContactMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactInfo = {
    email: 'info@centrodebelleza.com',
    whatsapp: '+54 11 1234-5678',
    instagram: '@centrodebelleza',
    address: 'Av. Corrientes 1234, CABA, Argentina'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span>Contacto</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contáctanos</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-700">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <span className="text-sm text-gray-500">WhatsApp</span>
                  <p className="text-gray-700">{contactInfo.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-pink-600" />
                <div>
                  <span className="text-sm text-gray-500">Instagram</span>
                  <p className="text-gray-700">{contactInfo.instagram}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <span className="text-sm text-gray-500">Dirección</span>
                  <p className="text-gray-700">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
