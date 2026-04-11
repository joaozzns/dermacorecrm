import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useArticles, type Article, type ArticleInput } from "@/hooks/useArticles";
import { ArticleFormDialog } from "@/components/cms/ArticleFormDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

const TABS = [
  { value: "all", label: "Todos" },
  { value: "blog", label: "Blog" },
  { value: "ajuda", label: "Ajuda" },
  { value: "documentacao", label: "Documentação" },
  { value: "atualizacoes", label: "Atualizações" },
];

const categoryLabel: Record<string, string> = {
  blog: "Blog",
  ajuda: "Ajuda",
  documentacao: "Documentação",
  atualizacoes: "Atualizações",
};

export default function CmsAdmin() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryFilter = tab === "all" ? undefined : tab;
  const { articles, isLoading, createArticle, updateArticle, deleteArticle } = useArticles(categoryFilter);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (data: ArticleInput & { id?: string }) => {
    if (data.id) {
      updateArticle.mutate(data as ArticleInput & { id: string }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createArticle.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditing(article);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CMS — Gestão de Conteúdo</h1>
            <p className="text-muted-foreground">Gerencie artigos do blog, central de ajuda e documentação</p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Artigo
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar artigos..."
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {TABS.map(t => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(t => (
            <TabsContent key={t.value} value={t.value}>
              {isLoading ? (
                <p className="text-muted-foreground py-8 text-center">Carregando...</p>
              ) : filtered.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Nenhum artigo encontrado. Crie o primeiro!
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filtered.map(article => (
                    <Card key={article.id} className="hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        {article.cover_image_url && (
                          <img
                            src={article.cover_image_url}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{article.title}</h3>
                            {article.is_published ? (
                              <Badge variant="default" className="gap-1 text-xs">
                                <Eye className="w-3 h-3" /> Publicado
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <EyeOff className="w-3 h-3" /> Rascunho
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {categoryLabel[article.category] || article.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {article.excerpt || article.slug}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(article.created_at), "dd MMM yyyy", { locale: ptBR })}
                            {article.tags && article.tags.length > 0 && (
                              <span className="ml-2">
                                {article.tags.map(t => `#${t}`).join(" ")}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(article)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteId(article.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <ArticleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editing}
        onSubmit={handleSubmit}
        loading={createArticle.isPending || updateArticle.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteArticle.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
