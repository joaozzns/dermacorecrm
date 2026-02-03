import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuotes, CreateQuoteItemInput } from "@/hooks/useQuotes";
import { useProcedures, Procedure } from "@/hooks/useProcedures";
import { usePatients } from "@/hooks/usePatients";
import { useLeads } from "@/hooks/useLeads";
import { Plus, Trash2, Calculator } from "lucide-react";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPatientId?: string;
  preselectedLeadId?: string;
}

export function QuoteFormDialog({ open, onOpenChange, preselectedPatientId, preselectedLeadId }: QuoteFormDialogProps) {
  const { createQuote } = useQuotes();
  const { procedures, categories } = useProcedures();
  const { patients } = usePatients();
  const { leads } = useLeads();

  const [clientType, setClientType] = useState<'patient' | 'lead'>(preselectedPatientId ? 'patient' : 'lead');
  const [selectedClientId, setSelectedClientId] = useState(preselectedPatientId || preselectedLeadId || "");
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<CreateQuoteItemInput[]>([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState("");

  useEffect(() => {
    if (open) {
      setClientType(preselectedPatientId ? 'patient' : 'lead');
      setSelectedClientId(preselectedPatientId || preselectedLeadId || "");
      setItems([]);
      setDiscountValue(0);
      setPaymentTerms("");
      setNotes("");
    }
  }, [open, preselectedPatientId, preselectedLeadId]);

  const addProcedure = () => {
    if (!selectedProcedureId) return;
    
    const procedure = procedures.find(p => p.id === selectedProcedureId);
    if (!procedure) return;

    setItems([...items, {
      procedure_id: procedure.id,
      procedure_name: procedure.name,
      quantity: 1,
      unit_price: procedure.base_price
    }]);
    setSelectedProcedureId("");
  };

  const updateItem = (index: number, updates: Partial<CreateQuoteItemInput>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const discountAmount = discountType === 'percent' 
    ? (subtotal * discountValue / 100)
    : discountValue;
  const total = subtotal - discountAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      return;
    }

    try {
      await createQuote.mutateAsync({
        patient_id: clientType === 'patient' ? selectedClientId : undefined,
        lead_id: clientType === 'lead' ? selectedClientId : undefined,
        valid_until: validUntil,
        discount_percent: discountType === 'percent' ? discountValue : 0,
        discount_amount: discountType === 'amount' ? discountValue : discountAmount,
        payment_terms: paymentTerms || undefined,
        notes: notes || undefined,
        items
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const activeProcedures = procedures.filter(p => p.is_active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-4">
            <Tabs value={clientType} onValueChange={(v) => { setClientType(v as 'patient' | 'lead'); setSelectedClientId(""); }}>
              <TabsList className="w-full">
                <TabsTrigger value="patient" className="flex-1">Paciente</TabsTrigger>
                <TabsTrigger value="lead" className="flex-1">Lead</TabsTrigger>
              </TabsList>
              
              <TabsContent value="patient" className="mt-4">
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} - {patient.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
              
              <TabsContent value="lead" className="mt-4">
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} - {lead.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>
          </div>

          {/* Validity */}
          <div className="space-y-2">
            <Label htmlFor="validUntil">Válido até</Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Procedures */}
          <div className="space-y-4">
            <Label>Procedimentos</Label>
            
            <div className="flex gap-2">
              <Select value={selectedProcedureId} onValueChange={setSelectedProcedureId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione um procedimento" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <div key={cat.id}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {cat.icon} {cat.name}
                      </div>
                      {activeProcedures.filter(p => p.category_id === cat.id).map(proc => (
                        <SelectItem key={proc.id} value={proc.id}>
                          {proc.name} - {formatCurrency(proc.base_price)}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                  {activeProcedures.filter(p => !p.category_id).length > 0 && (
                    <div>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        📁 Sem categoria
                      </div>
                      {activeProcedures.filter(p => !p.category_id).map(proc => (
                        <SelectItem key={proc.id} value={proc.id}>
                          {proc.name} - {formatCurrency(proc.base_price)}
                        </SelectItem>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addProcedure} disabled={!selectedProcedureId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.procedure_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unit_price)} cada
                      </p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-20"
                    />
                    <div className="w-24 text-right font-medium">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Desconto</Label>
            <div className="flex gap-2">
              <Select value={discountType} onValueChange={(v) => setDiscountType(v as 'percent' | 'amount')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentual (%)</SelectItem>
                  <SelectItem value="amount">Valor (R$)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={0}
                max={discountType === 'percent' ? 100 : subtotal}
                step={discountType === 'percent' ? 1 : 0.01}
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
            <Textarea
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Ex: À vista com 10% de desconto, ou em até 12x no cartão..."
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Desconto {discountType === 'percent' && `(${discountValue}%)`}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createQuote.isPending || items.length === 0 || !selectedClientId}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Criar Orçamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
