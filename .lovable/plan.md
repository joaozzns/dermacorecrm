

# Plano: Compatibilizar Gestao de Equipe com Limites do Plano

## Problema Identificado

Atualmente, o sistema tem lacunas na validacao de limites de plano para profissionais:

1. **Aceitar convite nao verifica limites** -- A funcao `accept_clinic_invite` no banco de dados vincula o usuario a clinica sem verificar se o limite de profissionais do plano foi atingido.
2. **Aceitar convite nao cria registro em `team_members`** -- Apenas atualiza o `profiles.clinic_id`, sem criar um `team_member`, o que significa que o novo membro nao aparece na pagina Equipe e nao e contabilizado nos limites.
3. **UI nao informa limites** -- A tela de Equipe e o dialog de convites nao mostram quantos profissionais ainda podem ser adicionados.

## Solucao Proposta

### 1. Atualizar funcao SQL `accept_clinic_invite`

Modificar a funcao no banco para:
- Consultar o plano atual da clinica e o limite de profissionais (`max_professionals`)
- Contar os `team_members` ativos na clinica
- Se o limite for atingido, retornar erro: "Limite de profissionais do plano atingido"
- Se permitido, criar automaticamente um registro em `team_members` ao aceitar o convite

### 2. Exibir informacao de limite na pagina Equipe

Na pagina Equipe e no dialog de convite:
- Mostrar um indicador visual como "2/2 profissionais" ou "1/5 profissionais" com base no plano
- Desabilitar o botao "Gerar Link" quando o limite estiver atingido, com mensagem orientando upgrade
- Utilizar o hook `usePlanLimits` ja existente

### 3. Validacao dupla (backend + frontend)

- **Backend (SQL)**: Validacao definitiva dentro de `accept_clinic_invite` -- impede que alguem ultrapasse o limite mesmo manipulando o frontend
- **Frontend**: Feedback visual proativo -- o admin ve que esta no limite antes de gerar convites desnecessarios

## Detalhes Tecnicos

### Migracao SQL

```sql
CREATE OR REPLACE FUNCTION public.accept_clinic_invite(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_profile RECORD;
  v_plan RECORD;
  v_current_count integer;
BEGIN
  -- (checks existentes de perfil e convite)
  
  -- Verificar limite do plano
  SELECT p.max_professionals INTO v_plan
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.clinic_id = v_invite.clinic_id
    AND s.status IN ('active', 'trial')
  LIMIT 1;

  IF v_plan.max_professionals IS NOT NULL THEN
    SELECT count(*) INTO v_current_count
    FROM team_members
    WHERE clinic_id = v_invite.clinic_id AND is_active = true;

    IF v_current_count >= v_plan.max_professionals THEN
      RETURN jsonb_build_object('success', false, 
        'error', 'Limite de profissionais do plano atingido. Peca ao admin fazer upgrade.');
    END IF;
  END IF;

  -- Vincular perfil a clinica
  UPDATE profiles SET clinic_id = v_invite.clinic_id, role = v_invite.role ...;

  -- Criar team_member automaticamente
  INSERT INTO team_members (clinic_id, profile_id, is_active)
  VALUES (v_invite.clinic_id, auth.uid(), true);

  -- Incrementar uso do convite
  UPDATE clinic_invites SET used_count = used_count + 1 ...;

  RETURN jsonb_build_object('success', true, 'clinic_id', v_invite.clinic_id);
END;
$$;
```

### Alteracoes no Frontend

**`src/pages/Equipe.tsx`**:
- Importar `usePlanLimits` e exibir badge com contagem (ex: "2/5 profissionais")
- Desabilitar botao "Novo Profissional" quando `isAtLimit('professionals')` for true
- Mostrar alerta com link para upgrade quando no limite

**`src/components/clinic/InviteManagement.tsx`**:
- Desabilitar botao "Gerar Link" quando no limite
- Mostrar aviso informativo sobre o limite do plano

### Arquivos Modificados

| Arquivo | Alteracao |
|---|---|
| Nova migracao SQL | Reescrever `accept_clinic_invite` com checagem de limite + criacao de `team_member` |
| `src/pages/Equipe.tsx` | Adicionar indicador de uso e bloquear botao no limite |
| `src/components/clinic/InviteManagement.tsx` | Bloquear geracao de link no limite |

