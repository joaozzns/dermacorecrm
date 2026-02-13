import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuotes } from "@/hooks/useQuotes";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import {
  DollarSign,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  PiggyBank,
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  alert?: boolean;
}

const MetricCard = ({ title, value, change, icon, trend, subtitle, alert }: MetricCardProps) => (
  <Card className={`glass-card ${alert ? 'border-l-4 border-l-revenue-at-risk' : ''}`}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${alert ? 'bg-revenue-at-risk/10' : 'bg-primary/10'}`}>
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

export default function Financeiro() {
  const [activeSection, setActiveSection] = useState("financeiro");
  const [searchTerm, setSearchTerm] = useState("");
  const { quotes } = useQuotes();
  const { teamMembers } = useTeamMembers();

  // Calcular métricas baseadas em orçamentos
  const metrics = useMemo(() => {
    const approved = quotes.filter(q => q.status === 'approved');
    const sent = quotes.filter(q => q.status === 'sent');
    const draft = quotes.filter(q => q.status === 'draft');
    
    const receitaConfirmada = approved.reduce((sum, q) => sum + q.total, 0);
    const receitaPrevista = sent.reduce((sum, q) => sum + q.total, 0);
    const receitaTotal = receitaConfirmada + receitaPrevista;
    const despesasTotal = receitaTotal * 0.41;
    const saldoAtual = receitaTotal - despesasTotal;
    
    return { 
      receitaTotal, 
      despesasTotal, 
      saldoAtual, 
      approved, 
      sent, 
      draft,
      receitaConfirmada
    };
  }, [quotes]);

  // Gerar dados de fluxo de caixa dos últimos 7 dias
  const fluxoCaixa = useMemo(() => {
    const today = new Date();
    const data: any[] = [];
    let cumulativeSaldo = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' });
      
      const dayQuotes = metrics.approved.filter(q => {
        const qDate = new Date(q.approved_at || '');
        return qDate.toDateString() === date.toDateString();
      });
      
      const entradas = dayQuotes.reduce((sum, q) => sum + q.total, 0);
      const saidas = entradas > 0 ? entradas * 0.35 : 0;
      cumulativeSaldo += entradas - saidas;
      
      data.push({ data: dateStr, entradas, saidas, saldo: cumulativeSaldo });
    }
    
    return data;
  }, [metrics.approved]);

  // Pagamentos a partir de orçamentos aprovados
  const pagamentosRecebidos = useMemo(() => {
    return metrics.approved.map((quote, idx) => ({
      id: idx + 1,
      paciente: quote.patient?.full_name || quote.lead?.name || 'Cliente sem nome',
      procedimento: quote.items?.[0]?.procedure_name || 'Serviço',
      valor: quote.total,
      forma: 'Transferência',
      parcelas: '-',
      data: new Date(quote.approved_at || '').toLocaleDateString('pt-BR'),
      status: 'pago' as const,
    })).slice(0, 5);
  }, [metrics.approved]);

  // Comissões por profissional
  const comissoes = useMemo(() => {
    return teamMembers
      .filter(tm => tm.current_revenue && tm.current_revenue > 0)
      .map(tm => ({
        profissional: tm.profiles?.full_name || 'Sem nome',
        faturamento: tm.current_revenue || 0,
        percentual: 40,
        comissao: ((tm.current_revenue || 0) * 0.4),
        procedimentos: 0,
      }));
  }, [teamMembers]);

  const inadimplenciaTotal = 0;
  const parcelamentos: any[] = [];
  const inadimplentes: any[] = [];

  const handleExport = () => {
    const data = { 
      ...metrics, 
      pagamentosRecebidos,
      comissoes,
      date: new Date().toISOString() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewTransaction = () => {
    alert('Funcionalidade de nova transação em desenvolvimento. Em breve você poderá adicionar transações diretamente aqui.');
  };

  const handleSendReminder = (paciente: string) => {
    const phone = "5511999999999";
    const message = encodeURIComponent(`Olá ${paciente}! Este é um lembrete sobre o pagamento pendente. Entre em contato conosco.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <main className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">Controle financeiro da clínica</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={handleNewTransaction}>
              <Plus className="w-4 h-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Receita do Mês"
            value={formatCurrency(metrics.receitaTotal)}
            change={12.5}
            trend="up"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Despesas"
            value={formatCurrency(metrics.despesasTotal)}
            change={-5.2}
            trend="down"
            icon={<TrendingDown className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Saldo Atual"
            value={formatCurrency(metrics.saldoAtual)}
            subtitle="Caixa + Banco"
            icon={<Wallet className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Orçamentos Pendentes"
            value={metrics.sent.length.toString()}
            subtitle={`${formatCurrency(metrics.sent.reduce((s, q) => s + q.total, 0))}`}
            icon={<AlertCircle className="w-5 h-5 text-revenue-at-risk" />}
            alert
          />
        </div>

        {/* Fluxo de Caixa Visual */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-primary" />
              Fluxo de Caixa - Últimos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={fluxoCaixa}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="data" stroke="hsl(var(--muted-foreground))" />
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
                  <Bar dataKey="entradas" name="Entradas" fill="hsl(var(--revenue-confirmed))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" name="Saídas" fill="hsl(var(--revenue-at-risk))" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="saldo" name="Saldo" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pagamentos" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            <TabsTrigger value="parcelamentos">Parcelamentos</TabsTrigger>
            <TabsTrigger value="comissoes">Comissões</TabsTrigger>
            <TabsTrigger value="inadimplencia">Inadimplência</TabsTrigger>
          </TabsList>

          {/* Tab Pagamentos */}
          <TabsContent value="pagamentos" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-primary" />
                    Pagamentos Recebidos
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar pagamento..."
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {pagamentosRecebidos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum pagamento aprovado ainda</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Paciente</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Procedimento</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Valor</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Forma</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Data</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagamentosRecebidos.map((pagamento) => (
                          <tr key={pagamento.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-medium text-foreground">{pagamento.paciente}</span>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{pagamento.procedimento}</td>
                            <td className="py-4 px-4 text-center font-medium text-foreground">
                              {formatCurrency(pagamento.valor)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{pagamento.forma}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center text-muted-foreground">{pagamento.data}</td>
                            <td className="py-4 px-4 text-center">
                              <Badge variant="default">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Pago
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Parcelamentos */}
          <TabsContent value="parcelamentos" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Parcelamentos Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {parcelamentos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum parcelamento ativo no momento</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {parcelamentos.map((parc) => (
                      <div key={parc.id} className="p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-foreground">{parc.paciente}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(parc.valorTotal)} em {parc.parcelas}x de {formatCurrency(parc.valorParcela)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Próx. vencimento</p>
                            <p className="font-medium text-foreground">{parc.proxVencimento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={(parc.pagas / parc.parcelas) * 100} className="flex-1" />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {parc.pagas}/{parc.parcelas} pagas
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Orçamentos Enviados (A Confirmar)</p>
                      <p className="text-sm text-muted-foreground">Valor total aguardando aprovação</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(metrics.sent.reduce((s, q) => s + q.total, 0))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Comissões */}
          <TabsContent value="comissoes" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Comissões por Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comissoes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum profissional com faturamento registrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comissoes.map((comm, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-foreground">{comm.profissional}</p>
                            <p className="text-sm text-muted-foreground">
                              Faturamento: {formatCurrency(comm.faturamento)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{formatCurrency(comm.comissao)}</p>
                            <p className="text-sm text-muted-foreground">{comm.percentual}% de comissão</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={Math.min((comm.faturamento / 50000) * 100, 100)} className="flex-1" />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {comm.procedimentos} procedimentos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Inadimplência */}
          <TabsContent value="inadimplencia" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-revenue-at-risk" />
                  Clientes em Atraso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inadimplentes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum cliente em atraso 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inadimplentes.map((cliente, idx) => (
                      <div key={idx} className="p-4 bg-revenue-at-risk/5 rounded-xl border border-revenue-at-risk/20">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-foreground">{cliente.paciente}</p>
                            <p className="text-sm text-muted-foreground">
                              {cliente.procedimento} • {cliente.diasAtraso} dias em atraso
                            </p>
                          </div>
                          <p className="text-lg font-bold text-revenue-at-risk">{formatCurrency(cliente.valor)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(cliente.paciente)}>
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            Enviar Lembrete
                          </Button>
                          <span className="text-xs text-muted-foreground">Último contato: {cliente.ultimoContato}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}
