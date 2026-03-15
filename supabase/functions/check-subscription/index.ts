import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Map Stripe product IDs to plan slugs
const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_TrwZ5yH2JrEMAf": "essencial",
  "prod_TrwZpTMiVJJ7JM": "profissional",
  "prod_TrwaewJiPdXW8W": "enterprise",
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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header - returning unauthenticated response");
      return new Response(JSON.stringify({ 
        subscribed: false, plan_slug: null, subscription_end: null, is_trial: false 
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      logStep("Auth failed - returning unauthenticated response", { error: userError?.message });
      return new Response(JSON.stringify({ 
        subscribed: false, plan_slug: null, subscription_end: null, is_trial: false 
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // First check local subscriptions table (for manually created subscriptions)
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("clinic_id")
      .eq("id", user.id)
      .single();

    if (profile?.clinic_id) {
      const { data: localSub } = await supabaseClient
        .from("subscriptions")
        .select("*, plans(slug, name)")
        .eq("clinic_id", profile.clinic_id)
        .in("status", ["active", "trial"])
        .single();

      if (localSub && new Date(localSub.current_period_end) > new Date()) {
        logStep("Found active local subscription", { 
          status: localSub.status, 
          planSlug: (localSub.plans as any)?.slug 
        });
        return new Response(JSON.stringify({
          subscribed: true,
          plan_slug: (localSub.plans as any)?.slug || null,
          subscription_end: localSub.current_period_end,
          is_trial: localSub.status === "trial",
          status: localSub.status,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Then check Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found in Stripe or local DB");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan_slug: null,
        subscription_end: null,
        is_trial: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    const activeSubscription = subscriptions.data.find(
      (sub: Stripe.Subscription) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSubscription) {
      logStep("No active subscription found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan_slug: null,
        subscription_end: null,
        is_trial: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const productId = activeSubscription.items.data[0].price.product as string;
    const planSlug = PRODUCT_TO_PLAN[productId] || null;
    const subscriptionEnd = new Date(activeSubscription.current_period_end * 1000).toISOString();
    const isTrial = activeSubscription.status === "trialing";

    logStep("Active subscription found", { 
      subscriptionId: activeSubscription.id, 
      planSlug,
      status: activeSubscription.status,
      endDate: subscriptionEnd,
    });

    return new Response(JSON.stringify({
      subscribed: true,
      plan_slug: planSlug,
      subscription_end: subscriptionEnd,
      is_trial: isTrial,
      status: activeSubscription.status,
    }), {
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
