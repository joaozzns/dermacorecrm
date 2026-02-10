import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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

// Fluxo de Caixa
const fluxoCaixa = [
  { data: "01/01", entradas: 12500, saidas: 8200, saldo: 4300 },
  { data: "02/01", entradas: 8900, saidas: 5100, saldo: 8100 },
  { data: "03/01", entradas: 15200, saidas: 9800, saldo: 13500 },
  { data: "04/01", entradas: 6800, saidas: 12400, saldo: 7900 },
  { data: "05/01", entradas: 18500, saidas: 7600, saldo: 18800 },
  { data: "06/01", entradas: 9200, saidas: 4300, saldo: 23700 },
  { data: "07/01", entradas: 14800, saidas: 11200, saldo: 27300 },
];

// Pagamentos recebidos
const pagamentosRecebidos = [
  { id: 1, paciente: "Ana Costa", procedimento: "Harmonização Facial", valor: 3500, forma: "Cartão Crédito", parcelas: "3x", data: "07/01/2025", status: "pago" },
  { id: 2, paciente: "Carlos Silva", procedimento: "Botox", valor: 1200, forma: "PIX", parcelas: "-", data: "07/01/2025", status: "pago" },
  { id: 3, paciente: "Marina Oliveira", procedimento: "Preenchimento Labial", valor: 1800, forma: "Cartão Débito", parcelas: "-", data: "06/01/2025", status: "pago" },
  { id: 4, paciente: "Roberto Santos", procedimento: "Bioestimulador", valor: 2500, forma: "Cartão Crédito", parcelas: "5x", data: "06/01/2025", status: "pendente" },
  { id: 5, paciente: "Fernanda Lima", procedimento: "Skinbooster", valor: 900, forma: "Dinheiro", parcelas: "-", data: "05/01/2025", status: "pago" },
];

// Parcelamentos ativos
const parcelamentos = [
  { id: 1, paciente: "Ana Costa", valorTotal: 3500, parcelas: 3, pagas: 1, proxVencimento: "07/02/2025", valorParcela: 1166.67 },
  { id: 2, paciente: "Roberto Santos", valorTotal: 2500, parcelas: 5, pagas: 0, proxVencimento: "06/02/2025", valorParcela: 500 },
  { id: 3, paciente: "Juliana Mendes", valorTotal: 4200, parcelas: 6, pagas: 3, proxVencimento: "15/01/2025", valorParcela: 700 },
  { id: 4, paciente: "Pedro Alves", valorTotal: 1800, parcelas: 2, pagas: 1, proxVencimento: "20/01/2025", valorParcela: 900 },
];

// Comissões
const comissoes = [
  { profissional: "Dra. Renata", faturamento: 45000, percentual: 40, comissao: 18000, procedimentos: 48 },
  { profissional: "Dr. Carlos", faturamento: 38000, percentual: 35, comissao: 13300, procedimentos: 35 },
  { profissional: "Dra. Marina", faturamento: 32000, percentual: 40, comissao: 12800, procedimentos: 42 },
  { profissional: "Consultora Ana", faturamento: 28000, percentual: 10, comissao: 2800, procedimentos: 0 },
];

// Inadimplência
const inadimplentes = [
  { paciente: "Maria Silva", valor: 1500, diasAtraso: 15, procedimento: "Harmonização", ultimoContato: "05/01/2025" },
  { paciente: "João Pereira", valor: 800, diasAtraso: 30, procedimento: "Botox", ultimoContato: "28/12/2024" },
  { paciente: "Camila Santos", valor: 2200, diasAtraso: 7, procedimento: "Bioestimulador", ultimoContato: "10/01/2025" },
];

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

  const receitaTotal = 143000;
  const despesasTotal = 58500;
  const saldoAtual = 84500;
  const inadimplenciaTotal = 4500;

  const handleExport = () => {
    const data = { receitaTotal, despesasTotal, saldoAtual, inadimplenciaTotal, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewTransaction = () => {
    // This would open a modal in a full implementation
    alert('Funcionalidade de nova transação em desenvolvimento. Em breve você poderá adicionar transações diretamente aqui.');
  };

  const handleSendReminder = (paciente: string) => {
    const phone = "5511999999999"; // Would come from data
    const message = encodeURIComponent(`Olá ${paciente}! Este é um lembrete sobre o pagamento pendente. Entre em contato conosco.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCall = (paciente: string) => {
    window.open('tel:+5511999999999', '_self');
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
            value={formatCurrency(receitaTotal)}
            change={12.5}
            trend="up"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Despesas"
            value={formatCurrency(despesasTotal)}
            change={-5.2}
            trend="down"
            icon={<TrendingDown className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Saldo Atual"
            value={formatCurrency(saldoAtual)}
            subtitle="Caixa + Banco"
            icon={<Wallet className="w-5 h-5 text-primary" />}
          />
          <MetricCard
            title="Inadimplência"
            value={formatCurrency(inadimplenciaTotal)}
            subtitle="3 clientes em atraso"
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Paciente</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Procedimento</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Valor</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Forma</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Parcelas</th>
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
                          <td className="py-4 px-4 text-center text-muted-foreground">{pagamento.parcelas}</td>
                          <td className="py-4 px-4 text-center text-muted-foreground">{pagamento.data}</td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant={pagamento.status === "pago" ? "default" : "secondary"}>
                              {pagamento.status === "pago" ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Pago</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" /> Pendente</>
                              )}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">A Receber (Parcelamentos)</p>
                      <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(8500)}</p>
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
                <div className="space-y-4">
                  {comissoes.map((com, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-white font-semibold">
                          {com.profissional.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground">{com.profissional}</span>
                            <span className="text-xl font-bold text-primary">{formatCurrency(com.comissao)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Faturamento: {formatCurrency(com.faturamento)}</span>
                            <span>•</span>
                            <span>{com.percentual}% comissão</span>
                            {com.procedimentos > 0 && (
                              <>
                                <span>•</span>
                                <span>{com.procedimentos} procedimentos</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Total Comissões</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(46900)}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">% do Faturamento</p>
                    <p className="text-2xl font-bold text-foreground">32.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Inadimplência */}
          <TabsContent value="inadimplencia" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-revenue-at-risk" />
                  Clientes Inadimplentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inadimplentes.map((inad, idx) => (
                    <div key={idx} className="p-4 bg-revenue-at-risk/5 rounded-xl border border-revenue-at-risk/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{inad.paciente}</p>
                          <p className="text-sm text-muted-foreground">{inad.procedimento}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-revenue-at-risk">{formatCurrency(inad.valor)}</p>
                          <Badge variant="destructive" className="text-xs">
                            {inad.diasAtraso} dias em atraso
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Último contato: {inad.ultimoContato}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(inad.paciente)}>
                            Enviar Lembrete
                          </Button>
                          <Button size="sm" variant="default" onClick={() => handleCall(inad.paciente)}>
                            Ligar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-revenue-at-risk/10 rounded-xl border border-revenue-at-risk/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-revenue-at-risk" />
                    <div>
                      <p className="font-medium text-foreground">Total em Inadimplência</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(inadimplenciaTotal)} distribuídos em {inadimplentes.length} clientes
                      </p>
                    </div>
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
