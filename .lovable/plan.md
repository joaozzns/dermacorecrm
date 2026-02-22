

# Analise Completa - Perspectiva de Dono de Clinica

## BUGS ENCONTRADOS (Problemas Reais Quebrando o Sistema)

### 1. "NaN% do total" no Dashboard (VISIVEL AGORA)
Quando nao ha orcamentos no sistema, o card de Receita Potencial mostra **"NaN% do total"** em todos os 4 indicadores (Confirmada, Em Risco, Parada, Recuperavel). Isso acontece porque o componente `MetricaReceita` calcula `(valor / total) * 100` onde `total = 0`, causando divisao por zero.

- **Arquivo**: `src/components/dashboard/MetricaReceita.tsx`, linhas 69 e 74
- **Correcao**: Adicionar verificacao `total === 0 ? 0 : (valor / total) * 100` em cada `RevenueCard`

### 2. Barra de progresso da receita tambem quebra com total = 0
Na mesma logica, as barras de progresso (linhas 97-109) tambem calculam `(valor / total) * 100` resultando em `NaN%` nos `width` do CSS.

### 3. WhatsApp inutilizavel no mobile
A pagina WhatsApp mostra a lista de conversas E o chat lado a lado em mobile (390px), com ambos visiveis mas cortados. O painel de contexto (w-80) fica completamente fora da tela. O resultado e que nenhuma funcionalidade e usavel em celular.

- **Arquivo**: `src/pages/WhatsApp.tsx`
- **Correcao**: No mobile, mostrar apenas a lista de conversas. Ao clicar, mostrar o chat em tela cheia com botao de voltar.

### 4. Sidebar mostra badges hardcoded
A sidebar mostra `12` em Leads e `5` em WhatsApp, mas esses numeros sao **hardcoded** (linhas 74-75 de `Sidebar.tsx`), nao refletem dados reais. Um dono de clinica veria "12 leads" mesmo com 0 leads no sistema.

- **Arquivo**: `src/components/layout/Sidebar.tsx`, linha 74-75
- **Correcao**: Usar os hooks `useLeads` e contagem real, ou remover as badges

---

## PROBLEMAS DE UX (Confusos para o Dono da Clinica)

### 5. Financeiro calcula despesas como 41% fixo da receita
O modulo Financeiro (linha 110) calcula `despesasTotal = receitaTotal * 0.41` - um percentual inventado. Nao existe tabela de despesas no banco. O dono da clinica veria despesas falsas.

### 6. Relatorios usa Math.random() para dados
A pagina Relatorios (linhas 130, 176-177) usa `Math.random()` para gerar dados de faturamento por periodo e por procedimento. Cada vez que o usuario navega, os numeros mudam aleatoriamente.

### 7. Configuracoes - botoes que nao funcionam
- **"Alterar Logo"** (linha 384): botao sem funcionalidade de upload
- **"API Key"** (linha 172): mostra `sk_live_xxxxxxxxxxxxxxxxxxxxx` falso
- **Cor Principal** (linhas 394-400): botoes de cor nao salvam nem aplicam nada
- **Integracoes** (linhas 71-78): mostram status "conectado" para WhatsApp, Google Calendar e Stripe, mas nenhuma integracao real existe

### 8. Automacoes e inteiramente mockada
Toda a pagina de Automacoes usa dados ficticios hardcoded (fluxos, metricas, sequencias). O botao "Criar Automacao" nao faz nada.

### 9. Links quebrados no Footer
Os links para `/termos`, `/privacidade`, `blog.dermacore.com`, `docs.dermacore.com` e `status.dermacore.com` levam a paginas 404 ou dominios inexistentes.

### 10. WhatsApp nao envia mensagens reais
A funcao `handleSendMessage` (linha 118-122) abre `wa.me/5511999990000` com a mensagem - um numero generico que nao pertence a ninguem. Nao e uma integracao real com WhatsApp Business API.

---

## O QUE FUNCIONA BEM

- Cadastro de leads, pacientes, procedimentos e orcamentos (CRUD real com banco de dados)
- Pipeline de leads no dashboard (dados reais)
- Alertas e insights baseados em dados reais
- Metrica de receita potencial baseada em orcamentos reais
- Fluxo de autenticacao (email, Google, Apple, recuperacao de senha)
- Configuracoes da clinica (salva no banco)
- Convites de equipe
- Layout responsivo da maioria das paginas
- Planos e checkout com Stripe (configurado corretamente)

---

## PLANO DE CORRECAO (Priorizado)

### Fase 1 - Bugs Criticos (Corrigir Imediatamente)

1. **Corrigir NaN% no MetricaReceita** - Adicionar guard `total === 0` na divisao
2. **Remover badges hardcoded da Sidebar** - Usar dados reais ou remover
3. **Corrigir WhatsApp mobile** - Layout condicional: lista OU chat, nao ambos

### Fase 2 - Remover Dados Falsos

4. **Financeiro** - Remover calculo ficticio de despesas (41%), mostrar apenas receita real de orcamentos aprovados
5. **Relatorios** - Remover Math.random(), calcular dados reais a partir de orcamentos e leads
6. **Automacoes** - Adicionar estado vazio ("em breve") em vez de dados inventados

### Fase 3 - Funcionalidades Faltantes

7. **Paginas de Termos e Privacidade** - Criar paginas basicas ou remover links
8. **Upload de logo** - Implementar upload real usando storage
9. **Remover integracoes falsas** - Mostrar status real ou "nao configurado"

---

## Detalhes Tecnicos

| Bug | Arquivo | Linha(s) | Tipo |
|---|---|---|---|
| NaN% do total | MetricaReceita.tsx | 69, 74, 97-109 | Divisao por zero |
| Badges hardcoded | Sidebar.tsx | 74-75 | Mock data |
| WhatsApp mobile | WhatsApp.tsx | 155-310 | Layout |
| Despesas 41% | Financeiro.tsx | 110 | Mock calc |
| Math.random() | Relatorios.tsx | 130, 176-177 | Mock data |
| Links 404 | FooterSection.tsx | 138, 152 | Missing routes |
| Logo upload | Configuracoes.tsx | 384 | Not implemented |
| Integracoes falsas | Configuracoes.tsx | 71-78 | Mock status |
| Automacoes mock | Automacoes.tsx | 41+ | All mock data |

