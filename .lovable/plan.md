
# Plano: Tabela Comparativa de Planos

## Objetivo
Adicionar uma seção de tabela comparativa na página `/planos` que mostra todas as funcionalidades dos três planos (Essencial, Profissional, Enterprise) lado a lado, facilitando a decisão do cliente.

## Visão Geral

A tabela será inserida logo abaixo dos cards de planos existentes, com um design moderno e responsivo que segue o padrão visual da aplicação.

## Detalhes Técnicos

### 1. Criar Componente de Tabela Comparativa

**Novo arquivo:** `src/components/landing/PlansComparisonTable.tsx`

O componente receberá os planos do banco de dados e renderizará uma tabela com:

**Estrutura da Tabela:**
- **Coluna 1:** Nome da funcionalidade/característica
- **Colunas 2-4:** Cada plano (Essencial, Profissional, Enterprise)

**Categorias de comparação:**
1. **Limites**
   - Profissionais
   - Pacientes
   - Leads/mês

2. **Agenda & Pacientes**
   - Agenda online ilimitada
   - Gestão de pacientes
   - Lembretes WhatsApp

3. **Marketing & Vendas**
   - IA para conversão de leads
   - Automações WhatsApp
   - Fotos antes/depois

4. **Gestão Financeira**
   - Relatórios básicos
   - Relatórios avançados
   - Controle financeiro completo

5. **Suporte & Integrações**
   - Suporte por email
   - Suporte prioritário
   - Multi-unidades
   - API personalizada
   - Integrações customizadas
   - Gerente de conta dedicado
   - Treinamento presencial
   - SLA garantido

**Indicadores visuais:**
- Checkmark verde para funcionalidades incluídas
- X vermelho/cinza para não incluídas
- Valores numéricos ou "Ilimitado" para limites

### 2. Estilização

- Usar componentes `Table` do shadcn/ui
- Cabeçalho fixo com nome do plano e preço
- Destacar coluna do plano "Profissional" (mais popular)
- Animação de entrada com `ScrollReveal`
- Design responsivo (em mobile, considerar scroll horizontal ou layout alternativo)
- Cores consistentes com o sistema de design existente

### 3. Integrar na Página de Planos

**Arquivo:** `src/pages/Planos.tsx`

- Importar novo componente `PlansComparisonTable`
- Adicionar seção após os cards de planos
- Incluir título "Compare todos os recursos"
- Passar dados dos planos para o componente

### Estrutura Visual da Tabela

```text
+------------------+-----------+--------------+------------+
| Recurso          | Essencial | Profissional | Enterprise |
+------------------+-----------+--------------+------------+
| LIMITES          |           |              |            |
| Profissionais    |    2      |      5       |  Ilimitado |
| Pacientes        |   500     |    2.000     |  Ilimitado |
| Leads/mês        |    50     |     200      |  Ilimitado |
+------------------+-----------+--------------+------------+
| AGENDA           |           |              |            |
| Agenda ilimitada |    ✓      |      ✓       |     ✓      |
| Gestão pacientes |    ✓      |      ✓       |     ✓      |
| ...              |           |              |            |
+------------------+-----------+--------------+------------+
```

## Arquivos a Serem Modificados

| Arquivo | Ação |
|---------|------|
| `src/components/landing/PlansComparisonTable.tsx` | Criar novo |
| `src/pages/Planos.tsx` | Adicionar seção com tabela |

## Resultado Esperado

Uma tabela comparativa elegante e informativa que:
- Facilita a comparação visual entre os três planos
- Mantém consistência com o design existente
- É responsiva para todos os tamanhos de tela
- Ajuda o usuário a tomar uma decisão informada sobre qual plano escolher
