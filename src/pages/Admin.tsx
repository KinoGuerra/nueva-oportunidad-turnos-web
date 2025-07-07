import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Users, Calendar, CheckCircle, Clock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  servicio: string;
  observaciones: string;
  estado: string;
  created_at: string;
}

const Admin = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmingIds, setConfirmingIds] = useState<Set<string>>(new Set());
  const [cancelingIds, setCancelingIds] = useState<Set<string>>(new Set());
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus !== 'true') {
      // Redirigir al inicio si no está autenticado
      window.location.href = '/';
      return;
    }
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    toast.success('Sesión cerrada correctamente');
    window.location.href = '/';
  };


  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('fecha', today) // Solo turnos de hoy en adelante
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (error) {
        console.error('Error al obtener turnos:', error);
        toast.error('Error al cargar los turnos');
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId: string) => {
    setConfirmingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ estado: 'CONFIRMADO' })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error al confirmar turno:', error);
        toast.error('Error al confirmar el turno');
        return;
      }

      // Actualizar el estado local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, estado: 'CONFIRMADO' }
            : apt
        )
      );

      toast.success('Turno confirmado exitosamente');
      
      // TODO: Aquí se implementará el envío de correo de confirmación
      // await sendConfirmationEmail(appointment);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al confirmar el turno');
    } finally {
      setConfirmingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setCancelingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ estado: 'CANCELADO' })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error al cancelar turno:', error);
        toast.error('Error al cancelar el turno');
        return;
      }

      // Actualizar el estado local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, estado: 'CANCELADO' }
            : apt
        )
      );

      toast.success('Turno cancelado exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cancelar el turno');
    } finally {
      setCancelingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const completeAppointment = async (appointmentId: string) => {
    setCompletingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ estado: 'REALIZADO' })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error al completar turno:', error);
        toast.error('Error al completar el turno');
        return;
      }

      // Actualizar el estado local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, estado: 'REALIZADO' }
            : apt
        )
      );

      toast.success('Turno marcado como realizado');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al completar el turno');
    } finally {
      setCompletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM
  };

  const pendingAppointments = appointments.filter(apt => apt.estado === 'PENDIENTE');
  const confirmedAppointments = appointments.filter(apt => apt.estado === 'CONFIRMADO');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="w-12 h-12 text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Turnos Pendientes</p>
                <p className="text-2xl font-bold text-gray-800">{pendingAppointments.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="w-12 h-12 text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Turnos Confirmados</p>
                <p className="text-2xl font-bold text-gray-800">{confirmedAppointments.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="w-12 h-12 text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total de Turnos</p>
                <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando turnos...</p>
          </div>
        )}

        {/* Turnos Pendientes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700">
              <Clock className="w-5 h-5 mr-2" />
              Turnos Pendientes ({pendingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay turnos pendientes</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contacto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Hora</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Servicio</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{appointment.nombre}</p>
                            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                              Pendiente
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            <p>{appointment.email}</p>
                            <p>{appointment.telefono}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(appointment.fecha)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatTime(appointment.hora)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {appointment.servicio}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => confirmAppointment(appointment.id)}
                              disabled={confirmingIds.has(appointment.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              {confirmingIds.has(appointment.id) ? (
                                'Confirmando...'
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirmar
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => cancelAppointment(appointment.id)}
                              disabled={cancelingIds.has(appointment.id)}
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              size="sm"
                            >
                              {cancelingIds.has(appointment.id) ? (
                                'Cancelando...'
                              ) : (
                                'Cancelar'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Turnos Confirmados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Turnos Confirmados ({confirmedAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confirmedAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay turnos confirmados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contacto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Hora</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Servicio</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{appointment.nombre}</p>
                            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                              Confirmado
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            <p>{appointment.email}</p>
                            <p>{appointment.telefono}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(appointment.fecha)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatTime(appointment.hora)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {appointment.servicio}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => completeAppointment(appointment.id)}
                              disabled={completingIds.has(appointment.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              {completingIds.has(appointment.id) ? (
                                'Finalizando...'
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Finalizado
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => cancelAppointment(appointment.id)}
                              disabled={cancelingIds.has(appointment.id)}
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              size="sm"
                            >
                              {cancelingIds.has(appointment.id) ? (
                                'Cancelando...'
                              ) : (
                                'Cancelar'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;