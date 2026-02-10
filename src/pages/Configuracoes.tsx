import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useClinicSettings, NotificationPreferences, AgendaPreferences } from "@/hooks/useClinicSettings";
import {
  Settings,
  Building2,
  User,
  Bell,
  MessageCircle,
  Palette,
  Shield,
  CreditCard,
  Link2,
  FileText,
  Save,
  Upload,
  Check,
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Clock,
  Calendar,
  Zap,
  Database,
  Key,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Webhook,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Copy,
  Edit,
  Loader2
} from "lucide-react";

// Templates de mensagem
const templatesWhatsApp = [
  { id: 1, nome: "Confirmação de Agendamento", tipo: "agendamento", ativo: true, mensagem: "Olá {nome}! 👋\n\nSeu agendamento está confirmado:\n📅 {data}\n⏰ {horario}\n💆 {procedimento}\n\nQualquer dúvida, estamos à disposição!" },
  { id: 2, nome: "Lembrete 24h", tipo: "lembrete", ativo: true, mensagem: "Olá {nome}! 😊\n\nLembrando do seu procedimento amanhã:\n📅 {data} às {horario}\n\nConfirma sua presença? Responda SIM ou NÃO" },
  { id: 3, nome: "Lembrete 2h", tipo: "lembrete", ativo: true, mensagem: "Oi {nome}! 👋\n\nSeu procedimento é em 2 horas!\n⏰ {horario}\n📍 {endereco}\n\nTe esperamos! 💕" },
  { id: 4, nome: "Pós-Procedimento D+1", tipo: "pos", ativo: true, mensagem: "Olá {nome}! 💕\n\nComo você está se sentindo após o procedimento?\n\nLembre-se das orientações:\n✅ {orientacao1}\n✅ {orientacao2}\n\nQualquer dúvida, estamos aqui!" },
  { id: 5, nome: "Pesquisa de Satisfação", tipo: "pesquisa", ativo: false, mensagem: "Olá {nome}! 🌟\n\nSua opinião é muito importante para nós!\n\nDe 1 a 5, como você avalia nosso atendimento?\n\n1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣" },
];

// Integrações disponíveis
const integracoes = [
  { id: "whatsapp", nome: "WhatsApp Business", icone: MessageCircle, status: "conectado", descricao: "Envio automático de mensagens", cor: "text-green-500" },
  { id: "google", nome: "Google Calendar", icone: Calendar, status: "conectado", descricao: "Sincronização de agenda", cor: "text-blue-500" },
  { id: "instagram", nome: "Instagram", icone: Instagram, status: "pendente", descricao: "Captura de leads do DM", cor: "text-pink-500" },
  { id: "facebook", nome: "Facebook Leads", icone: Facebook, status: "desconectado", descricao: "Integração com formulários", cor: "text-blue-600" },
  { id: "stripe", nome: "Stripe", icone: CreditCard, status: "conectado", descricao: "Processamento de pagamentos", cor: "text-purple-500" },
  { id: "zapier", nome: "Zapier", icone: Zap, status: "desconectado", descricao: "Automações avançadas", cor: "text-orange-500" },
];

export default function Configuracoes() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("configuracoes");
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { clinic, notificationPreferences, agendaPreferences, isLoading, updateClinicInfo, updateSettings } = useClinicSettings();

  // Local state synced from DB
  const [clinica, setClinica] = useState({
    nome: "",
    razaoSocial: "",
    cnpj: "",
    telefone: "",
    whatsapp: "",
    email: "",
    site: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    instagram: "",
    facebook: "",
    horarioFuncionamento: "",
    logoUrl: "",
  });

  const [notificacoes, setNotificacoes] = useState<NotificationPreferences>(notificationPreferences);
  const [prefsAgenda, setPrefsAgenda] = useState<AgendaPreferences>(agendaPreferences);

  // Sync from DB when data loads
  useEffect(() => {
    if (clinic) {
      setClinica({
        nome: clinic.name || "",
        razaoSocial: clinic.legal_name || "",
        cnpj: clinic.cnpj || "",
        telefone: clinic.phone || "",
        whatsapp: clinic.whatsapp || "",
        email: clinic.email || "",
        site: clinic.website || "",
        endereco: clinic.address || "",
        cidade: clinic.city || "",
        estado: clinic.state || "",
        cep: clinic.zip_code || "",
        instagram: clinic.instagram || "",
        facebook: clinic.facebook || "",
        horarioFuncionamento: clinic.business_hours || "",
        logoUrl: clinic.logo_url || "",
      });
    }
  }, [clinic]);

  useEffect(() => {
    setNotificacoes(notificationPreferences);
  }, [notificationPreferences]);

  useEffect(() => {
    setPrefsAgenda(agendaPreferences);
  }, [agendaPreferences]);

  const isSaving = updateClinicInfo.isPending || updateSettings.isPending;

  const handleSave = async () => {
    try {
      await Promise.all([
        updateClinicInfo.mutateAsync({
          name: clinica.nome,
          legal_name: clinica.razaoSocial || null,
          cnpj: clinica.cnpj || null,
          phone: clinica.telefone || null,
          whatsapp: clinica.whatsapp || null,
          email: clinica.email || null,
          website: clinica.site || null,
          address: clinica.endereco || null,
          city: clinica.cidade || null,
          state: clinica.estado || null,
          zip_code: clinica.cep || null,
          instagram: clinica.instagram || null,
          facebook: clinica.facebook || null,
          business_hours: clinica.horarioFuncionamento || null,
          logo_url: clinica.logoUrl || null,
        }),
        updateSettings.mutateAsync({
          notification_preferences: notificacoes,
          agenda_preferences: prefsAgenda,
        }),
      ]);
    } catch {
      // Errors handled by mutations
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_live_xxxxxxxxxxxxxxxxxxxxx");
    toast.success("API Key copiada!");
  };

  if (isLoading) {
    return (
      <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        <main className="p-8 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Carregando configurações...</span>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Personalize sua clínica e integrações</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>

        <Tabs defaultValue="clinica" className="space-y-6">
          <TabsList className="bg-card border flex-wrap h-auto p-1">
            <TabsTrigger value="clinica" className="gap-2"><Building2 className="w-4 h-4" /> Clínica</TabsTrigger>
            <TabsTrigger value="templates" className="gap-2"><FileText className="w-4 h-4" /> Templates</TabsTrigger>
            <TabsTrigger value="integracoes" className="gap-2"><Link2 className="w-4 h-4" /> Integrações</TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-2"><Bell className="w-4 h-4" /> Notificações</TabsTrigger>
            <TabsTrigger value="agenda" className="gap-2"><Calendar className="w-4 h-4" /> Agenda</TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2"><Shield className="w-4 h-4" /> Segurança</TabsTrigger>
          </TabsList>

          {/* Tab Clínica */}
          <TabsContent value="clinica" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados da Clínica */}
              <Card className="glass-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Dados da Clínica
                  </CardTitle>
                  <CardDescription>Informações básicas da sua clínica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Fantasia</Label>
                      <Input 
                        id="nome" 
                        value={clinica.nome} 
                        onChange={(e) => setClinica({...clinica, nome: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razaoSocial">Razão Social</Label>
                      <Input 
                        id="razaoSocial" 
                        value={clinica.razaoSocial}
                        onChange={(e) => setClinica({...clinica, razaoSocial: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input 
                        id="cnpj" 
                        value={clinica.cnpj}
                        onChange={(e) => setClinica({...clinica, cnpj: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horario">Horário de Funcionamento</Label>
                      <Input 
                        id="horario" 
                        value={clinica.horarioFuncionamento}
                        onChange={(e) => setClinica({...clinica, horarioFuncionamento: e.target.value})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Telefone
                      </Label>
                      <Input 
                        id="telefone" 
                        value={clinica.telefone}
                        onChange={(e) => setClinica({...clinica, telefone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </Label>
                      <Input 
                        id="whatsapp" 
                        value={clinica.whatsapp}
                        onChange={(e) => setClinica({...clinica, whatsapp: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> E-mail
                      </Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={clinica.email}
                        onChange={(e) => setClinica({...clinica, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Site
                      </Label>
                      <Input 
                        id="site" 
                        value={clinica.site}
                        onChange={(e) => setClinica({...clinica, site: e.target.value})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Endereço
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Endereço completo"
                        value={clinica.endereco}
                        onChange={(e) => setClinica({...clinica, endereco: e.target.value})}
                        className="md:col-span-2"
                      />
                      <Input 
                        placeholder="Cidade"
                        value={clinica.cidade}
                        onChange={(e) => setClinica({...clinica, cidade: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Estado"
                          value={clinica.estado}
                          onChange={(e) => setClinica({...clinica, estado: e.target.value})}
                        />
                        <Input 
                          placeholder="CEP"
                          value={clinica.cep}
                          onChange={(e) => setClinica({...clinica, cep: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" /> Instagram
                      </Label>
                      <Input 
                        id="instagram" 
                        value={clinica.instagram}
                        onChange={(e) => setClinica({...clinica, instagram: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" /> Facebook
                      </Label>
                      <Input 
                        id="facebook" 
                        value={clinica.facebook}
                        onChange={(e) => setClinica({...clinica, facebook: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo e Branding */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Marca
                  </CardTitle>
                  <CardDescription>Logo e identidade visual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white" />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Alterar Logo
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Cor Principal</Label>
                    <div className="flex gap-2">
                      {["#0D9488", "#6366F1", "#EC4899", "#F59E0B", "#10B981"].map((cor) => (
                        <button
                          key={cor}
                          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors"
                          style={{ backgroundColor: cor }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Tema</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Templates */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Templates de Mensagem
                    </CardTitle>
                    <CardDescription>Personalize as mensagens automáticas do WhatsApp</CardDescription>
                  </div>
                  <Button className="gap-2" onClick={() => alert("Criação de novo template em desenvolvimento!")}>
                    <Plus className="w-4 h-4" />
                    Novo Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templatesWhatsApp.map((template) => (
                    <div key={template.id} className="p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${template.ativo ? 'bg-primary/10' : 'bg-muted'}`}>
                            <FileText className={`w-4 h-4 ${template.ativo ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{template.nome}</h4>
                            <Badge variant="outline" className="text-xs capitalize">{template.tipo}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={template.ativo} />
                          <Button variant="ghost" size="icon" onClick={() => alert(`Editando template: ${template.nome}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            navigator.clipboard.writeText(template.mensagem);
                            toast.success("Template copiado!");
                          }}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                          {template.mensagem}
                        </pre>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span>Variáveis disponíveis:</span>
                        <Badge variant="secondary" className="text-xs">{"{nome}"}</Badge>
                        <Badge variant="secondary" className="text-xs">{"{data}"}</Badge>
                        <Badge variant="secondary" className="text-xs">{"{horario}"}</Badge>
                        <Badge variant="secondary" className="text-xs">{"{procedimento}"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Templates de E-mail */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Templates de E-mail
                    </CardTitle>
                    <CardDescription>Modelos para comunicações por e-mail</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2" onClick={() => alert("Criação de novo template de email em desenvolvimento!")}>
                    <Plus className="w-4 h-4" />
                    Novo Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Boas-vindas", "Confirmação", "Lembrete", "Pós-Procedimento", "Aniversário", "Reativação"].map((nome) => (
                    <div key={nome} className="p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{nome}</h4>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => alert(`Editando template: ${nome}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Template padrão</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Integrações */}
          <TabsContent value="integracoes" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  Integrações Disponíveis
                </CardTitle>
                <CardDescription>Conecte ferramentas externas ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integracoes.map((integracao) => {
                    const Icon = integracao.icone;
                    return (
                      <div key={integracao.id} className="p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-background">
                              <Icon className={`w-6 h-6 ${integracao.cor}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{integracao.nome}</h4>
                              <p className="text-sm text-muted-foreground">{integracao.descricao}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={integracao.status === "conectado" ? "default" : integracao.status === "pendente" ? "secondary" : "outline"}
                            className={integracao.status === "conectado" ? "bg-revenue-confirmed" : ""}
                          >
                            {integracao.status === "conectado" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {integracao.status === "pendente" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {integracao.status.charAt(0).toUpperCase() + integracao.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {integracao.status === "conectado" ? (
                            <>
                              <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success(`${integracao.nome} reconectado com sucesso!`)}>
                                <RefreshCw className="w-4 h-4" />
                                Reconectar
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2 text-destructive" onClick={() => toast.info(`${integracao.nome} desconectado.`)}>
                                <X className="w-4 h-4" />
                                Desconectar
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" className="gap-2" onClick={() => toast.success(`Conectando ${integracao.nome}...`)}>
                              <Link2 className="w-4 h-4" />
                              Conectar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Webhooks */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="w-5 h-5 text-primary" />
                      Webhooks
                    </CardTitle>
                    <CardDescription>Configure endpoints para receber eventos</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2" onClick={() => alert("Criação de webhook em desenvolvimento!")}>
                    <Plus className="w-4 h-4" />
                    Novo Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-revenue-confirmed/10">
                          <CheckCircle2 className="w-4 h-4 text-revenue-confirmed" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Novo Lead</h4>
                          <p className="text-sm text-muted-foreground">https://api.example.com/webhooks/lead</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">lead.created</Badge>
                      <Badge variant="outline" className="text-xs">lead.updated</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Notificações por E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "emailNovoLead" as const, label: "Novo lead cadastrado", desc: "Receba um e-mail quando um novo lead entrar" },
                    { key: "emailAgendamento" as const, label: "Novo agendamento", desc: "Notificação de novos agendamentos" },
                    { key: "emailNoShow" as const, label: "No-show detectado", desc: "Alerta quando paciente não comparece" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={notificacoes[item.key]} 
                        onCheckedChange={(checked) => setNotificacoes({...notificacoes, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Notificações Push
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "pushNovoLead" as const, label: "Novo lead", desc: "Push quando um novo lead entrar" },
                    { key: "pushLembrete" as const, label: "Lembretes de agenda", desc: "Alertas de próximos agendamentos" },
                    { key: "pushInadimplencia" as const, label: "Inadimplência", desc: "Alerta de pagamentos em atraso" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={notificacoes[item.key]} 
                        onCheckedChange={(checked) => setNotificacoes({...notificacoes, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Mensagens Automáticas WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "whatsappConfirmacao" as const, label: "Confirmação de agendamento", desc: "Enviar confirmação após agendar" },
                      { key: "whatsappLembrete24h" as const, label: "Lembrete 24h antes", desc: "Lembrar paciente 24h antes" },
                      { key: "whatsappLembrete2h" as const, label: "Lembrete 2h antes", desc: "Lembrar paciente 2h antes" },
                      { key: "whatsappPosProcedimento" as const, label: "Pós-procedimento", desc: "Orientações após procedimento" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={notificacoes[item.key]} 
                          onCheckedChange={(checked) => setNotificacoes({...notificacoes, [item.key]: checked})}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Preferências de Agenda
                </CardTitle>
                <CardDescription>Configure o comportamento padrão dos agendamentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Duração Padrão</Label>
                    <Select value={prefsAgenda.duracaoPadrao} onValueChange={(v) => setPrefsAgenda({...prefsAgenda, duracaoPadrao: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1h 30min</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Intervalo Mínimo</Label>
                    <Select value={prefsAgenda.intervaloMinimo} onValueChange={(v) => setPrefsAgenda({...prefsAgenda, intervaloMinimo: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem intervalo</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Antecedência Mínima</Label>
                    <Select value={prefsAgenda.antecedenciaMinima} onValueChange={(v) => setPrefsAgenda({...prefsAgenda, antecedenciaMinima: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                        <SelectItem value="24">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Limite Desmarcação</Label>
                    <Select value={prefsAgenda.limiteDesmarcacao} onValueChange={(v) => setPrefsAgenda({...prefsAgenda, limiteDesmarcacao: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 horas antes</SelectItem>
                        <SelectItem value="12">12 horas antes</SelectItem>
                        <SelectItem value="24">24 horas antes</SelectItem>
                        <SelectItem value="48">48 horas antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Automações</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: "confirmacaoAutomatica" as const, label: "Confirmação automática", desc: "Confirmar agendamento automaticamente" },
                      { key: "lembreteAutomatico" as const, label: "Lembrete automático", desc: "Enviar lembretes antes do horário" },
                      { key: "permitirRemarcacao" as const, label: "Permitir remarcação", desc: "Paciente pode remarcar pelo link" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={prefsAgenda[item.key] as boolean} 
                          onCheckedChange={(checked) => setPrefsAgenda({...prefsAgenda, [item.key]: checked})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horários de Funcionamento */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horários de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia, idx) => (
                    <div key={dia} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <Switch defaultChecked={idx < 6} />
                      <span className="w-24 font-medium text-foreground">{dia}</span>
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="08:00" className="w-28" disabled={idx === 6} />
                        <span className="text-muted-foreground">às</span>
                        <Input type="time" defaultValue={idx === 5 ? "14:00" : "20:00"} className="w-28" disabled={idx === 6} />
                      </div>
                      {idx < 5 && (
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-sm text-muted-foreground">Intervalo:</span>
                          <Input type="time" defaultValue="12:00" className="w-28" />
                          <span className="text-muted-foreground">às</span>
                          <Input type="time" defaultValue="14:00" className="w-28" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Chaves de acesso para integrações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <Label>API Key Principal</Label>
                      <Badge variant="secondary">Produção</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        type={showApiKey ? "text" : "password"} 
                        value="sk_live_xxxxxxxxxxxxxxxxxxxxx" 
                        readOnly 
                        className="font-mono"
                      />
                      <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Criada em 01/01/2025</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Gerar Nova API Key
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Autenticação em 2 fatores</p>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Notificar login suspeito</p>
                      <p className="text-sm text-muted-foreground">Receba alertas de acessos incomuns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Sessões ativas</p>
                      <p className="text-sm text-muted-foreground">2 dispositivos conectados</p>
                    </div>
                    <Button variant="outline" size="sm">Gerenciar</Button>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full gap-2">
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Backup e Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">Último backup</p>
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Automático
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">14/01/2025 às 03:00</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Database className="w-4 h-4" />
                      Fazer Backup
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Restaurar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Zona de Perigo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                    <h4 className="font-medium text-foreground mb-1">Exportar todos os dados</h4>
                    <p className="text-sm text-muted-foreground mb-3">Baixe uma cópia de todos os seus dados</p>
                    <Button variant="outline" size="sm">Solicitar Exportação</Button>
                  </div>
                  <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-1">Excluir conta</h4>
                    <p className="text-sm text-muted-foreground mb-3">Esta ação é irreversível e excluirá todos os dados</p>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Excluir Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
