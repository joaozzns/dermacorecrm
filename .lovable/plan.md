

## Plan: Functional Automations Page + Legal Pages

### 1. Database: Create `automations` table

New migration to create an `automations` table with RLS:

```sql
CREATE TABLE public.automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'boas-vindas', -- boas-vindas, lembrete, follow-up
  trigger_event text NOT NULL DEFAULT 'novo_lead', -- novo_lead, agendamento_criado, lead_inativo
  delay_hours integer NOT NULL DEFAULT 0,
  message_template text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT 'whatsapp', -- whatsapp, email, notificacao
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- RLS policies (clinic-scoped)
CREATE POLICY "Users can view automations" ON public.automations FOR SELECT USING (clinic_id = get_my_clinic());
CREATE POLICY "Admins can create automations" ON public.automations FOR INSERT WITH CHECK (clinic_id = get_my_clinic() AND get_my_role() = 'admin');
CREATE POLICY "Admins can update automations" ON public.automations FOR UPDATE USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');
CREATE POLICY "Admins can delete automations" ON public.automations FOR DELETE USING (clinic_id = get_my_clinic() AND get_my_role() = 'admin');
```

### 2. Hook: `useAutomations`

New file `src/hooks/useAutomations.tsx` -- CRUD hook for the `automations` table, following the same pattern as `useFollowUpSequences`. Provides `automations`, `isLoading`, `createAutomation`, `updateAutomation`, `toggleAutomation`, `deleteAutomation`.

### 3. Automations Page (rewrite `src/pages/Automacoes.tsx`)

Replace the placeholder with a functional page:
- Header with "Nova Automação" button (admin only)
- List of automation cards showing: name, type badge, trigger, delay, channel, active/inactive toggle
- Empty state when no automations exist
- Dialog for creating/editing automations with fields:
  - **Nome** (text input)
  - **Tipo** (select: Boas-vindas, Lembrete, Follow-up)
  - **Gatilho** (select: Novo lead, Agendamento criado, Lead inativo por X dias)
  - **Atraso** (number input + unit: minutos/horas/dias)
  - **Canal** (select: WhatsApp, Notificação interna)
  - **Mensagem template** (textarea with placeholder variables like `{{nome}}`, `{{procedimento}}`)
- Toggle switch to activate/deactivate each automation
- Delete button with confirmation

### 4. Legal Pages

**New files:**
- `src/pages/TermosDeUso.tsx` -- Terms of Use page with generic content for Brazilian aesthetic clinics (LGPD-compliant language, SaaS terms, data handling, subscription terms, cancellation policy)
- `src/pages/PoliticaPrivacidade.tsx` -- Privacy Policy page (data collection, cookies, LGPD rights, data retention, contact info)

Both pages will use a clean layout with the DermaCore logo, back navigation, and formatted legal text sections.

### 5. Route Registration (`src/App.tsx`)

Add two new public routes:
- `/termos` -> `TermosDeUso`
- `/privacidade` -> `PoliticaPrivacidade`

### 6. Footer Links Update (`FooterSection.tsx`)

Replace `mailto:` links for "Termos de Uso", "Privacidade", and "Termos" with proper `<Link>` components pointing to `/termos` and `/privacidade`.

### 7. Auth Page Links (`Auth.tsx`)

Update line 512 to include actual links to `/termos` and `/privacidade` instead of plain text.

### Technical Details

- The `automations` table uses `clinic_id` scoping with `get_my_clinic()` for RLS, consistent with all other tables.
- Admin-only write access matches the pattern used in `procedures`, `team_members`, etc.
- The hook casts queries through `as any` / `as unknown` since the types file is auto-generated and may not immediately reflect the new table.
- Legal pages are public routes (no `ProtectedRoute` wrapper).

