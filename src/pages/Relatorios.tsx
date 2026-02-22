import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuotes } from "@/hooks/useQuotes";
import { useLeads } from "@/hooks/useLeads";
import { useAppointments } from "@/hooks/useAppointments";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  DollarSign,
  Users,
  Target,
  Percent,
  UserX
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

const MetricCard = ({ title, value, change, icon, trend, subtitle }: MetricCardProps) => (
  <Card className="glass-card">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-primary/10">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${
          trend === "up" ? "text-revenue-confirmed" : 
          trend === "down" ? "text-revenue-at-risk" : "text-muted-foreground"
        }`}>
          {trend === "up" ? <TrendingUp className="w-4 h-4" /> : 
           trend === "down" ? <TrendingDown className="w-4 h-4" /> : null}
          <span>{change > 0 ? "+" : ""}{change}% vs mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Relatorios() {
  const [activeSection, setActiveSection] = useState("relatorios");
  const [periodo, setPeriodo] = useState("mes");
  const { quotes } = useQuotes();
  const { leads } = useLeads();
  const { appointments } = useAppointments();

  // Calcular métricas de faturamento
  const metrics = useMemo(() => {
    const approved = quotes.filter(q => q.status === 'approved');
    const sent = quotes.filter(q => q.status === 'sent');
    
    const totalFaturamento = approved.reduce((sum, q) => sum + q.total, 0);
    const totalQuotes = quotes.length;
    const ticketMedio = totalQuotes > 0 ? totalFaturamento / approved.length : 0;
    
    // Taxa de conversão (leads convertidos = quotes aprovadas)
    const leadsTotal = leads.length;
    const convertidos = approved.length;
    const taxaConversao = leadsTotal > 0 ? (convertidos / leadsTotal) * 100 : 0;
    
    // Perdas por no-show (agendamentos cancelados ou faltou)
    const noShows = appointments.filter(a => a.status === 'faltou').length;
    const totalPerdaNoShow = noShows * (totalFaturamento / Math.max(approved.length, 1));
    
    return {
      totalFaturamento,
      ticketMedio,
      taxaConversao,
      totalPerdaNoShow,
      leadsTotal,
      convertidos,
      noShows,
      approved,
      sent,
      quotes
    };
  }, [quotes, leads, appointments]);

  // Gerar dados de faturamento por período (últimos 30 dias)
  const faturamentoPeriodo = useMemo(() => {
    const meses = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'];
    return meses.map(mes => {
      // Simulado: dividir o faturamento por mês
      const faturado = Math.round((metrics.totalFaturamento / 7) + (Math.random() * 5000));
      return {
        mes,
        faturado,
        meta: 100000,
        previsto: faturado + 5000
      };
    });
  }, [metrics.totalFaturamento]);

  // Faturamento por profissional (simulado a partir de quotes)
  const faturamentoProfissional = useMemo(() => {
    const professionals = new Map<string, { valor: number; procedimentos: number }>();
    
    metrics.approved.forEach(quote => {
      const prof = quote.patient?.full_name || 'Sem profissional';
      if (!professionals.has(prof)) {
        professionals.set(prof, { valor: 0, procedimentos: 0 });
      }
      const current = professionals.get(prof)!;
      current.valor += quote.total;
      current.procedimentos += quote.items?.length || 1;
    });
    
    return Array.from(professionals.entries()).map(([nome, data]) => ({
      nome,
      valor: data.valor,
      procedimentos: data.procedimentos,
      ticketMedio: data.procedimentos > 0 ? data.valor / data.procedimentos : 0
    })).slice(0, 4);
  }, [metrics.approved]);

  // Faturamento por procedimento (simulado)
  const faturamentoProcedimento = useMemo(() => {
    const procedures = new Map<string, number>();
    
    metrics.approved.forEach(quote => {
      quote.items?.forEach(item => {
        const proc = item.procedure_name;
        procedures.set(proc, (procedures.get(proc) || 0) + item.total_price);
      });
    });
    
    const data = Array.from(procedures.entries()).map(([nome, valor]) => ({
      nome,
      valor,
      quantidade: Math.round(Math.random() * 50) + 10,
      ticketMedio: Math.round(Math.random() * 2000) + 500,
      cor: `hsl(${Math.random() * 60 + 160}, 70%, 50%)`
    })).slice(0, 5);
    
    return data.length > 0 ? data : [];
  }, [metrics.approved]);

  const handleExport = () => {
    const data = { 
      ...metrics, 
      periodo, 
      date: new Date().toISOString() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${periodo}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-8 ml-12 md:ml-0">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Análise completa do desempenho da clínica</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-32 md:w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Esta Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exportar</span>
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Faturamento Total"
            value={formatCurrency(metrics.totalFaturamento)}
            change={12.5}
            trend="up"
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(Math.round(metrics.ticketMedio))}
            change={5.2}
            trend="up"
            icon={<Target className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${metrics.taxaConversao.toFixed(1)}%`}
            change={8.3}
            trend="up"
            icon={<Percent className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Perda por No-Show"
            value={formatCurrency(metrics.totalPerdaNoShow)}
            change={-15}
            trend="down"
            subtitle={`${metrics.noShows} no-shows este mês`}
            icon={<UserX className="w-5 h-5 text-revenue-at-risk" />}
          />
        </div>

        <Tabs defaultValue="faturamento" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="conversao">Conversão</TabsTrigger>
            <TabsTrigger value="perdas">Análise de Perdas</TabsTrigger>
          </TabsList>

          {/* Tab Faturamento */}
          <TabsContent value="faturamento" className="space-y-6">
            {/* Gráfico de Faturamento por Período */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Faturamento por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={faturamentoPeriodo}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar dataKey="faturado" name="Faturado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="meta" name="Meta" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Faturamento por Profissional */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Faturamento por Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {faturamentoProfissional.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum dado de faturamento disponível</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {faturamentoProfissional.map((prof, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold text-sm">
                            {prof.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-foreground">{prof.nome}</span>
                              <span className="font-bold text-foreground">{formatCurrency(prof.valor)}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{prof.procedimentos} procedimentos</span>
                              <span>Ticket: {formatCurrency(Math.round(prof.ticketMedio))}</span>
                            </div>
                            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
                                style={{ width: `${Math.min((prof.valor / 50000) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Faturamento por Procedimento */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Faturamento por Procedimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {faturamentoProcedimento.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum procedimento registrado</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={faturamentoProcedimento}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="valor"
                            >
                              {faturamentoProcedimento.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.cor} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {faturamentoProcedimento.map((proc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: proc.cor }} />
                            <span className="text-muted-foreground truncate">{proc.nome}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Conversão */}
          <TabsContent value="conversao" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Análise de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Total de Leads</p>
                    <p className="text-3xl font-bold text-foreground">{metrics.leadsTotal}</p>
                  </div>
                  <div className="p-6 bg-revenue-confirmed/5 rounded-xl border border-revenue-confirmed/20">
                    <p className="text-sm text-muted-foreground mb-2">Leads Convertidos</p>
                    <p className="text-3xl font-bold text-revenue-confirmed">{metrics.convertidos}</p>
                  </div>
                  <div className="p-6 bg-teal-500/5 rounded-xl border border-teal-500/20">
                    <p className="text-sm text-muted-foreground mb-2">Taxa de Conversão</p>
                    <p className="text-3xl font-bold text-teal-600">{metrics.taxaConversao.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Análise de Perdas */}
          <TabsContent value="perdas" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-revenue-at-risk" />
                  Análise de Perdas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-revenue-at-risk/5 rounded-xl border border-revenue-at-risk/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Perda por No-Show</p>
                        <p className="text-2xl font-bold text-revenue-at-risk">{formatCurrency(metrics.totalPerdaNoShow)}</p>
                        <p className="text-xs text-muted-foreground mt-2">{metrics.noShows} agendamentos não confirmados</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Tendência de No-Shows</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { mes: "Jul", noShows: 8, valorPerdido: 12000 },
                              { mes: "Ago", noShows: 12, valorPerdido: 18500 },
                              { mes: "Set", noShows: 15, valorPerdido: 22000 },
                              { mes: "Out", noShows: 10, valorPerdido: 15000 },
                              { mes: "Nov", noShows: 7, valorPerdido: 10500 },
                              { mes: "Dez", noShows: 5, valorPerdido: 7500 },
                              { mes: "Jan", noShows: metrics.noShows, valorPerdido: metrics.totalPerdaNoShow },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "8px",
                                }}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="noShows" name="No-Shows" stroke="hsl(var(--revenue-at-risk))" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Recomendações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-foreground">Implementar confirmação automática</p>
                            <p className="text-xs text-muted-foreground mt-1">Enviar lembretes via SMS/WhatsApp 24h antes</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-foreground">Política de cancelamento</p>
                            <p className="text-xs text-muted-foreground mt-1">Implementar taxa de multa para no-shows</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-foreground">Análise de padrões</p>
                            <p className="text-xs text-muted-foreground mt-1">Identificar horários/dias com maior taxa</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
