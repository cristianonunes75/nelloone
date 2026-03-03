

# Plano: Visibilidade da Equipe + Código da Essência no Business

## Problema Atual

O menu do Business não tem links diretos para "Equipe" e "Convidar" — essas rotas existem (`/team`, `/invite`) mas ficaram escondidas após a reestruturação focada em Hiring. Além disso, o Team Insights só processa DISC e Temperamentos, ignorando o Código da Essência.

## Mudanças Propostas

### 1. Restaurar "Equipe" e "Convidar" no menu principal

No `BusinessLayout.tsx`, adicionar dois itens ao menu admin:

```text
Menu atual:  Dashboard | Vagas | Candidatos | Avaliações | WhatsApp | Config
Menu novo:   Dashboard | Equipe | Convidar | Vagas | Candidatos | Avaliações | WhatsApp | Config
```

- "Equipe" → `/team` (icon: Users)
- "Convidar" → `/invite` (icon: UserPlus)

### 2. Estender Team Insights com dados do Código da Essência

**Edge function `business-team-insights`**: Adicionar processamento da tabela `ativacao_codigo` para membros com consentimento, extraindo:
- Distribuição de temperamentos dominantes da equipe
- Padrões de essência agregados (sem expor dados individuais)
- Indicadores de complementaridade (diversidade de perfis)

**UI `TeamInsightsTab`**: Nova seção "Código da Essência da Equipe" mostrando:
- Quantos membros completaram a jornada completa (7 mapas)
- Quantos têm o Código da Essência gerado
- Gráfico agregado de tendências (temperamentos dominantes, padrões comportamentais)
- Alertas de concentração (ex: "80% da equipe tem perfil S — considere diversificar")

### 3. Melhorar a coluna de progresso na tela de Equipe

No `BusinessTeam.tsx`, expandir a coluna "Progresso" para mostrar:
- `X/7 mapas` em vez de apenas `X/Y testes`
- Badge "Código da Essência ✓" quando o membro completou
- Status de consentimento de compartilhamento

## Detalhes Técnicos

### Arquivos modificados
1. **`src/apps/business/components/BusinessLayout.tsx`** — Adicionar itens "Equipe" e "Convidar" ao `adminNavItems`
2. **`supabase/functions/business-team-insights/index.ts`** — Estender query para incluir dados de `ativacao_codigo` e `test_results` dos 7 mapas
3. **`src/apps/business/components/TeamInsightsTab.tsx`** — Nova seção com métricas do Código da Essência
4. **`src/apps/business/pages/BusinessTeam.tsx`** — Melhorar coluna de progresso

### Segurança (LGPD)
- Dados do Código da Essência só são processados para membros com `consent_given = true` E `share_report_with_company = true`
- RH/dono vê apenas dados **agregados** (tendências da equipe, distribuições percentuais)
- Nenhum relatório individual ou resposta específica é exposta
- Todas as consultas são registradas em `company_audit_logs`

### Banco de dados
- Nenhuma nova tabela necessária — as tabelas `ativacao_codigo`, `test_results`, `company_users` já existem
- Possivelmente uma nova coluna `has_essence_code boolean` em `company_users` para cache (opcional, pode ser derivado via join)

