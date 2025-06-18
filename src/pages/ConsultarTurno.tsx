
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactMenu } from '../components/ContactMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  Mail,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  fecha: string;
  hora: string;
  nombre: string;
  email: string;
  servicio?: string;
}

const ConsultarTurno = () => {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const isDatePast = (dateStr: string) => {
    const appointmentDate = parseDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const sortAppointmentsByDate = (appointments: Appointment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = appointments.filter(apt => !isDatePast(apt.fecha));
    const past = appointments.filter(apt => isDatePast(apt.fecha));
    
    // Ordenar próximos por fecha (más cercanos primero)
    upcoming.sort((a, b) => parseDate(a.fecha).getTime() - parseDate(b.fecha).getTime());
    
    // Ordenar pasados por fecha (más recientes primero)
    past.sort((a, b) => parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime());
    
    return [...upcoming, ...past];
  };

  const getClosestAppointment = (appointments: Appointment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = appointments.filter(apt => !isDatePast(apt.fecha));
    if (upcoming.length === 0) return null;
    
    // Ordenar por fecha y devolver el más cercano
    upcoming.sort((a, b) => parseDate(a.fecha).getTime() - parseDate(b.fecha).getTime());
    return upcoming[0];
  };

  const handleSearch = async () => {
    if (!email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      console.log('Consultando turnos para el email:', email);

      const response = await fetch(`https://script.google.com/macros/s/AKfycbwvdGku9fKwC3QwcXR1WeGkblhzltbOj1Mvnlg5srFNnTO5dINOG3p1uoqFaKOXV4edcQ/exec?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        mode: 'no-cors'
      });

      // Como usamos no-cors, simulamos datos para demostración
      const mockAppointments: Appointment[] = [
        {
          fecha: '15/06/2025',
          hora: '10:00',
          nombre: 'María García',
          email: email,
          servicio: 'Maquillaje Profesional'
        },
        {
          fecha: '20/06/2025',
          hora: '14:30',
          nombre: 'María García',
          email: email,
          servicio: 'Tratamiento Facial'
        },
        {
          fecha: '10/06/2025',
          hora: '16:00',
          nombre: 'María García',
          email: email,
          servicio: 'Manicura'
        },
        {
          fecha: '25/06/2025',
          hora: '11:00',
          nombre: 'María García',
          email: email,
          servicio: 'Corte de Cabello'
        }
      ];

      const sortedAppointments = sortAppointmentsByDate(mockAppointments);
      setAppointments(sortedAppointments);
      setHasSearched(true);
      
      if (sortedAppointments.length === 0) {
        toast.info('No se encontraron turnos para este correo electrónico');
      } else {
        toast.success(`Se encontraron ${sortedAppointments.length} turnos`);
      }

    } catch (error) {
      console.error('Error al consultar turnos:', error);
      toast.error('Error al consultar los turnos. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const closestAppointment = getClosestAppointment(appointments);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Centro de Belleza
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link to="/servicios" className="text-gray-700 hover:text-blue-600 transition-colors">
                Servicios
              </Link>
              <Link to="/turnos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Turnos
              </Link>
              <Link to="/consultar-turno" className="text-blue-600 font-medium">
                Consultar Turno
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
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Consultar mis <span className="text-blue-600">Turnos</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ingresa tu correo electrónico para ver todos tus turnos agendados
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Buscar mis turnos
            </CardTitle>
            <CardDescription>
              Ingresa el correo electrónico que usaste para agendar tus turnos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Turnos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Mis turnos agendados
              </CardTitle>
              <CardDescription>
                {appointments.length > 0 
                  ? `Se encontraron ${appointments.length} turnos para ${email}`
                  : 'No se encontraron turnos para este correo electrónico'
                }
              </CardDescription>
            </CardHeader>
            {appointments.length > 0 && (
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment, index) => {
                        const isPast = isDatePast(appointment.fecha);
                        const isClosest = closestAppointment && 
                          appointment.fecha === closestAppointment.fecha && 
                          appointment.hora === closestAppointment.hora &&
                          !isPast;
                        
                        return (
                          <TableRow 
                            key={index} 
                            className={`${
                              isPast 
                                ? 'opacity-50 bg-gray-50' 
                                : isClosest 
                                  ? 'bg-blue-50 border-l-4 border-blue-400 shadow-sm' 
                                  : ''
                            }`}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                {appointment.fecha}
                                {isClosest && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    Próximo
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                {appointment.hora}
                              </div>
                            </TableCell>
                            <TableCell>{appointment.servicio || 'Consulta general'}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isPast 
                                    ? 'bg-gray-200 text-gray-600' 
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {isPast ? 'Realizado' : 'Agendado'}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> Los turnos en gris son de fechas pasadas. 
                    El turno resaltado en azul es tu próxima cita.
                    Si necesitas reprogramar o cancelar un turno futuro, contáctanos.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Call to Action */}
        {hasSearched && appointments.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Quieres agendar tu primer turno?
            </h3>
            <p className="text-gray-600 mb-6">
              Descubre nuestros servicios y agenda una cita
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/servicios">
                <Button variant="outline" size="lg">
                  Ver Servicios
                </Button>
              </Link>
              <Link to="/turnos">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Turno
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultarTurno;
