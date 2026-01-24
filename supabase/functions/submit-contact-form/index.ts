import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  clinicName: string;
  interest: string;
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: ContactFormData = await req.json();

    // Validate required fields
    if (!body.name || body.name.trim().length < 2 || body.name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Nome inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email) || body.email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.phone || body.phone.trim().length < 10 || body.phone.length > 20) {
      return new Response(
        JSON.stringify({ error: "Telefone inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.clinicName || body.clinicName.trim().length < 2 || body.clinicName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Nome da clínica inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.interest) {
      return new Response(
        JSON.stringify({ error: "Interesse é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.message && body.message.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Mensagem muito longa" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map interest to readable label
    const interestLabels: Record<string, string> = {
      demo: "Demonstração da Plataforma",
      pricing: "Informações de Preços",
      migration: "Migração de Sistema",
      enterprise: "Plano Enterprise",
      other: "Outro",
    };

    // Get or create a default "website" clinic for public leads
    let websiteClinicId: string;
    
    const { data: existingClinic } = await supabase
      .from("clinics")
      .select("id")
      .eq("name", "Website Leads")
      .single();

    if (existingClinic) {
      websiteClinicId = existingClinic.id;
    } else {
      const { data: newClinic, error: clinicError } = await supabase
        .from("clinics")
        .insert({ name: "Website Leads", email: "leads@website.com" })
        .select("id")
        .single();

      if (clinicError || !newClinic) {
        throw new Error("Failed to create website clinic");
      }
      websiteClinicId = newClinic.id;
    }

    // Build notes with clinic name and message
    const notes = [
      `Clínica: ${body.clinicName.trim()}`,
      body.message ? `Mensagem: ${body.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    // Insert lead
    const { data: lead, error: leadError } = await supabase.from("leads").insert({
      clinic_id: websiteClinicId,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      source: "website",
      interest: interestLabels[body.interest] || body.interest,
      notes: notes,
      status: "novo",
    }).select().single();

    if (leadError) {
      throw leadError;
    }

    return new Response(
      JSON.stringify({ success: true, leadId: lead.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao processar solicitação" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
