import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, QuoteStatus } from "@/hooks/useQuotes";
import { FileText, Send, Check, X, MessageCircle, Calendar } from "lucide-react";

interface QuotePreviewProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSendWhatsApp: (quote: Quote) => void;
}

const statusConfig: Record<QuoteStatus, { label: string; color: string }> = {
  draft: { label: "Rascunho", color: "bg-gray-500" },
  sent: { label: "Enviado", color: "bg-blue-500" },
  approved: { label: "Aprovado", color: "bg-green-500" },
  rejected: { label: "Rejeitado", color: "bg-red-500" },
  expired: { label: "Expirado", color: "bg-yellow-500" }
};

export function QuotePreview({ quote, open, onOpenChange, onSend, onApprove, onReject, onSendWhatsApp }: QuotePreviewProps) {
  if (!quote) return null;

  const clientName = quote.patient?.full_name || quote.lead?.name || "Cliente";
  const clientPhone = quote.patient?.phone || quote.lead?.phone;
  const status = statusConfig[quote.status];
  const isExpired = new Date(quote.valid_until) < new Date() && quote.status !== 'approved' && quote.status !== 'rejected';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Orçamento {quote.quote_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{clientName}</h3>
              {clientPhone && (
                <p className="text-muted-foreground">{clientPhone}</p>
              )}
            </div>
            <Badge className={`${status.color} text-white`}>
              {isExpired ? 'Expirado' : status.label}
            </Badge>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Data de criação</p>
              <p className="font-medium">
                {format(new Date(quote.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Válido até</p>
              <p className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                {format(new Date(quote.valid_until), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-3">Procedimentos</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Item</th>
                    <th className="text-center p-3 text-sm font-medium w-20">Qtd</th>
                    <th className="text-right p-3 text-sm font-medium w-28">Valor</th>
                    <th className="text-right p-3 text-sm font-medium w-28">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items?.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-3">
                        <p className="font-medium">{item.procedure_name}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        )}
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            {quote.discount_amount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>
                  Desconto 
                  {quote.discount_percent > 0 && ` (${quote.discount_percent}%)`}
                </span>
                <span>-{formatCurrency(quote.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(quote.total)}</span>
            </div>
          </div>

          {/* Payment Terms */}
          {quote.payment_terms && (
            <div>
              <h4 className="font-semibold mb-2">Condições de Pagamento</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{quote.payment_terms}</p>
            </div>
          )}

          {/* Notes */}
          {quote.notes && (
            <div>
              <h4 className="font-semibold mb-2">Observações</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {quote.sent_at && (
              <p>📤 Enviado em {format(new Date(quote.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            )}
            {quote.approved_at && (
              <p>✅ Aprovado em {format(new Date(quote.approved_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            {quote.status === 'draft' && (
              <>
                <Button onClick={() => onSend(quote.id)}>
                  <Send className="mr-2 h-4 w-4" /> Marcar como Enviado
                </Button>
                <Button variant="outline" onClick={() => onSendWhatsApp(quote)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Enviar WhatsApp
                </Button>
              </>
            )}
            
            {quote.status === 'sent' && (
              <>
                <Button onClick={() => onApprove(quote.id)} className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" /> Aprovar
                </Button>
                <Button variant="destructive" onClick={() => onReject(quote.id)}>
                  <X className="mr-2 h-4 w-4" /> Rejeitar
                </Button>
                <Button variant="outline" onClick={() => onSendWhatsApp(quote)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Reenviar WhatsApp
                </Button>
              </>
            )}

            {quote.status === 'approved' && (
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Criar Agendamento
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
