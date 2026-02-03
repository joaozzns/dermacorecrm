import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProcedures, Procedure, ProcedureCategory } from "@/hooks/useProcedures";

interface ProcedureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure?: Procedure | null;
  categories: ProcedureCategory[];
}

export function ProcedureFormDialog({ open, onOpenChange, procedure, categories }: ProcedureFormDialogProps) {
  const { createProcedure, updateProcedure } = useProcedures();
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    duration_minutes: 60,
    base_price: 0,
    cost: 0,
    notes: "",
    is_active: true
  });

  useEffect(() => {
    if (procedure) {
      setFormData({
        name: procedure.name,
        category_id: procedure.category_id || "",
        description: procedure.description || "",
        duration_minutes: procedure.duration_minutes,
        base_price: procedure.base_price,
        cost: procedure.cost || 0,
        notes: procedure.notes || "",
        is_active: procedure.is_active
      });
    } else {
      setFormData({
        name: "",
        category_id: "",
        description: "",
        duration_minutes: 60,
        base_price: 0,
        cost: 0,
        notes: "",
        is_active: true
      });
    }
  }, [procedure, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (procedure) {
        await updateProcedure.mutateAsync({
          id: procedure.id,
          ...formData,
          category_id: formData.category_id || null,
          cost: formData.cost || null
        });
      } else {
        await createProcedure.mutateAsync({
          ...formData,
          category_id: formData.category_id || undefined,
          cost: formData.cost || undefined
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const profitMargin = formData.base_price > 0 && formData.cost > 0
    ? ((formData.base_price - formData.cost) / formData.base_price * 100).toFixed(1)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {procedure ? "Editar Procedimento" : "Novo Procedimento"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Procedimento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Botox Facial"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem categoria</SelectItem>
                {categories.filter(c => c.is_active).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do procedimento..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos) *</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço Base (R$) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                min={0}
                step={0.01}
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {profitMargin && (
              <div className="space-y-2">
                <Label>Margem de Lucro</Label>
                <div className={`h-10 flex items-center px-3 rounded-md border ${
                  parseFloat(profitMargin) >= 50 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  parseFloat(profitMargin) >= 30 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {profitMargin}%
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações Internas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas internas sobre o procedimento..."
              rows={2}
            />
          </div>

          {procedure && (
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Ativo</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createProcedure.isPending || updateProcedure.isPending}
            >
              {procedure ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
