
import React from 'react';
import { AppHeader } from '../components/AppHeader';
import { TurnosHero } from '../components/TurnosHero';
import { AccordionAppointmentBooking } from '../components/AccordionAppointmentBooking';

const Turnos = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <TurnosHero />
        <AccordionAppointmentBooking />
      </div>
    </div>
  );
};

export default Turnos;
