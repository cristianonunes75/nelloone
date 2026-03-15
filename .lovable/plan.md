

## Diagnóstico

A tabela `company_users` atualmente **não possui** um campo de cargo/posição. Os campos existentes são apenas administrativos (role, consent, sharing, etc.). O campo `role` é o papel no sistema (admin/collaborator), **não** o cargo na empresa (ex: "Gerente de Marketing", "Analista de RH").

Para permitir edição do cargo de cada colaborador na aba Equipe, precisamos:

## Plano

### 1. Adicionar coluna `job_title` na tabela `company_users`
- Migration: `ALTER TABLE company_users ADD COLUMN job_title TEXT DEFAULT NULL`
- Sem impacto em dados existentes (nullable, sem breaking changes)

### 2. Adicionar coluna `department` (opcional, mas recomendado)
- `ALTER TABLE company_users ADD COLUMN department TEXT DEFAULT NULL`
- Permite agrupar por área futuramente (People Strategy, filtros, etc.)

### 3. Tornar o cargo editável na tabela de Membros (`TeamMembersTab`)
- Exibir coluna "Cargo" na tabela (entre Nome e Função)
- No dropdown de ações (menu `...`), adicionar opção "Editar cargo"
- Ao clicar, abrir um Dialog simples com campos:
  - **Cargo** (ex: "Gerente de Vendas")
  - **Departamento** (ex: "Comercial") — opcional
- Salvar via `supabase.from('company_users').update({ job_title, department })`

### 4. Atualizar a busca
- Incluir `job_title` e `department` no filtro de busca existente

### Resultado visual na tabela

```text
Nome              | Cargo                | Função      | Status    | Progresso | Desde
Maria Silva       | Gerente de Marketing | Colaborador | Concluído | 7/7 mapas | 01 Jan 2025
João Santos       | Analista de RH       | Admin       | Em andamento | 3/7 mapas | 15 Fev 2025
Ana Costa         | —                    | Colaborador | Não iniciado | -         | 01 Mar 2025
```

### Arquivos afetados
- **Migration SQL**: adicionar `job_title` e `department` em `company_users`
- **`TeamMembersTab.tsx`**: nova coluna, dialog de edição, busca atualizada
- **`TeamMembersSection.tsx`**: exibir cargo na versão resumida (se aplicável)

