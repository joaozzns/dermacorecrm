import { Clock, DollarSign, TrendingUp, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Procedure } from "@/hooks/useProcedures";

interface ProcedureCardProps {
  procedure: Procedure;
  onEdit: (procedure: Procedure) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function ProcedureCard({ procedure, onEdit, onDelete, onToggleActive }: ProcedureCardProps) {
  const profitMargin = procedure.base_price > 0 && procedure.cost 
    ? ((procedure.base_price - procedure.cost) / procedure.base_price * 100).toFixed(0)
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className={`glass-card p-4 transition-all ${!procedure.is_active ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {procedure.category?.icon && (
              <span className="text-lg">{procedure.category.icon}</span>
            )}
            <h3 className="font-semibold text-foreground truncate">{procedure.name}</h3>
          </div>
          {procedure.category && (
            <Badge variant="secondary" className="text-xs">
              {procedure.category.name}
            </Badge>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(procedure)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(procedure.id, !procedure.is_active)}>
              {procedure.is_active ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" /> Desativar
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" /> Ativar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(procedure.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {procedure.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {procedure.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(procedure.duration_minutes)}</span>
        </div>
        
        <div className="flex items-center gap-1.5 font-medium text-primary">
          <DollarSign className="h-4 w-4" />
          <span>{formatCurrency(procedure.base_price)}</span>
        </div>

        {profitMargin && (
          <div className={`flex items-center gap-1.5 ${
            parseInt(profitMargin) >= 50 ? 'text-green-500' :
            parseInt(profitMargin) >= 30 ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            <TrendingUp className="h-4 w-4" />
            <span>{profitMargin}%</span>
          </div>
        )}
      </div>

      {!procedure.is_active && (
        <Badge variant="outline" className="mt-3 text-muted-foreground">
          Inativo
        </Badge>
      )}
    </div>
  );
}
