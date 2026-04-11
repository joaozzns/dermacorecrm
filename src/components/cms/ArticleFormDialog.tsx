import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Article, ArticleInput } from "@/hooks/useArticles";

const CATEGORIES = [
  { value: "blog", label: "Blog" },
  { value: "ajuda", label: "Central de Ajuda" },
  { value: "documentacao", label: "Documentação" },
  { value: "atualizacoes", label: "Atualizações" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onSubmit: (data: ArticleInput & { id?: string }) => void;
  loading?: boolean;
}

export function ArticleFormDialog({ open, onOpenChange, article, onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("blog");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setCategory(article.category);
      setContent(article.content);
      setExcerpt(article.excerpt || "");
      setCoverUrl(article.cover_image_url || "");
      setIsPublished(article.is_published);
      setTags(article.tags || []);
    } else {
      setTitle(""); setSlug(""); setCategory("blog"); setContent("");
      setExcerpt(""); setCoverUrl(""); setIsPublished(false); setTags([]);
    }
  }, [article, open]);

  const generateSlug = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!article) setSlug(generateSlug(v));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSubmit = () => {
    if (!title || !slug) return;
    onSubmit({
      ...(article ? { id: article.id } : {}),
      title, slug, category, content,
      excerpt: excerpt || undefined,
      cover_image_url: coverUrl || undefined,
      is_published: isPublished,
      tags,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Título do artigo" />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug-do-artigo" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Imagem de Capa (URL)</Label>
              <Input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resumo</Label>
            <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Breve descrição do artigo" />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escreva o conteúdo do artigo aqui... Suporta Markdown."
              className="min-h-[250px] font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Adicionar tag"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>Adicionar</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Publicar artigo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={loading || !title || !slug}>
              {loading ? "Salvando..." : article ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
