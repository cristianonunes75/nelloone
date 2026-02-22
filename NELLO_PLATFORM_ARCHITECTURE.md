# NELLO PLATFORM ARCHITECTURE

## Classificação de Módulos

O ecossistema Nello One é organizado em duas camadas:

### CORE PLATFORM
Módulos estruturais que formam a base do ecossistema.

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Identity** | Autoconhecimento, Código de Essência, testes comportamentais | Ativo |
| **Praxis** | Operadores, gestão de clientes, metodologias | Ativo |
| **Business** | Empresas, assinaturas corporativas, insights de equipe | Ativo |
| **Hiring** | Recrutamento e seleção baseados em perfil comportamental | Ativo |

### VERTICAL PRODUCTS
Produtos verticais que atendem nichos específicos utilizando a plataforma core.

| Vertical | Categoria | Descrição | Status |
|----------|-----------|-----------|--------|
| **Discernir** | Pastoral | Discernimento vocacional e orientação pastoral | Ativo |

## Control Center

O painel administrativo (`/admin/control-center`) reflete esta arquitetura:

### Seção 1 — Platform Core
- **Usuários** (Identity): total, novos 7d, códigos ativados, ativos
- **Operadores** (Praxis): ativos, clientes/operador, empresas vinculadas, programas
- **Empresas** (Business): cadastradas, colaboradores, assinaturas, renovações

### Seção 2 — Active Verticals
- **Discernir** (Pastoral): testes completados, códigos ativados

### Seções Cross-Platform
- **Financeiro**: MRR individual, MRR corporate, receita total, churn
- **Sistema**: feature flags, uso de IA, erros, módulos ativos

## Indicadores Visuais

O módulo status no Control Center exibe:
- **Platform Core**: Identity, Praxis, Business, Hiring — com indicador de ativação
- **Verticals**: Discernir (Pastoral) — com badge de categoria

## Princípios

1. **Core = infraestrutura** — módulos que todos os verticais podem consumir
2. **Verticals = nicho** — produtos especializados construídos sobre o core
3. **Sem alteração funcional** — apenas organização conceitual e visual
4. **Expansibilidade** — novos verticais podem ser adicionados à lista `VERTICAL_PRODUCTS`

## Arquivos Relevantes

- `src/components/admin/AdminControlCenter.tsx` — Dashboard com seções Platform Core / Active Verticals
- `src/services/getEcosystemMetrics.ts` — Serviço de métricas (inclui Hiring nos módulos ativos)
- `NELLO_CONTROL_CENTER.md` — Documentação original do Control Center
