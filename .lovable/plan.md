
# Persistencia das Configuracoes da Clinica

## Resumo
Atualmente, todas as configuracoes da pagina de Configuracoes sao armazenadas apenas em estado local (useState). Ao recarregar a pagina, tudo se perde. O objetivo e salvar e carregar essas configuracoes no banco de dados.

## O que muda para voce
- As informacoes da clinica (nome, CNPJ, telefone, redes sociais, endereco) serao salvas de verdade
- As preferencias de notificacao e agenda tambem serao persistidas
- Ao abrir a pagina, os dados serao carregados automaticamente do banco

## Plano Tecnico

### 1. Migracoes no Banco de Dados

**Expandir a tabela `clinics`** com novas colunas para os dados que faltam:

```sql
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS legal_name text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS cnpj text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS business_hours text;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS logo_url text;
```

**Criar tabela `clinic_settings`** para preferencias de notificacao e agenda (dados JSONB):

```sql
CREATE TABLE public.clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL UNIQUE REFERENCES public.clinics(id) ON DELETE CASCADE,
  notification_preferences jsonb NOT NULL DEFAULT '{}',
  agenda_preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: mesma logica de isolamento por clinica
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their clinic settings"
  ON public.clinic_settings FOR SELECT
  USING (clinic_id = get_my_clinic());

CREATE POLICY "Admins can update their clinic settings"
  ON public.clinic_settings FOR UPDATE
  USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

CREATE POLICY "Admins can insert their clinic settings"
  ON public.clinic_settings FOR INSERT
  WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');

-- Trigger updated_at
CREATE TRIGGER update_clinic_settings_updated_at
  BEFORE UPDATE ON public.clinic_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Criar Hook `useClinicSettings`

Novo arquivo `src/hooks/useClinicSettings.tsx`:

- Busca dados da tabela `clinics` e `clinic_settings` ao montar
- Funcao `updateClinicInfo()` - atualiza dados da clinica (nome, CNPJ, etc.)
- Funcao `updateSettings()` - atualiza preferencias (notificacoes, agenda)
- Faz upsert na tabela `clinic_settings` (insert se nao existir, update se existir)
- Usa react-query para cache e invalidacao

### 3. Refatorar Pagina de Configuracoes

Atualizar `src/pages/Configuracoes.tsx`:

- Remover dados hardcoded dos useState
- Importar e usar o hook `useClinicSettings`
- Carregar dados reais ao montar (com loading state)
- O botao "Salvar Alteracoes" chama as funcoes do hook para persistir
- Adicionar indicadores de carregamento e estados de erro
- Manter a mesma interface visual, apenas conectando ao banco

### Arquivos afetados
- 1 migracao SQL (novas colunas + nova tabela)
- 1 arquivo novo: `src/hooks/useClinicSettings.tsx`
- 1 arquivo editado: `src/pages/Configuracoes.tsx`
