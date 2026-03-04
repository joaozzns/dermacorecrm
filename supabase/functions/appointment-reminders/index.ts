import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPOINTMENT-REMINDERS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Find appointments starting in the next 24-25 hours (1-hour window to avoid duplicates with hourly cron)
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const { data: appointments, error: fetchError } = await supabaseClient
      .from("appointments")
      .select("id, clinic_id, title, start_time, patient_id, patients(full_name)")
      .gte("start_time", in24h.toISOString())
      .lt("start_time", in25h.toISOString())
      .in("status", ["agendado", "confirmado"]);

    if (fetchError) throw fetchError;

    logStep("Appointments found", { count: appointments?.length ?? 0 });

    if (!appointments || appointments.length === 0) {
      return new Response(JSON.stringify({ reminders_created: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check which appointments already have a reminder notification (avoid duplicates)
    const appointmentIds = appointments.map(a => a.id);
    const { data: existingNotifications } = await supabaseClient
      .from("notifications")
      .select("metadata")
      .eq("type", "appointment_reminder")
      .gte("created_at", new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString());

    const alreadyNotified = new Set(
      (existingNotifications || [])
        .map(n => (n.metadata as any)?.appointment_id)
        .filter(Boolean)
    );

    // Create reminder notifications
    const notifications = appointments
      .filter(a => !alreadyNotified.has(a.id))
      .map(appt => {
        const startDate = new Date(appt.start_time);
        const timeStr = startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
        const patientName = (appt as any).patients?.full_name || "Paciente";

        return {
          clinic_id: appt.clinic_id,
          type: "appointment_reminder",
          title: `Lembrete: ${appt.title} amanhã às ${timeStr}`,
          description: `Paciente: ${patientName}`,
          metadata: { appointment_id: appt.id, patient_id: appt.patient_id, start_time: appt.start_time },
        };
      });

    if (notifications.length > 0) {
      const { error: insertError } = await supabaseClient
        .from("notifications")
        .insert(notifications);

      if (insertError) throw insertError;
    }

    logStep("Reminders created", { count: notifications.length });

    return new Response(JSON.stringify({ reminders_created: notifications.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
