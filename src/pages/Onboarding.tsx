import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FileText, CreditCard, ChevronRight, ChevronLeft, Loader2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import logoDermacore from "@/assets/logo_dermacore.png";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  max_professionals: number | null;
  max_patients: number | null;
  max_leads_per_month: number | null;
  features: string[];
  sort_order: number;
}

const steps = [
  { icon: Building2, label: "Criar Clínica" },
  { icon: FileText, label: "Dados Básicos" },
  { icon: CreditCard, label: "Escolher Plano" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { createCheckout } = useSubscription();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [clinicName, setClinicName] = useState("");

  // Step 2
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Step 3
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("id, name, slug, description, price_monthly, max_professionals, max_patients, max_leads_per_month, features, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Plan[];
    },
  });

  // If user already has clinic, skip to step 2 or 3
  const hasClinic = !!profile?.clinic_id;

  const handleCreateClinic = async () => {
    if (!clinicName.trim()) {
      toast.error("Nome da clínica é obrigatório");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("create_clinic_for_user", {
        p_clinic_name: clinicName.trim(),
      });
      if (error) throw error;
      const result = data as unknown as { success: boolean; error?: string };
      if (!result.success) throw new Error(result.error || "Erro ao criar clínica");

      toast.success("Clínica criada!");
      setCurrentStep(1);
      // Reload profile to get clinic_id
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar clínica");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBasicData = async () => {
    if (!profile?.clinic_id) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("clinics")
        .update({
          phone: phone || null,
          whatsapp: whatsapp || null,
          city: city || null,
          state: state || null,
        })
        .eq("id", profile.clinic_id);

      if (error) throw error;
      toast.success("Dados salvos!");
      setCurrentStep(2);
    } catch (err) {
      toast.error("Erro ao salvar dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPlan = async (planSlug: string) => {
    setSelectedPlan(planSlug);
    try {
      await createCheckout(planSlug);
    } catch {
      toast.error("Erro ao iniciar checkout");
    }
  };

  const handleSkipPlan = () => {
    navigate("/dashboard");
  };

  const effectiveStep = hasClinic && currentStep === 0 ? 1 : currentStep;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-center">
        <img src={logoDermacore} alt="DermaCore" className="h-10" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === effectiveStep;
              const isDone = i < effectiveStep;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Create Clinic */}
            {effectiveStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Bem-vindo ao DermaCore!</h2>
                    <p className="text-muted-foreground mb-8">
                      Vamos configurar sua clínica em poucos passos.
                    </p>
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="space-y-2 text-left">
                        <Label htmlFor="clinic-name">Nome da Clínica *</Label>
                        <Input
                          id="clinic-name"
                          placeholder="Ex: Clínica Estética Premium"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          maxLength={100}
                        />
                      </div>
                      <Button
                        onClick={handleCreateClinic}
                        disabled={isSubmitting || !clinicName.trim()}
                        className="w-full gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Basic Data */}
            {effectiveStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Dados da Clínica</h2>
                      <p className="text-muted-foreground">Informações opcionais que você pode preencher depois.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input placeholder="(11) 99999-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input placeholder="(11) 99999-0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Input placeholder="SP" maxLength={2} value={state} onChange={(e) => setState(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-8 max-w-lg mx-auto">
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                        Pular
                      </Button>
                      <Button onClick={handleSaveBasicData} disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Choose Plan */}
            {effectiveStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Escolha seu Plano</h2>
                  <p className="text-muted-foreground">7 dias grátis em qualquer plano. Cancele quando quiser.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all hover:scale-[1.02] ${
                        plan.slug === "profissional" ? "border-primary ring-1 ring-primary" : ""
                      }`}
                      onClick={() => handleSelectPlan(plan.slug)}
                    >
                      <CardContent className="p-6 text-center">
                        {plan.slug === "profissional" && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
                            Mais Popular
                          </span>
                        )}
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="my-3">
                          <span className="text-3xl font-bold">R${plan.price_monthly}</span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                        <ul className="text-sm text-left space-y-2 mb-4">
                          {(plan.features as string[]).slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant={plan.slug === "profissional" ? "default" : "outline"}
                          className="w-full"
                          disabled={selectedPlan === plan.slug}
                        >
                          {selectedPlan === plan.slug ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Começar 7 dias grátis"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button variant="ghost" onClick={handleSkipPlan} className="text-muted-foreground">
                    Pular por enquanto e ir ao dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
