
# Tornar Agenda, WhatsApp e Follow-up Funcionais com Dados Reais

## Visao Geral

Os tres modulos atualmente usam dados hardcoded/fake. O plano conecta cada um ao banco de dados real, usando hooks e tabelas existentes onde possivel e criando novas tabelas quando necessario.

---

## 1. Agenda - Conectar ao Banco de Dados

**Problema**: Usa `initialAgendamentos` hardcoded e `profissionais` fixos.
**Solucao**: Usar o hook `useAppointments` (ja existente) e `useTeamMembers` para dados reais.

### Mudancas:
- **Reescrever `src/pages/Agenda.tsx`**:
  - Remover arrays `profissionais` e `initialAgendamentos` hardcoded
  - Importar e usar `useAppointments(selectedDate)` para agendamentos reais
  - Importar e usar `useTeamMembers()` para listar profissionais nas colunas
  - Importar e usar `usePatients()` para selecionar pacientes ao criar agendamento
  - Formulario "Novo Agendamento" passa a usar `createAppointment.mutateAsync()` com patient_id, professional_id, title, start_time, end_time
  - Confirmar agendamento usa `updateAppointment.mutateAsync({ id, status: 'confirmado' })`
  - Converter horarios do grid para timestamps reais baseados na `selectedDate`
  - Filtros por profissional e status continuam funcionando sobre os dados reais

---

## 2. WhatsApp - Hub de Comunicacao com Leads Reais

**Problema**: Conversas, mensagens e templates sao todos hardcoded.
**Solucao**: Transformar em um hub de comunicacao baseado em leads reais, com registro de interacoes.

### Nova tabela no banco:
- **`lead_interactions`**: Registra cada interacao com um lead
  - `id`, `clinic_id`, `lead_id`, `type` (whatsapp/phone/email/note), `content`, `direction` (inbound/outbound), `created_by`, `created_at`

### Mudancas:
- **Criar migracao** para tabela `lead_interactions` com RLS por clinic_id
- **Criar hook `useLeadInteractions`**: CRUD para interacoes
- **Reescrever `src/pages/WhatsApp.tsx`**:
  - Lista de conversas = leads reais (do `useLeads()`) com ultimo contato e interesse
  - Ao selecionar um lead, mostrar historico de interacoes reais (da tabela `lead_interactions`)
  - Enviar mensagem: abre wa.me com o telefone real do lead E registra a interacao no banco
  - Painel de contexto mostra dados reais do lead (nome, telefone, interesse, status, valor do orcamento se houver)
  - Templates continuam como constantes no frontend (nao precisam de tabela)
  - Botoes de acao (ligar, WhatsApp) usam telefone real do lead

---

## 3. Follow-up - Sequencias e Leads Esfriando Reais

**Problema**: Sequencias e leads esfriando sao hardcoded.
**Solucao**: Criar tabela de sequencias no banco e calcular leads esfriando a partir de leads reais.

### Nova tabela no banco:
- **`follow_up_sequences`**: Sequencias de follow-up configuradas
  - `id`, `clinic_id`, `name`, `description`, `type`, `steps_count`, `is_active`, `created_at`, `updated_at`

### Mudancas:
- **Criar migracao** para tabela `follow_up_sequences` com RLS por clinic_id
- **Criar hook `useFollowUpSequences`**: CRUD para sequencias
- **Reescrever `src/pages/Followup.tsx`**:
  - "Leads Esfriando" = leads reais filtrados por `last_contact_at` (calcular dias sem contato)
    - Leads com `last_contact_at` > 3 dias atras e status diferente de 'convertido'/'perdido'
    - Urgencia calculada dinamicamente: >7 dias = critico, 3-7 = atencao, <3 = monitorar
  - Sequencias vem do banco via `useFollowUpSequences`
  - Criar nova sequencia persiste no banco
  - Ativar/pausar sequencia atualiza `is_active` no banco
  - Metricas de receita em risco calculadas a partir dos orcamentos vinculados aos leads esfriando
  - Botoes de acao (WhatsApp, ligar, email) usam dados reais do lead e registram interacao na tabela `lead_interactions`

---

## Resumo Tecnico

| Item | Acao |
|------|------|
| Migracoes SQL | 2 tabelas novas: `lead_interactions`, `follow_up_sequences` |
| Hooks novos | `useLeadInteractions`, `useFollowUpSequences` |
| Paginas reescritas | `Agenda.tsx`, `WhatsApp.tsx`, `Followup.tsx` |
| Hooks existentes reutilizados | `useAppointments`, `useTeamMembers`, `usePatients`, `useLeads`, `useQuotes` |

### Ordem de execucao:
1. Criar as 2 migracoes SQL (tabelas + RLS)
2. Criar os 2 hooks novos
3. Reescrever Agenda.tsx (usando hooks existentes)
4. Reescrever WhatsApp.tsx (usando leads reais + novo hook de interacoes)
5. Reescrever Followup.tsx (usando leads reais + novo hook de sequencias)
