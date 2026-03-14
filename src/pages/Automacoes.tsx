import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Zap, Plus, MessageCircle, Clock, Rocket, Trash2, Pencil, Sparkles, Send, BellRing, UserPlus, CalendarCheck } from "lucide-react";
import { useAutomations, type CreateAutomationInput } from "@/hooks/useAutomations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const typeOptions = [
  { value: "boas-vindas", label: "Boas-vindas", icon: MessageCircle, color: "bg-emerald-500/10 text-emerald-500" },
  { value: "lembrete", label: "Lembrete", icon: Clock, color: "bg-amber-500/10 text-amber-500" },
  { value: "follow-up", label: "Follow-up", icon: Rocket, color: "bg-primary/10 text-primary" },
];

const triggerOptions = [
  { value: "novo_lead", label: "Novo lead cadastrado" },
  { value: "agendamento_criado", label: "Agendamento criado" },
  { value: "lead_inativo", label: "Lead inativo por X dias" },
];

const channelOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "notificacao", label: "Notificação interna" },
];

const defaultForm: CreateAutomationInput = {
  name: "",
  type: "boas-vindas",
  trigger_event: "novo_lead",
  delay_hours: 0,
  message_template: "",
  channel: "whatsapp",
};

// Pre-built automation templates
const suggestedAutomations: (CreateAutomationInput & { description: string; icon: typeof UserPlus })[] = [
  {
    name: "Boas-vindas ao novo lead",
    type: "boas-vindas",
    trigger_event: "novo_lead",
    delay_hours: 0,
    channel: "whatsapp",
    message_template: "Olá {{nome}}! 😊 Obrigada pelo seu interesse na {{clinica}}. Estamos à disposição para agendar sua avaliação. Tem algum procedimento em mente?",
    description: "Envia uma mensagem imediata via WhatsApp quando um novo lead é cadastrado.",
    icon: UserPlus,
  },
  {
    name: "Confirmação de agendamento",
    type: "lembrete",
    trigger_event: "agendamento_criado",
    delay_hours: 0,
    channel: "whatsapp",
    message_template: "Olá {{nome}}! Seu agendamento de {{procedimento}} foi confirmado para {{data_agendamento}}. Caso precise remarcar, entre em contato conosco. Até lá! 💜",
    description: "Confirma o agendamento imediatamente após ser criado.",
    icon: CalendarCheck,
  },
  {
    name: "Lembrete 24h antes",
    type: "lembrete",
    trigger_event: "agendamento_criado",
    delay_hours: -24,
    channel: "whatsapp",
    message_template: "Olá {{nome}}! Lembrando que sua consulta de {{procedimento}} é amanhã. Confirma presença? Responda SIM ou NÃO. 😊",
    description: "Lembra o paciente 24 horas antes do agendamento.",
    icon: BellRing,
  },
  {
    name: "Follow-up lead inativo (3 dias)",
    type: "follow-up",
    trigger_event: "lead_inativo",
    delay_hours: 72,
    channel: "whatsapp",
    message_template: "Oi {{nome}}, tudo bem? Vi que você demonstrou interesse em nossos procedimentos. Posso te ajudar com alguma dúvida ou agendar uma avaliação gratuita? 😉",
    description: "Reengaja leads que não responderam após 3 dias.",
    icon: Send,
  },
  {
    name: "Notificação interna — Novo lead",
    type: "boas-vindas",
    trigger_event: "novo_lead",
    delay_hours: 0,
    channel: "notificacao",
    message_template: "Novo lead recebido: {{nome}} com interesse em {{procedimento}}. Entre em contato o mais rápido possível!",
    description: "Avisa a equipe internamente quando um novo lead chega.",
    icon: Sparkles,
  },
];

export default function Automacoes() {
  const [activeSection, setActiveSection] = useState("automacoes");
  const { automations, isLoading, createAutomation, updateAutomation, toggleAutomation, deleteAutomation } = useAutomations();
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAutomationInput>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => { setForm(defaultForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (a: any) => {
    setForm({ name: a.name, type: a.type, trigger_event: a.trigger_event, delay_hours: a.delay_hours, message_template: a.message_template, channel: a.channel });
    setEditingId(a.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editingId) {
      await updateAutomation.mutateAsync({ id: editingId, ...form });
    } else {
      await createAutomation.mutateAsync(form);
    }
    setDialogOpen(false);
  };

  const handleUseSuggestion = async (suggestion: typeof suggestedAutomations[0]) => {
    const { description, icon, ...input } = suggestion;
    // Fix negative delay (used for display only)
    const fixedInput = { ...input, delay_hours: Math.abs(input.delay_hours) };
    await createAutomation.mutateAsync(fixedInput);
    toast.success(`Automação "${suggestion.name}" criada!`);
  };

  const formatDelay = (hours: number) => {
    const abs = Math.abs(hours);
    if (abs === 0) return "Imediato";
    if (abs < 1) return `${Math.round(abs * 60)} min`;
    if (abs < 24) return `${abs}h`;
    return `${Math.round(abs / 24)} dia(s)`;
  };

  // Check which suggestions are already created (by name)
  const existingNames = new Set(automations.map(a => a.name));

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-foreground">Automações</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Fluxos automáticos de comunicação com pacientes e leads</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Nova Automação
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Total</span>
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{automations.length}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Ativas</span>
                <Sparkles className="w-4 h-4 text-revenue-confirmed" />
              </div>
              <div className="text-2xl font-bold text-revenue-confirmed">{automations.filter(a => a.is_active).length}</div>
            </CardContent>
          </Card>
          <Card className="glass-card col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Inativas</span>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-muted-foreground">{automations.filter(a => !a.is_active).length}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => <Card key={i} className="glass-card h-24 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active automations */}
            {automations.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Suas automações</h2>
                <div className="grid gap-3">
                  {automations.map((a) => {
                    const typeInfo = typeOptions.find(t => t.value === a.type) || typeOptions[0];
                    const TypeIcon = typeInfo.icon;
                    return (
                      <Card key={a.id} className={`glass-card transition-all ${!a.is_active ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${typeInfo.color} shrink-0 w-fit`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-foreground">{a.name}</h3>
                              <Badge variant="secondary" className="text-xs">{typeInfo.label}</Badge>
                              <Badge variant="outline" className="text-xs">
                                {channelOptions.find(c => c.value === a.channel)?.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {triggerOptions.find(t => t.value === a.trigger_event)?.label} · Atraso: {formatDelay(a.delay_hours)}
                            </p>
                            {a.message_template && (
                              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 italic">
                                "{a.message_template}"
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Switch
                              checked={a.is_active}
                              onCheckedChange={(checked) => toggleAutomation.mutate({ id: a.id, is_active: checked })}
                              disabled={!isAdmin}
                            />
                            {isAdmin && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(a.id)} className="text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggested automations */}
            {isAdmin && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Automações sugeridas</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedAutomations.map((suggestion, idx) => {
                    const SugIcon = suggestion.icon;
                    const alreadyAdded = existingNames.has(suggestion.name);
                    const typeInfo = typeOptions.find(t => t.value === suggestion.type) || typeOptions[0];

                    return (
                      <Card key={idx} className={`glass-card hover:shadow-md transition-all ${alreadyAdded ? 'opacity-50' : ''}`}>
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${typeInfo.color} shrink-0`}>
                              <SugIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-sm leading-tight">{suggestion.name}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {channelOptions.find(c => c.value === suggestion.channel)?.label}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {formatDelay(suggestion.delay_hours)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4 flex-1">{suggestion.description}</p>
                          <Button
                            size="sm"
                            variant={alreadyAdded ? "outline" : "default"}
                            className="w-full gap-2"
                            disabled={alreadyAdded || createAutomation.isPending}
                            onClick={() => handleUseSuggestion(suggestion)}
                          >
                            {alreadyAdded ? (
                              <>Já adicionada</>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Usar esta automação
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Automação" : "Nova Automação"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Boas-vindas novo lead" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Canal</Label>
                  <Select value={form.channel} onValueChange={v => setForm(f => ({ ...f, channel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {channelOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Gatilho</Label>
                <Select value={form.trigger_event} onValueChange={v => setForm(f => ({ ...f, trigger_event: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Atraso (horas)</Label>
                <Input type="number" min={0} value={form.delay_hours} onChange={e => setForm(f => ({ ...f, delay_hours: Number(e.target.value) }))} placeholder="0 = imediato" />
                <p className="text-xs text-muted-foreground mt-1">0 = imediato, 1 = 1 hora, 24 = 1 dia</p>
              </div>
              <div>
                <Label>Mensagem template</Label>
                <Textarea
                  value={form.message_template}
                  onChange={e => setForm(f => ({ ...f, message_template: e.target.value }))}
                  placeholder="Olá {{nome}}, sua consulta de {{procedimento}} está confirmada!"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Variáveis disponíveis: {"{{nome}}"}, {"{{procedimento}}"}, {"{{data_agendamento}}"}, {"{{clinica}}"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!form.name.trim() || createAutomation.isPending || updateAutomation.isPending}>
                {editingId ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover automação?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => { if (deleteId) { deleteAutomation.mutate(deleteId); setDeleteId(null); } }}>
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </DashboardLayout>
  );
}
