

# Tempo de Conclusao da Jornada - Admin Dashboard

## Objetivo
Adicionar metricas de tempo de conclusao da jornada completa na area admin, mostrando quanto tempo cada usuario levou para completar os 7 testes.

## Dados Disponiveis (sem mudancas no banco)
- `profiles.journey_started_at` -- quando o usuario iniciou a jornada
- `profiles.journey_completed_at` -- quando completou todos os 7 testes
- `user_tests.started_at` / `completed_at` -- timestamps por teste individual

## Mudancas

### 1. AdminJourneyDashboard.tsx - Adicionar secao de Tempo de Conclusao

**Stats Cards novos** (no topo, junto aos existentes):
- **Tempo Medio** -- media de dias entre `journey_started_at` e `journey_completed_at` para usuarios com status "completed"
- **Mais Rapido** -- menor tempo registrado
- **Mais Lento** -- maior tempo registrado

**Coluna nova na tabela de usuarios:**
- Coluna "Tempo" ao lado de "Inativo", mostrando a duracao formatada (ex: "2d 4h", "5d", "12h") para usuarios com jornada completa

**Card de Distribuicao de Tempo** (novo card abaixo dos stats):
- Agrupamento por faixas: menos de 1 dia, 1-3 dias, 3-7 dias, 7-14 dias, 14+ dias
- Barras horizontais simples mostrando a contagem em cada faixa
- Permitira entender onde esta a maioria dos usuarios

### 2. Logica de Calculo
- Buscar `journey_started_at` e `journey_completed_at` dos profiles que ja sao carregados
- Calcular diferenca em horas/dias
- Agregar estatisticas (media, min, max, distribuicao)
- Tudo client-side, sem queries adicionais -- os dados ja estao no fetch existente

### Detalhes Tecnicos
- Arquivo modificado: `src/components/admin/AdminJourneyDashboard.tsx`
- Sem migracoes de banco de dados
- Sem novas dependencias
- Calculo feito com `useMemo` sobre os dados ja carregados
- Formatacao de tempo: funcao utilitaria para converter ms em "Xd Yh"
