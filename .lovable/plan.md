

# Analise Geral - O que Falta para Colocar no Ar

## Status Atual

O projeto DermaCore esta bem estruturado com landing page, autenticacao, dashboard, modulos operacionais e integracao Stripe. Porem, apos uma analise detalhada, identifiquei itens criticos e melhorias necessarias antes do lancamento.

---

## 1. CRITICO - Corrigir Antes de Lançar

### 1.1 Dados Mock em Telas Internas
As telas internas (Dashboard, Financeiro, Relatorios, WhatsApp, Notificacoes) usam **dados ficticios hardcoded** em vez de dados reais do banco. Isso significa que:
- O dashboard mostra receita fixa de R$185.000 que nunca muda
- As notificacoes sao mock (nao persistem nem sao reais)
- Financeiro, Relatorios e WhatsApp mostram dados inventados

**Acao**: Conectar todas as telas aos dados reais do banco via hooks existentes (useLeads, useAppointments, usePatients, etc.)

### 1.2 Tabela `plans` sem `stripe_price_id`
O campo `features` da tabela `plans` e um array de strings com nomes de features. O webhook do Stripe tenta encontrar planos via `features.stripe_price_id`, mas esse campo nao existe. Os Price IDs do Stripe estao hardcoded apenas na Edge Function `create-checkout`.

**Acao**: Adicionar coluna `stripe_price_id` na tabela `plans` ou salvar no campo `features` como JSON, para que o webhook consiga mapear corretamente.

### 1.3 Seguranca - Dados de Pacientes Expostos
O scan de seguranca identificou:
- Tabela `patients` com dados medicos sensiveis (historico, CPF) acessiveis a **todos** os membros da clinica
- Tabela `appointments` com notas clinicas visiveis a staff nao autorizado

**Acao**: Implementar politicas RLS baseadas em role (admin vs staff) para restringir acesso a dados sensiveis.

### 1.4 URLs Hardcoded nas Edge Functions
As funcoes `create-checkout` e `customer-portal` tem URLs de fallback hardcoded apontando para o preview do Lovable. Em producao, isso quebraria os redirecionamentos.

**Acao**: Usar o header `origin` da requisicao de forma consistente ou configurar uma variavel de ambiente com a URL de producao.

---

## 2. IMPORTANTE - Necessario para uma Boa Experiencia

### 2.1 Sidebar sem Responsividade Mobile
A sidebar e fixa com `w-64` e `ml-64` em todas as paginas. Em dispositivos moveis, o app fica inutilizavel.

**Acao**: Implementar sidebar colapsavel com menu hamburger para mobile.

### 2.2 Recuperacao de Senha
Nao existe fluxo de "Esqueci minha senha" na tela de login.

**Acao**: Adicionar link e fluxo de reset de senha via email.

### 2.3 Leaked Password Protection Desabilitada
O linter do banco identificou que a protecao contra senhas vazadas esta desativada.

**Acao**: Ativar nas configuracoes de autenticacao.

### 2.4 Dominio Customizado
O app esta rodando apenas no subdominio do Lovable. Para uso comercial, e necessario conectar um dominio proprio (ex: app.dermacore.com.br).

---

## 3. DESEJAVEL - Melhorias para Apos o Lancamento

### 3.1 Paginas com Conteudo de Demonstracao
Automacoes, WhatsApp e Pos-Procedimento funcionam como mockups visuais sem integracao real. Sao boas para demonstracao, mas precisarao de backend real para funcionar.

### 3.2 Upload de Logo Real
O botao "Alterar Logo" nas configuracoes nao tem funcionalidade real de upload de arquivo.

### 3.3 Notificacoes Reais
Substituir as notificacoes mock por um sistema real (possivelmente usando Realtime do banco).

### 3.4 Termos de Servico e Politica de Privacidade
A tela de login menciona "Termos de Servico e Politica de Privacidade" mas nao ha link nem paginas reais.

---

## Resumo de Prioridades

| Prioridade | Item | Esforco |
|---|---|---|
| Critico | Mapear stripe_price_id nos planos | Baixo |
| Critico | Corrigir URLs hardcoded | Baixo |
| Critico | Seguranca de dados de pacientes (RLS) | Medio |
| Critico | Conectar dashboard a dados reais | Alto |
| Importante | Layout responsivo mobile | Medio |
| Importante | Fluxo de recuperacao de senha | Baixo |
| Importante | Dominio customizado | Configuracao |
| Desejavel | Upload de logo | Medio |
| Desejavel | Notificacoes reais | Alto |
| Desejavel | Termos e politica de privacidade | Baixo |

---

## Recomendacao

Sugiro comecar pelos itens **criticos** na ordem: (1) corrigir o mapeamento de stripe_price_id, (2) corrigir URLs hardcoded, (3) ajustar RLS de seguranca, e depois (4) conectar o dashboard aos dados reais. Isso garante que o fluxo de pagamento funcione corretamente e que os dados dos pacientes estejam protegidos.

Quer que eu comece por algum desses itens?

