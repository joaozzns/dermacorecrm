import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Clock,
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

// Dados de faturamento por período
const faturamentoPeriodo = [
  { mes: "Jul", faturado: 85000, meta: 100000, previsto: 88000 },
  { mes: "Ago", faturado: 92000, meta: 100000, previsto: 95000 },
  { mes: "Set", faturado: 78000, meta: 100000, previsto: 82000 },
  { mes: "Out", faturado: 105000, meta: 100000, previsto: 102000 },
  { mes: "Nov", faturado: 118000, meta: 110000, previsto: 115000 },
  { mes: "Dez", faturado: 135000, meta: 120000, previsto: 130000 },
  { mes: "Jan", faturado: 98000, meta: 110000, previsto: 105000 },
];

// Faturamento por profissional
const faturamentoProfissional = [
  { nome: "Dra. Renata", valor: 45000, procedimentos: 48, ticketMedio: 937.5 },
  { nome: "Dr. Carlos", valor: 38000, procedimentos: 35, ticketMedio: 1085.7 },
  { nome: "Dra. Marina", valor: 32000, procedimentos: 42, ticketMedio: 761.9 },
  { nome: "Dr. Felipe", valor: 28000, procedimentos: 30, ticketMedio: 933.3 },
];

// Faturamento por procedimento
const faturamentoProcedimento = [
  { nome: "Harmonização Facial", valor: 52000, quantidade: 28, ticketMedio: 1857, cor: "#0D9488" },
  { nome: "Botox", valor: 35000, quantidade: 70, ticketMedio: 500, cor: "#14B8A6" },
  { nome: "Preenchimento", valor: 28000, quantidade: 35, ticketMedio: 800, cor: "#2DD4BF" },
  { nome: "Bioestimulador", valor: 22000, quantidade: 18, ticketMedio: 1222, cor: "#5EEAD4" },
  { nome: "Skinbooster", valor: 18000, quantidade: 30, ticketMedio: 600, cor: "#99F6E4" },
];

// Conversão por canal
const conversaoCanal = [
  { canal: "Instagram", leads: 145, convertidos: 42, taxa: 29, roi: 450, investimento: 2500 },
  { canal: "Google Ads", leads: 98, convertidos: 35, taxa: 36, roi: 520, investimento: 3200 },
  { canal: "Facebook", leads: 67, convertidos: 15, taxa: 22, roi: 280, investimento: 1800 },
  { canal: "Indicação", leads: 52, convertidos: 38, taxa: 73, roi: 0, investimento: 0 },
  { canal: "Site", leads: 43, convertidos: 18, taxa: 42, roi: 380, investimento: 1500 },
  { canal: "WhatsApp", leads: 35, convertidos: 12, taxa: 34, roi: 0, investimento: 0 },
];

// Perdas por no-show
const perdasNoShow = [
  { mes: "Jul", noShows: 8, valorPerdido: 12000, recuperado: 4500 },
  { mes: "Ago", noShows: 12, valorPerdido: 18500, recuperado: 6200 },
  { mes: "Set", noShows: 15, valorPerdido: 22000, recuperado: 8500 },
  { mes: "Out", noShows: 10, valorPerdido: 15000, recuperado: 7200 },
  { mes: "Nov", noShows: 7, valorPerdido: 10500, recuperado: 5800 },
  { mes: "Dez", noShows: 5, valorPerdido: 7500, recuperado: 4200 },
  { mes: "Jan", noShows: 9, valorPerdido: 13500, recuperado: 5000 },
];

// Perdas por falta de follow-up
const perdasFollowUp = [
  { mes: "Jul", leadsEsfriados: 25, valorPerdido: 35000 },
  { mes: "Ago", leadsEsfriados: 32, valorPerdido: 48000 },
  { mes: "Set", leadsEsfriados: 28, valorPerdido: 42000 },
  { mes: "Out", leadsEsfriados: 18, valorPerdido: 27000 },
  { mes: "Nov", leadsEsfriados: 15, valorPerdido: 22500 },
  { mes: "Dez", leadsEsfriados: 12, valorPerdido: 18000 },
  { mes: "Jan", leadsEsfriados: 20, valorPerdido: 30000 },
];

const COLORS = ["#0D9488", "#14B8A6", "#2DD4BF", "#5EEAD4", "#99F6E4"];

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
          {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : 
           trend === "down" ? <ArrowDownRight className="w-4 h-4" /> : null}
          <span>{change > 0 ? "+" : ""}{change}% vs mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Relatorios() {
  const [activeSection, setActiveSection] = useState("relatorios");
  const [periodo, setPeriodo] = useState("mes");

  const totalFaturamento = 143000;
  const ticketMedio = 892;
  const taxaConversao = 34.5;
  const totalPerdaNoShow = 13500;

  const handleExport = () => {
    const data = { totalFaturamento, ticketMedio, taxaConversao, totalPerdaNoShow, periodo, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${periodo}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análise completa do desempenho da clínica</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
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
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Faturamento Total"
            value={formatCurrency(totalFaturamento)}
            change={12.5}
            trend="up"
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(ticketMedio)}
            change={5.2}
            trend="up"
            icon={<Target className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${taxaConversao}%`}
            change={8.3}
            trend="up"
            icon={<Percent className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Perda por No-Show"
            value={formatCurrency(totalPerdaNoShow)}
            change={-15}
            trend="down"
            subtitle="9 no-shows este mês"
            icon={<UserX className="w-5 h-5 text-revenue-at-risk" />}
          />
        </div>

        <Tabs defaultValue="faturamento" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="conversao">Conversão</TabsTrigger>
            <TabsTrigger value="perdas">Análise de Perdas</TabsTrigger>
            <TabsTrigger value="previsao">Previsão</TabsTrigger>
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
                    Faturamento por Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                            <span>Ticket: {formatCurrency(prof.ticketMedio)}</span>
                          </div>
                          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
                              style={{ width: `${(prof.valor / 50000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  Conversão e ROI por Canal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Canal</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Leads</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Convertidos</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Taxa</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Investimento</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversaoCanal.map((canal, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-medium text-foreground">{canal.canal}</span>
                          </td>
                          <td className="py-4 px-4 text-center text-foreground">{canal.leads}</td>
                          <td className="py-4 px-4 text-center text-foreground">{canal.convertidos}</td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant={canal.taxa >= 35 ? "default" : canal.taxa >= 25 ? "secondary" : "outline"}>
                              {canal.taxa}%
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center text-muted-foreground">
                            {canal.investimento > 0 ? formatCurrency(canal.investimento) : "-"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {canal.roi > 0 ? (
                              <span className="text-revenue-confirmed font-medium">{canal.roi}%</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="h-64 mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversaoCanal} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="canal" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                      <Tooltip />
                      <Bar dataKey="leads" name="Leads" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="convertidos" name="Convertidos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Perdas */}
          <TabsContent value="perdas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="glass-card border-l-4 border-l-revenue-at-risk">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-revenue-at-risk/10">
                      <XCircle className="w-6 h-6 text-revenue-at-risk" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Perdido (No-Show)</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(99000)}</p>
                      <p className="text-xs text-muted-foreground">66 no-shows nos últimos 7 meses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-l-4 border-l-revenue-confirmed">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-revenue-confirmed/10">
                      <TrendingUp className="w-6 h-6 text-revenue-confirmed" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recuperado</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(41400)}</p>
                      <p className="text-xs text-muted-foreground">42% de taxa de recuperação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Perdas por No-Show */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-revenue-at-risk" />
                    Perdas por No-Show
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perdasNoShow}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Area 
                          type="monotone" 
                          dataKey="valorPerdido" 
                          name="Valor Perdido"
                          stroke="hsl(var(--revenue-at-risk))" 
                          fill="hsl(var(--revenue-at-risk) / 0.2)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="recuperado" 
                          name="Recuperado"
                          stroke="hsl(var(--revenue-confirmed))" 
                          fill="hsl(var(--revenue-confirmed) / 0.2)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Perdas por Falta de Follow-up */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Perdas por Falta de Follow-up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={perdasFollowUp}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar 
                          dataKey="valorPerdido" 
                          name="Valor Perdido"
                          fill="#F59E0B" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      150 leads esfriaram por falta de follow-up, totalizando {formatCurrency(222500)} em perda potencial.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Previsão */}
          <TabsContent value="previsao" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Previsão de Faturamento Baseada na Agenda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Próximos 7 dias</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(35000)}</p>
                    <p className="text-xs text-muted-foreground">42 agendamentos confirmados</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Próximos 30 dias</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(142000)}</p>
                    <p className="text-xs text-muted-foreground">156 agendamentos totais</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Receita em Risco</p>
                    <p className="text-2xl font-bold text-revenue-at-risk">{formatCurrency(28000)}</p>
                    <p className="text-xs text-muted-foreground">18 agendamentos pendentes</p>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={faturamentoPeriodo}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="faturado" 
                        name="Realizado"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.3)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="previsto" 
                        name="Previsto"
                        stroke="hsl(var(--muted-foreground))" 
                        fill="hsl(var(--muted) / 0.3)"
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
