import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcedureCard } from "@/components/procedures/ProcedureCard";
import { ProcedureFormDialog } from "@/components/procedures/ProcedureFormDialog";
import { CategoryFormDialog } from "@/components/procedures/CategoryFormDialog";
import { useProcedures, Procedure, ProcedureCategory } from "@/hooks/useProcedures";
import { Plus, Search, FolderOpen, Stethoscope, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const Procedimentos = () => {
  const { procedures, categories, isLoading, deleteProcedure, deleteCategory, updateProcedure } = useProcedures();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  
  const [procedureDialogOpen, setProcedureDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProcedureCategory | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'procedure' | 'category'; id: string } | null>(null);

  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || proc.category_id === categoryFilter;
    const matchesActive = showInactive || proc.is_active;
    return matchesSearch && matchesCategory && matchesActive;
  });

  const handleEditProcedure = (procedure: Procedure) => {
    setEditingProcedure(procedure);
    setProcedureDialogOpen(true);
  };

  const handleEditCategory = (category: ProcedureCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'procedure') {
      deleteProcedure.mutate(itemToDelete.id);
    } else {
      deleteCategory.mutate(itemToDelete.id);
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateProcedure.mutate({ id, is_active: isActive });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Procedimentos</h1>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos pela sua clínica</p>
        </div>

        <Tabs defaultValue="procedures" className="space-y-6">
          <TabsList>
            <TabsTrigger value="procedures" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              Procedimentos
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Categorias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="procedures" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar procedimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInactive(!showInactive)}
                  className={showInactive ? 'bg-muted' : ''}
                >
                  {showInactive ? 'Ocultar inativos' : 'Mostrar inativos'}
                </Button>
              </div>

              <Button onClick={() => { setEditingProcedure(null); setProcedureDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Novo Procedimento
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground">Total de Procedimentos</p>
                <p className="text-2xl font-bold">{procedures.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-500">{procedures.filter(p => p.is_active).length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground">Categorias</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground">Preço Médio</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    procedures.length > 0 
                      ? procedures.reduce((sum, p) => sum + p.base_price, 0) / procedures.length 
                      : 0
                  )}
                </p>
              </div>
            </div>

            {/* Procedures Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredProcedures.length === 0 ? (
              <div className="text-center py-12">
                <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum procedimento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" 
                    ? "Tente ajustar os filtros de busca" 
                    : "Comece cadastrando seu primeiro procedimento"}
                </p>
                {!searchTerm && categoryFilter === "all" && (
                  <Button onClick={() => setProcedureDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Procedimento
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProcedures.map((procedure) => (
                  <ProcedureCard
                    key={procedure.id}
                    procedure={procedure}
                    onEdit={handleEditProcedure}
                    onDelete={(id) => { setItemToDelete({ type: 'procedure', id }); setDeleteDialogOpen(true); }}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Organize seus procedimentos em categorias para facilitar a busca
              </p>
              <Button onClick={() => { setEditingCategory(null); setCategoryDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Nova Categoria
              </Button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma categoria cadastrada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie categorias para organizar seus procedimentos
                </p>
                <Button onClick={() => setCategoryDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Nova Categoria
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const procedureCount = procedures.filter(p => p.category_id === category.id).length;
                  
                  return (
                    <div 
                      key={category.id} 
                      className={`glass-card p-4 ${!category.is_active ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon || "📁"}</span>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {procedureCount} procedimento{procedureCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => { setItemToDelete({ type: 'category', id: category.id }); setDeleteDialogOpen(true); }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          Ordem: {category.sort_order}
                        </Badge>
                        {!category.is_active && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Inativa
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <ProcedureFormDialog
          open={procedureDialogOpen}
          onOpenChange={setProcedureDialogOpen}
          procedure={editingProcedure}
          categories={categories}
        />

        <CategoryFormDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          category={editingCategory}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                {itemToDelete?.type === 'procedure' 
                  ? 'Tem certeza que deseja excluir este procedimento? Esta ação não pode ser desfeita.'
                  : 'Tem certeza que deseja excluir esta categoria? Os procedimentos vinculados ficarão sem categoria.'}
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
    </div>
  );
};

export default Procedimentos;
