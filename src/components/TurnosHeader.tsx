
import React from 'react';
import { Link } from 'react-router-dom';
import { ContactMenu } from './ContactMenu';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const TurnosHeader = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Logo placeholder - ready for logo incorporation */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                {/* TODO: Replace with actual logo image */}
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
                SER
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
    </>
  );
};
