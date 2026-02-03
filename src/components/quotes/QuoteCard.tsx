import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, User, Clock, MoreVertical, Send, Check, X, Trash2, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Quote, QuoteStatus } from "@/hooks/useQuotes";

interface QuoteCardProps {
  quote: Quote;
  onView: (quote: Quote) => void;
  onSend: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onSendWhatsApp: (quote: Quote) => void;
}

const statusConfig: Record<QuoteStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  draft: { label: "Rascunho", variant: "secondary", icon: <FileText className="h-3 w-3" /> },
  sent: { label: "Enviado", variant: "default", icon: <Send className="h-3 w-3" /> },
  approved: { label: "Aprovado", variant: "default", icon: <Check className="h-3 w-3" /> },
  rejected: { label: "Rejeitado", variant: "destructive", icon: <X className="h-3 w-3" /> },
  expired: { label: "Expirado", variant: "outline", icon: <Clock className="h-3 w-3" /> }
};

export function QuoteCard({ quote, onView, onSend, onApprove, onReject, onDelete, onSendWhatsApp }: QuoteCardProps) {
  const status = statusConfig[quote.status];
  const clientName = quote.patient?.full_name || quote.lead?.name || "Cliente não identificado";
  const isExpired = new Date(quote.valid_until) < new Date() && quote.status !== 'approved' && quote.status !== 'rejected';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="glass-card p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm text-primary font-medium">{quote.quote_number}</span>
            <Badge variant={isExpired ? "outline" : status.variant} className="gap-1">
              {status.icon}
              {isExpired ? "Expirado" : status.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">{clientName}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(quote)}>
              <Eye className="mr-2 h-4 w-4" /> Visualizar
            </DropdownMenuItem>
            
            {quote.status === 'draft' && (
              <>
                <DropdownMenuItem onClick={() => onSend(quote.id)}>
                  <Send className="mr-2 h-4 w-4" /> Marcar como Enviado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendWhatsApp(quote)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Enviar por WhatsApp
                </DropdownMenuItem>
              </>
            )}
            
            {quote.status === 'sent' && (
              <>
                <DropdownMenuItem onClick={() => onApprove(quote.id)}>
                  <Check className="mr-2 h-4 w-4" /> Aprovar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject(quote.id)}>
                  <X className="mr-2 h-4 w-4" /> Rejeitar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendWhatsApp(quote)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Reenviar WhatsApp
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => onDelete(quote.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Items summary */}
      <div className="text-sm text-muted-foreground mb-3">
        {quote.items && quote.items.length > 0 ? (
          <p>
            {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}: {quote.items.slice(0, 2).map(i => i.procedure_name).join(", ")}
            {quote.items.length > 2 && ` +${quote.items.length - 2}`}
          </p>
        ) : (
          <p className="italic">Sem itens</p>
        )}
      </div>

      {/* Values */}
      <div className="flex items-end justify-between">
        <div>
          {quote.discount_amount > 0 && (
            <p className="text-sm text-muted-foreground line-through">
              {formatCurrency(quote.subtotal)}
            </p>
          )}
          <p className="text-xl font-bold text-primary">
            {formatCurrency(quote.total)}
          </p>
        </div>
        
        <div className="text-right text-sm text-muted-foreground">
          <p>Válido até</p>
          <p className={isExpired ? 'text-destructive font-medium' : ''}>
            {format(new Date(quote.valid_until), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        Criado em {format(new Date(quote.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </div>
    </div>
  );
}
