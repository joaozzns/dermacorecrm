import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    logStep("ERROR", { message: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET" });
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500, headers: corsHeaders });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    logStep("ERROR", { message: "No stripe-signature header" });
    return new Response(JSON.stringify({ error: "No signature" }), { status: 400, headers: corsHeaders });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    logStep("Event received", { type: event.type, id: event.id });
  } catch (err) {
    logStep("Signature verification failed", { error: err.message });
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: corsHeaders });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabase, stripe, subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          logStep("Payment succeeded for subscription", { subscriptionId: invoice.subscription });
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handlePaymentFailed(supabase, invoice);
        }
        break;
      }
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    logStep("Error processing event", { error: err.message });
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleSubscriptionChange(supabase: any, stripe: Stripe, subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price?.id;
  const status = mapStripeStatus(subscription.status);

  logStep("Processing subscription change", {
    subscriptionId: subscription.id,
    customerId,
    status: subscription.status,
    mappedStatus: status,
    priceId,
  });

  // Find clinic by stripe_customer_id or by matching the customer email
  let clinicId = await findClinicByStripeCustomer(supabase, customerId);

  if (!clinicId) {
    // Try to find by email
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !customer.deleted && customer.email) {
      clinicId = await findClinicByEmail(supabase, customer.email);
    }
  }

  if (!clinicId) {
    logStep("ERROR: Could not find clinic for customer", { customerId });
    return;
  }

  // Find plan by price_id match (stored in plans.features or by name convention)
  const planId = await findPlanByPrice(supabase, priceId);

  const updateData: any = {
    status,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (planId) {
    updateData.plan_id = planId;
  }

  // Upsert subscription
  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      { clinic_id: clinicId, ...updateData },
      { onConflict: "clinic_id" }
    );

  if (error) {
    logStep("ERROR upserting subscription", { error: error.message });
  } else {
    logStep("Subscription upserted successfully", { clinicId, status });
  }
}

async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
  logStep("Subscription deleted", { subscriptionId: subscription.id });

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    logStep("ERROR updating canceled subscription", { error: error.message });
  } else {
    logStep("Subscription marked as canceled");
  }
}

async function handlePaymentFailed(supabase: any, invoice: Stripe.Invoice) {
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  logStep("Payment failed", { subscriptionId });

  if (!subscriptionId) return;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    logStep("ERROR updating past_due subscription", { error: error.message });
  } else {
    logStep("Subscription marked as past_due");
  }
}

function mapStripeStatus(stripeStatus: string): string {
  const mapping: Record<string, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "past_due",
    incomplete: "past_due",
    incomplete_expired: "canceled",
    paused: "canceled",
  };
  return mapping[stripeStatus] || "active";
}

async function findClinicByStripeCustomer(supabase: any, customerId: string): Promise<string | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("clinic_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.clinic_id || null;
}

async function findClinicByEmail(supabase: any, email: string): Promise<string | null> {
  // Find user by email, then get their clinic
  const { data: userData } = await supabase.auth.admin.listUsers();
  const user = userData?.users?.find((u: any) => u.email === email);
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("clinic_id")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.clinic_id || null;
}

async function findPlanByPrice(supabase: any, priceId: string | undefined): Promise<string | null> {
  if (!priceId) return null;
  
  // Find plan by stripe_price_id column
  const { data: plan } = await supabase
    .from("plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .maybeSingle();

  return plan?.id || null;
}
