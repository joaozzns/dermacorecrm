

# Plano de Implementação: Catálogo de Procedimentos e Sistema de Orçamentos

## Resumo

Este plano cria dois módulos interconectados essenciais para clínicas estéticas:
1. **Catálogo de Procedimentos** - Base de dados com todos os serviços oferecidos, com categorias, preços e durações
2. **Sistema de Orçamentos** - Geração de orçamentos formais com validade, procedimentos, condições de pagamento e envio ao cliente

---

## 1. Estrutura do Banco de Dados

### Novas Tabelas

```text
┌─────────────────────────────────────┐
│     procedure_categories            │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ clinic_id (uuid, FK → clinics)      │
│ name (text)                         │
│ description (text, nullable)        │
│ icon (text, nullable)               │
│ sort_order (int)                    │
│ is_active (boolean)                 │
│ created_at, updated_at              │
└─────────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────────┐
│        procedures                   │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ clinic_id (uuid, FK → clinics)      │
│ category_id (uuid, FK, nullable)    │
│ name (text)                         │
│ description (text, nullable)        │
│ duration_minutes (int)              │
│ base_price (numeric)                │
│ cost (numeric, nullable)            │
│ is_active (boolean)                 │
│ notes (text, nullable)              │
│ created_at, updated_at              │
└─────────────────────────────────────┘
              │
              │ N:M (via quote_items)
              ▼
┌─────────────────────────────────────┐
│          quotes                     │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ clinic_id (uuid, FK → clinics)      │
│ quote_number (text, unique)         │
│ patient_id (uuid, FK, nullable)     │
│ lead_id (uuid, FK, nullable)        │
│ status (enum: draft/sent/approved/  │
│         rejected/expired)           │
│ valid_until (date)                  │
│ subtotal (numeric)                  │
│ discount_percent (numeric)          │
│ discount_amount (numeric)           │
│ total (numeric)                     │
│ payment_terms (text)                │
│ notes (text, nullable)              │
│ created_by (uuid, FK → profiles)    │
│ sent_at (timestamptz, nullable)     │
│ approved_at (timestamptz, nullable) │
│ created_at, updated_at              │
└─────────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────────┐
│        quote_items                  │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ quote_id (uuid, FK → quotes)        │
│ procedure_id (uuid, FK)             │
│ procedure_name (text)               │
│ quantity (int)                      │
│ unit_price (numeric)                │
│ total_price (numeric)               │
│ notes (text, nullable)              │
│ created_at                          │
└─────────────────────────────────────┘
```

### Enums Necessários

- `quote_status`: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'

### Policies RLS

Todas as tabelas terão RLS habilitado com isolamento por `clinic_id` usando a função `get_my_clinic()` existente.

---

## 2. Arquivos a Criar

### Hooks de Dados
| Arquivo | Descrição |
|---------|-----------|
| `src/hooks/useProcedures.tsx` | CRUD para procedimentos e categorias |
| `src/hooks/useQuotes.tsx` | CRUD para orçamentos e itens |

### Páginas
| Arquivo | Descrição |
|---------|-----------|
| `src/pages/Procedimentos.tsx` | Catálogo completo com abas para Procedimentos e Categorias |
| `src/pages/Orcamentos.tsx` | Lista de orçamentos com filtros por status |

### Componentes
| Arquivo | Descrição |
|---------|-----------|
| `src/components/procedures/ProcedureCard.tsx` | Card de exibição de procedimento |
| `src/components/procedures/ProcedureFormDialog.tsx` | Modal de criar/editar procedimento |
| `src/components/procedures/CategoryFormDialog.tsx` | Modal de criar/editar categoria |
| `src/components/quotes/QuoteFormDialog.tsx` | Modal de criação de orçamento |
| `src/components/quotes/QuotePreview.tsx` | Visualização do orçamento para envio |
| `src/components/quotes/QuoteCard.tsx` | Card resumo do orçamento na listagem |

---

## 3. Funcionalidades

### Catálogo de Procedimentos
- Listagem em grid com busca e filtro por categoria
- Criação/edição via modal com campos: nome, categoria, descrição, duração, preço base, custo
- Ativação/desativação de procedimentos
- Gerenciamento de categorias com drag-and-drop para ordenação
- Indicadores visuais de margem de lucro

### Sistema de Orçamentos
- Criação de orçamento vinculado a paciente ou lead
- Seleção de procedimentos do catálogo com quantidade
- Cálculo automático de subtotal/desconto/total
- Definição de validade (padrão: 7 dias)
- Campo de condições de pagamento (texto livre ou templates)
- Geração de número sequencial automático (ex: ORC-2025-0001)
- Preview do orçamento formatado
- Envio por WhatsApp com link ou mensagem formatada
- Histórico de status (rascunho → enviado → aprovado/rejeitado/expirado)
- Conversão de orçamento aprovado em agendamento

---

## 4. Integração com Sistema Existente

### Sidebar
Adicionar dois novos itens ao menu:
- "Procedimentos" (ícone: Stethoscope) - após "Financeiro"
- "Orçamentos" (ícone: FileText) - após "Procedimentos"

### Agenda
Ao criar agendamento, permitir selecionar procedimento do catálogo

### Leads/Pacientes
Botão rápido "Criar Orçamento" nos cards de lead e paciente

---

## 5. Detalhes Técnicos

### Migração SQL (resumo)
1. Criar enum `quote_status`
2. Criar tabela `procedure_categories`
3. Criar tabela `procedures`
4. Criar tabela `quotes`
5. Criar tabela `quote_items`
6. Habilitar RLS em todas
7. Criar policies para CRUD por clínica
8. Criar função para gerar `quote_number` sequencial

### Hooks
Seguir o padrão existente de `useLeads.tsx` e `usePatients.tsx`:
- useQuery para listagem
- useMutation para create/update/delete
- Invalidação de cache automática
- Toast notifications

### UI
- Estilo consistente com o resto do app (glass-card, btn-premium)
- Responsivo com grid adaptativo
- Estados de loading e empty state
- Validação de formulários com react-hook-form + zod

---

## 6. Fluxo de Uso Principal

```text
1. Admin cadastra CATEGORIAS (ex: Injetáveis, Laser, Corporal)
      ↓
2. Admin cadastra PROCEDIMENTOS vinculados às categorias
      ↓
3. Consultor/Atendente cria ORÇAMENTO para lead/paciente
      ↓
4. Seleciona procedimentos → Define desconto → Define validade
      ↓
5. Preview do orçamento → Envia por WhatsApp
      ↓
6. Cliente aprova → Orçamento muda para "Aprovado"
      ↓
7. Converte em AGENDAMENTO direto pelo sistema
```

---

## 7. Ordem de Implementação

1. **Banco de dados** - Criar tabelas, enums e RLS
2. **Hooks** - `useProcedures` e `useQuotes`
3. **Página Procedimentos** - CRUD completo de categorias e procedimentos
4. **Página Orçamentos** - Listagem e criação de orçamentos
5. **Integração** - Sidebar, botões rápidos em Leads/Pacientes
6. **Refinamentos** - Preview, envio WhatsApp, conversão em agendamento

