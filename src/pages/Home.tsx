
import React from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { ImageCarousel } from '../components/ImageCarousel';
import { ClientTestimonials } from '../components/ClientTestimonials';
import { Calendar, Search, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader showBreadcrumb={false} />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Tu belleza es nuestra
            <span className="text-blue-600"> pasión</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Descubre una experiencia única de relajación y belleza en nuestro centro especializado
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/turnos"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Turno
            </Link>
            
            <Link
              to="/consultar-turno"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Consultar mi turno
            </Link>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Disfruta de una amplia gama de tratamientos diseñados para realzar tu belleza natural
            </p>
          </div>
          
          <ImageCarousel />
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tratamientos Faciales</h3>
              <p className="text-gray-600">Rejuvenece tu piel con nuestros tratamientos especializados</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Spa & Relajación</h3>
              <p className="text-gray-600">Desconéctate del estrés con nuestros masajes relajantes</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Estética Corporal</h3>
              <p className="text-gray-600">Cuida tu cuerpo con nuestros tratamientos corporales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ClientTestimonials />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold">SER - Centro de Belleza</h3>
          </div>
          <p className="text-gray-400 mb-8">
            Tu lugar de confianza para cuidar tu belleza y bienestar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/turnos"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reservar Turno
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
