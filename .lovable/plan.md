

## Plano: CMS Admin + Dados da Clínica e Procedimentos

### Parte 1 — Painel CMS Admin

Criar uma nova página `/cms` (rota protegida) com editor visual para gerenciar artigos da tabela `content_articles`. O painel permitirá criar, editar e excluir artigos de blog, central de ajuda e documentação.

**Componentes:**
- `src/pages/CmsAdmin.tsx` — Página principal com listagem de artigos por categoria (blog, ajuda, documentacao, atualizacoes), filtros e busca
- `src/components/cms/ArticleFormDialog.tsx` — Dialog com editor visual (título, slug auto-gerado, categoria, conteúdo rich-text com textarea formatada, excerpt, tags, imagem de capa, status de publicação)
- Rota `/cms` adicionada em `App.tsx` como rota protegida
- Link para CMS adicionado no `Sidebar.tsx`

O editor usará a tabela `content_articles` já existente. Artigos publicados aparecerão automaticamente nas páginas de Blog, Ajuda e Documentação.

### Parte 2 — Popular Dados da Clínica

Usar a ferramenta de inserção para atualizar a clínica existente (`a5dbeed7-...`) com dados completos:
- **Email**: contato@clinicateste.com.br
- **CNPJ**: 12.345.678/0001-90
- **Endereço**: Av. Paulista, 1000, São Paulo - SP, CEP 01310-100
- **Telefone/WhatsApp**: (11) 99999-0000
- **Horário**: Seg-Sex 08:00-18:00, Sáb 08:00-12:00

### Parte 3 — Procedimentos Base

Inserir 5 categorias e 5 procedimentos com preços de mercado (editáveis via UI existente):

| Procedimento | Duração | Preço Base | Custo Est. |
|---|---|---|---|
| Botox Facial | 30min | R$ 1.200 | R$ 300 |
| Preenchimento Labial | 45min | R$ 1.800 | R$ 500 |
| Peeling Químico | 60min | R$ 450 | R$ 80 |
| Harmonização Facial | 90min | R$ 3.500 | R$ 900 |
| Limpeza de Pele | 60min | R$ 250 | R$ 40 |

Os preços poderão ser alterados a qualquer momento pela página de Procedimentos já existente.

### Arquivos a criar/modificar
- **Criar**: `src/pages/CmsAdmin.tsx`, `src/components/cms/ArticleFormDialog.tsx`
- **Modificar**: `src/App.tsx` (nova rota), `src/components/layout/Sidebar.tsx` (link CMS)
- **Dados**: UPDATE na tabela `clinics`, INSERT em `procedure_categories` e `procedures`

