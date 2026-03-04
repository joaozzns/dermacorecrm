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
import { Zap, Plus, MessageCircle, Clock, Rocket, Trash2, Pencil } from "lucide-react";
import { useAutomations, type CreateAutomationInput } from "@/hooks/useAutomations";
import { useAuth } from "@/hooks/useAuth";

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

  const formatDelay = (hours: number) => {
    if (hours === 0) return "Imediato";
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${hours}h`;
    return `${Math.round(hours / 24)} dia(s)`;
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Automações</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Fluxos automáticos de comunicação</p>
          </div>
          {isAdmin && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Nova Automação
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2].map(i => <Card key={i} className="glass-card h-28 animate-pulse" />)}
          </div>
        ) : automations.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Nenhuma automação criada</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Crie fluxos automáticos para enviar mensagens de boas-vindas, lembretes de agendamento e follow-ups.
              </p>
              {isAdmin && (
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar primeira automação
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map((a) => {
              const typeInfo = typeOptions.find(t => t.value === a.type) || typeOptions[0];
              const TypeIcon = typeInfo.icon;
              return (
                <Card key={a.id} className="glass-card">
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${typeInfo.color} shrink-0 w-fit`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{a.name}</h3>
                        <Badge variant="secondary" className="text-xs">{typeInfo.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {triggerOptions.find(t => t.value === a.trigger_event)?.label} · {formatDelay(a.delay_hours)} · {channelOptions.find(c => c.value === a.channel)?.label}
                      </p>
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
