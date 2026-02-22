import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteFormDialog } from "@/components/quotes/QuoteFormDialog";
import { QuotePreview } from "@/components/quotes/QuotePreview";
import { useQuotes, Quote, QuoteStatus } from "@/hooks/useQuotes";
import { Plus, Search, FileText, Filter, Send, Check, X, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Orcamentos = () => {
  const { quotes, isLoading, sendQuote, approveQuote, rejectQuote, deleteQuote } = useQuotes();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const filteredQuotes = quotes.filter(quote => {
    const clientName = quote.patient?.full_name || quote.lead?.name || "";
    const matchesSearch = 
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (quote: Quote) => {
    setPreviewQuote(quote);
    setPreviewOpen(true);
  };

  const handleSendWhatsApp = (quote: Quote) => {
    const clientPhone = quote.patient?.phone || quote.lead?.phone;
    if (!clientPhone) {
      return;
    }

    const phone = clientPhone.replace(/\D/g, '');
    const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`;
    
    const itemsList = quote.items?.map(item => 
      `• ${item.procedure_name} (${item.quantity}x) - R$ ${item.total_price.toFixed(2)}`
    ).join('\n') || '';

    const message = `🏥 *ORÇAMENTO ${quote.quote_number}*\n\n` +
      `Olá! Segue seu orçamento:\n\n` +
      `📋 *Procedimentos:*\n${itemsList}\n\n` +
      `${quote.discount_amount > 0 ? `🎉 *Desconto:* R$ ${quote.discount_amount.toFixed(2)}\n` : ''}` +
      `💰 *Total:* R$ ${quote.total.toFixed(2)}\n\n` +
      `📅 *Válido até:* ${new Date(quote.valid_until).toLocaleDateString('pt-BR')}\n\n` +
      `${quote.payment_terms ? `💳 *Condições:* ${quote.payment_terms}\n\n` : ''}` +
      `Aguardamos seu retorno! 😊`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDeleteConfirm = () => {
    if (quoteToDelete) {
      deleteQuote.mutate(quoteToDelete);
    }
    setDeleteDialogOpen(false);
    setQuoteToDelete(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Stats
  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    totalValue: quotes.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.total, 0),
    pendingValue: quotes.filter(q => q.status === 'sent').reduce((sum, q) => sum + q.total, 0)
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8 ml-12 md:ml-0">
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-2">Orçamentos</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Gerencie os orçamentos dos seus clientes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-gray-500" />
              <p className="text-sm text-muted-foreground">Rascunhos</p>
            </div>
            <p className="text-2xl font-bold">{stats.draft}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Send className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Enviados</p>
            </div>
            <p className="text-2xl font-bold">{stats.sent}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Check className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Aprovados</p>
            </div>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Valor Aprovado</p>
            <p className="text-xl font-bold text-green-500">{formatCurrency(stats.totalValue)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Valor Pendente</p>
            <p className="text-xl font-bold text-yellow-500">{formatCurrency(stats.pendingValue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-4 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Rascunho
                  </span>
                </SelectItem>
                <SelectItem value="sent">
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Enviado
                  </span>
                </SelectItem>
                <SelectItem value="approved">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Aprovado
                  </span>
                </SelectItem>
                <SelectItem value="rejected">
                  <span className="flex items-center gap-2">
                    <X className="h-4 w-4" /> Rejeitado
                  </span>
                </SelectItem>
                <SelectItem value="expired">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Expirado
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setFormDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
          </Button>
        </div>

        {/* Quotes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Crie seu primeiro orçamento para começar"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setFormDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onView={handleView}
                onSend={(id) => sendQuote.mutate(id)}
                onApprove={(id) => approveQuote.mutate(id)}
                onReject={(id) => rejectQuote.mutate(id)}
                onDelete={(id) => { setQuoteToDelete(id); setDeleteDialogOpen(true); }}
                onSendWhatsApp={handleSendWhatsApp}
              />
            ))}
          </div>
        )}

        {/* Dialogs */}
        <QuoteFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
        />

        <QuotePreview
          quote={previewQuote}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          onSend={(id) => { sendQuote.mutate(id); setPreviewOpen(false); }}
          onApprove={(id) => { approveQuote.mutate(id); setPreviewOpen(false); }}
          onReject={(id) => { rejectQuote.mutate(id); setPreviewOpen(false); }}
          onSendWhatsApp={handleSendWhatsApp}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Orcamentos;
