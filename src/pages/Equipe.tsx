import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  Target,
  Plus,
  Search,
  Clock,
  DollarSign,
  Award,
  Edit,
  MoreVertical,
  Link2,
  Loader2,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTeamMembers, TeamMember } from "@/hooks/useTeamMembers";
import { InviteManagement } from "@/components/clinic/InviteManagement";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

interface ProfissionalCardProps {
  member: TeamMember;
}

const ProfissionalCard = ({ member }: ProfissionalCardProps) => {
  const name = member.profiles?.full_name || "Sem nome";
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const goal = member.monthly_goal || 0;
  const revenue = member.current_revenue || 0;
  const progress = goal > 0 ? (revenue / goal) * 100 : 0;
  const schedule = member.work_schedule as { horarios?: string[]; diasTrabalho?: string[] } | null;

  return (
    <Card className="glass-card hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={member.profiles?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{member.specialty || "Sem especialidade"}</p>
              {member.registration_number && (
                <Badge variant="outline" className="mt-1 text-xs">CRM/CRO: {member.registration_number}</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={member.is_active ? "default" : "secondary"} className="text-xs">
              {member.is_active ? "Ativo" : "Inativo"}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {member.profiles?.role || "staff"}
            </Badge>
          </div>
        </div>

        {goal > 0 && (
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-primary">{formatCurrency(revenue)}</p>
                <p className="text-xs text-muted-foreground">Receita</p>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <p className="text-lg font-bold text-foreground">{formatCurrency(goal)}</p>
                <p className="text-xs text-muted-foreground">Meta</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
          </div>
        )}

        {schedule?.horarios && schedule.horarios.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{schedule.horarios.join(" / ")}</span>
          </div>
        )}
        {schedule?.diasTrabalho && schedule.diasTrabalho.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{schedule.diasTrabalho.join(", ")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Equipe() {
  const [activeSection, setActiveSection] = useState("equipe");
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { teamMembers, isLoading } = useTeamMembers();

  const filteredMembers = teamMembers.filter((m) => {
    const name = m.profiles?.full_name || "";
    const specialty = m.specialty || "";
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || specialty.toLowerCase().includes(term);
  });

  const activeCount = teamMembers.filter(m => m.is_active).length;
  const totalRevenue = teamMembers.reduce((acc, m) => acc + (m.current_revenue || 0), 0);

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Equipe</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Gestão de profissionais e convites</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setShowInviteDialog(true)}>
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">Novo Profissional</span>
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                  <p className="text-sm text-muted-foreground">Profissionais Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Total na Equipe</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profissionais" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
            <TabsTrigger value="convites">Convites</TabsTrigger>
          </TabsList>

          {/* Tab Profissionais */}
          <TabsContent value="profissionais">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar profissional..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">Nenhum profissional encontrado</p>
                <p className="text-sm mt-1">Convide membros para sua equipe gerando um link de convite.</p>
                <Button className="mt-4 gap-2" onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="w-4 h-4" />
                  Convidar Profissional
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMembers.map((member) => (
                  <ProfissionalCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Convites */}
          <TabsContent value="convites">
            <InviteManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog para gerar convite */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Convidar Profissional</DialogTitle>
            <DialogDescription>
              Gere um link de convite para adicionar novos profissionais à sua clínica.
            </DialogDescription>
          </DialogHeader>
          <InviteManagement />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
