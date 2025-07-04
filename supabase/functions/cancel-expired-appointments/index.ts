import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting expired appointments cancellation job...");
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate the cutoff time (24 hours ago)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    const cutoffTimestamp = cutoffTime.toISOString();

    console.log(`Checking for appointments created before: ${cutoffTimestamp}`);

    // Find appointments that are still pending and older than 24 hours
    const { data: expiredAppointments, error: selectError } = await supabase
      .from('appointments')
      .select('id, nombre, email, fecha, hora, created_at')
      .eq('estado', 'PENDIENTE')
      .lt('created_at', cutoffTimestamp);

    if (selectError) {
      console.error('Error fetching expired appointments:', selectError);
      throw selectError;
    }

    console.log(`Found ${expiredAppointments?.length || 0} expired appointments`);

    if (!expiredAppointments || expiredAppointments.length === 0) {
      console.log("No expired appointments found");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No expired appointments found",
          cancelledCount: 0 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update expired appointments to CANCELADO status
    const appointmentIds = expiredAppointments.map(apt => apt.id);
    
    const { data: updatedAppointments, error: updateError } = await supabase
      .from('appointments')
      .update({ 
        estado: 'CANCELADO',
        updated_at: new Date().toISOString()
      })
      .in('id', appointmentIds)
      .select();

    if (updateError) {
      console.error('Error updating appointments:', updateError);
      throw updateError;
    }

    console.log(`Successfully cancelled ${updatedAppointments?.length || 0} appointments`);

    // Log the cancelled appointments for monitoring
    expiredAppointments.forEach(apt => {
      console.log(`Cancelled appointment: ID=${apt.id}, Email=${apt.email}, Date=${apt.fecha}, Time=${apt.hora}`);
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully cancelled ${updatedAppointments?.length || 0} expired appointments`,
        cancelledCount: updatedAppointments?.length || 0,
        cancelledAppointments: updatedAppointments?.map(apt => ({
          id: apt.id,
          email: apt.email,
          fecha: apt.fecha,
          hora: apt.hora
        }))
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in cancel-expired-appointments function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        cancelledCount: 0 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);