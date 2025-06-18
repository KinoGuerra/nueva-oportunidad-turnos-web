
import React from 'react';
import { Link } from 'react-router-dom';
import { ContactMenu } from '../components/ContactMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Palette, 
  Heart, 
  Flower2, 
  Star, 
  Scissors, 
  Droplets, 
  Sun,
  Calendar,
  ArrowLeft
} from 'lucide-react';

const Servicios = () => {
  const servicios = [
    {
      id: 1,
      title: "Maquillaje Profesional",
      description: "Maquillaje profesional para toda ocasión, desde looks naturales hasta dramáticos para eventos especiales.",
      icon: Palette,
      price: "Desde $8.000",
      duration: "60-90 min",
      features: ["Maquillaje de día", "Maquillaje de noche", "Maquillaje para fotografía", "Asesoramiento personalizado"]
    },
    {
      id: 2,
      title: "Servicio para Eventos",
      description: "Servicio completo de belleza para bodas, fiestas y eventos especiales. Incluye maquillaje y peinado.",
      icon: Star,
      price: "Desde $15.000",
      duration: "2-3 horas",
      features: ["Maquillaje + Peinado", "Prueba previa", "Servicio a domicilio", "Retoque incluido"]
    },
    {
      id: 3,
      title: "Tratamientos Faciales",
      description: "Tratamientos personalizados para rejuvenecer y cuidar tu piel con productos de alta calidad.",
      icon: Droplets,
      price: "Desde $6.000",
      duration: "75 min",
      features: ["Limpieza profunda", "Hidratación", "Anti-edad", "Tratamiento específico"]
    },
    {
      id: 4,
      title: "Corte y Peinado",
      description: "Cortes modernos y peinados profesionales adaptados a tu estilo y personalidad.",
      icon: Scissors,
      price: "Desde $4.500",
      duration: "45-60 min",
      features: ["Corte personalizado", "Peinado", "Asesoramiento de estilo", "Tratamiento capilar"]
    },
    {
      id: 5,
      title: "Manicura y Pedicura",
      description: "Cuidado completo de manos y pies con técnicas profesionales y productos de calidad.",
      icon: Flower2,
      price: "Desde $3.500",
      duration: "60 min",
      features: ["Manicura clásica", "Esmaltado semipermanente", "Pedicura spa", "Decoración de uñas"]
    },
    {
      id: 6,
      title: "Depilación",
      description: "Servicios de depilación con cera de alta calidad para una piel suave y cuidada.",
      icon: Sun,
      price: "Desde $2.000",
      duration: "30-45 min",
      features: ["Depilación facial", "Depilación corporal", "Cera tibia", "Post-tratamiento incluido"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-pink-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Centro de Belleza
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                Inicio
              </Link>
              <Link to="/servicios" className="text-pink-600 font-semibold">
                Servicios
              </Link>
              <ContactMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Nuestros <span className="text-pink-600">Servicios</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre nuestra amplia gama de tratamientos de belleza diseñados para realzar tu belleza natural y hacerte sentir radiante
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => {
              const IconComponent = servicio.icon;
              return (
                <Card key={servicio.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-pink-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      {servicio.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {servicio.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Duración:</span>
                      <span className="font-semibold text-gray-700">{servicio.duration}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Incluye:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {servicio.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Heart className="w-3 h-3 text-pink-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4 space-y-3">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-pink-600">{servicio.price}</span>
                      </div>
                      
                      <Link to="/turnos" className="block w-full">
                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                          <Calendar className="w-4 h-4 mr-2" />
                          Reservar Turno
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            ¿No encontrás lo que buscás?
          </h3>
          <p className="text-gray-600 mb-8">
            Contáctanos para consultar sobre otros servicios o tratamientos personalizados
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/turnos">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            <ContactMenu />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-semibold">Centro de Belleza</h3>
          </div>
          <p className="text-gray-400 mb-8">
            Tu lugar de confianza para cuidar tu belleza y bienestar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/turnos"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-colors"
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

export default Servicios;
