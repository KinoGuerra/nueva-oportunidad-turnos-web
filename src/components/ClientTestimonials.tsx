
import React from 'react';
import { Star, Quote } from 'lucide-react';

export const ClientTestimonials = () => {
  const testimonials = [
    {
      name: 'María González',
      rating: 5,
      comment: 'Excelente atención y profesionalismo. Me encantó el resultado de mi tratamiento facial.',
      service: 'Tratamiento Facial'
    },
    {
      name: 'Ana López',
      rating: 5,
      comment: 'El mejor centro de belleza de la zona. Siempre salgo renovada y feliz.',
      service: 'Spa Completo'
    },
    {
      name: 'Carmen Rodríguez',
      rating: 5,
      comment: 'Personal muy capacitado y ambiente súper relajante. Lo recomiendo totalmente.',
      service: 'Masajes'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          La satisfacción de nuestros clientes es nuestra mayor recompensa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Quote className="w-8 h-8 text-blue-600 opacity-50" />
              <div className="flex space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 italic">
              "{testimonial.comment}"
            </p>
            
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="text-sm text-blue-600">{testimonial.service}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
