import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const procedimentosDisponiveis = [
  "Harmonização Facial",
  "Botox",
  "Preenchimento Labial",
  "Bioestimulador",
  "Skinbooster",
  "Lipo de Papada",
  "Fios de PDO",
];

export function NovaOrientacaoDialog() {
  const [open, setOpen] = useState(false);
  const [procedimento, setProcedimento] = useState("");
  const [dia, setDia] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procedimento || !dia || !titulo || !descricao) {
      toast.error("Preencha todos os campos.");
      return;
    }
    toast.success(`Orientação "${titulo}" para Dia ${dia} de ${procedimento} criada com sucesso!`);
    setProcedimento("");
    setDia("");
    setTitulo("");
    setDescricao("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Nova Orientação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Orientação Pós-Procedimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Procedimento</Label>
            <Select value={procedimento} onValueChange={setProcedimento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o procedimento" />
              </SelectTrigger>
              <SelectContent>
                {procedimentosDisponiveis.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dia pós-procedimento</Label>
            <Input
              type="number"
              min={0}
              max={90}
              placeholder="Ex: 3"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              placeholder="Ex: Cuidados com exposição solar"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição / Orientação</Label>
            <Textarea
              placeholder="Descreva a orientação para o paciente..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Orientação</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
