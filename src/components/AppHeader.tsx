import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContactMenu } from './ContactMenu';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  showBreadcrumb?: boolean;
}

export const AppHeader = ({ showBreadcrumb = true }: AppHeaderProps) => {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/servicios':
        return 'Servicios';
      case '/turnos':
        return 'Turnos';
      case '/consultar-turno':
        return 'Consultar Turno';
      case '/admin':
        return 'Administración';
      default:
        return 'Inicio';
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
                SER - Centro de Belleza
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Inicio
              </Link>
              <Link 
                to="/servicios" 
                className={`transition-colors ${
                  location.pathname === '/servicios' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Servicios
              </Link>
              <Link 
                to="/turnos" 
                className={`transition-colors ${
                  location.pathname === '/turnos' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Turnos
              </Link>
              <Link 
                to="/consultar-turno" 
                className={`transition-colors ${
                  location.pathname === '/consultar-turno' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Consultar Turno
              </Link>
              {location.pathname !== '/admin' && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Acceso
                </Link>
              )}
              <ContactMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {showBreadcrumb && location.pathname !== '/' && (
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      )}
    </>
  );
};