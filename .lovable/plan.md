
# Plano de Implementacao: Relatorios de Vendas e Gestao de Precos

## Resumo

Vou implementar tres funcionalidades relacionadas no painel administrativo:

1. **Relatorio de Vendas por Produto** - Dashboard visual mostrando receita gerada por cada produto
2. **Pagina de Precos Centralizada** - Interface unificada para visualizar e editar todos os precos
3. **Sincronizacao de Precos** - Manter consistencia entre priceConfig.ts e banco de dados

---

## 1. Relatorio de Vendas por Produto

### O que sera construido:

Uma nova pagina de relatorios que mostra:
- Tabela com receita por produto (BRL, USD, EUR)
- Grafico de barras comparativo
- Filtros por periodo (7 dias, 30 dias, todo o periodo)
- Estatisticas resumidas (total vendido, ticket medio, produto mais vendido)

### Categorias de produtos rastreados:

```text
+----------------------------+------------------------+
|        Categoria           |      Produtos          |
+----------------------------+------------------------+
| Jornada Completa           | Bundle R$297           |
| Testes Avulsos             | 7 testes individuais   |
| Codigo da Essencia         | Relatorio final        |
| Ativacao do Codigo         | Upsell individual      |
| Identity Couple Premium    | High-ticket casais     |
| Codigo do Casal            | Relatorio casal        |
| Ativacao do Casal          | Upsell casal           |
+----------------------------+------------------------+
```

### Interface proposta:

- Cards KPI no topo (Receita Total, Vendas Hoje, Ticket Medio, Produto Top)
- Tabela detalhada com colunas: Produto | Vendas | Receita BRL | Receita USD | Receita EUR | Total
- Grafico de pizza mostrando distribuicao de receita
- Botao de exportar CSV

---

## 2. Pagina de Precos Centralizada

### O que sera construido:

Uma nova pagina Admin onde todos os precos podem ser visualizados e editados em um unico lugar.

### Estrutura da interface:

```text
+----------------------------------------------------------+
| GESTAO DE PRECOS                           [Sincronizar] |
+----------------------------------------------------------+
|                                                          |
| +-- TESTES INDIVIDUAIS --------------------------------+ |
| | Produto          | BRL   | USD   | EUR   | Acoes     | |
| |------------------+-------+-------+-------+-----------| |
| | Arquetipos       | R$47  | $19   | EUR9.90| [Editar]  | |
| | DISC             | R$97  | $47   | EUR17.90| [Editar] | |
| | MBTI             | R$197 | $57   | EUR52.90| [Editar] | |
| | Eneagrama        | R$177 | $49   | EUR44.90| [Editar] | |
| | Temperamentos    | R$117 | $27   | EUR24.90| [Editar] | |
| | Linguagens Amor  | R$127 | $17   | EUR15.90| [Editar] | |
| | Inteligencias    | R$147 | $29   | EUR27.90| [Editar] | |
| +------------------------------------------------------+ |
|                                                          |
| +-- BUNDLES E PREMIUM -------------------------------- + |
| | Produto          | BRL   | USD   | EUR   | Acoes     | |
| |------------------+-------+-------+-------+-----------| |
| | Jornada Completa | R$297 | $97   | EUR89  | [Editar]  | |
| | Codigo Essencia  | R$397 | $97   | EUR97  | [Editar]  | |
| | Ativacao Codigo  | R$197 | $57   | EUR47  | [Editar]  | |
| | Couple Premium   | R$997 | $297  | EUR247 | [Editar]  | |
| +------------------------------------------------------+ |
|                                                          |
+----------------------------------------------------------+
```

### Funcionalidades de edicao:

- Dialog modal para editar precos (BRL, USD, EUR)
- Validacao de valores
- Atualizacao no priceConfig.ts (via re-deploy necessario) e banco de dados

---

## 3. Sincronizacao de Precos

### Estrategia:

Atualmente os precos estao em dois lugares:
- `src/lib/priceConfig.ts` - Precos e Stripe Price IDs
- Tabela `tests` - Coluna `price_brl` e `stripe_price_id`

### Solucao proposta:

1. **Criar tabela `product_prices`** no banco de dados para armazenar precos de forma centralizada
2. **Migrar precos** do priceConfig.ts para a nova tabela
3. **Botao de sincronizacao** que atualiza a tabela tests com os precos da tabela product_prices

### Schema da nova tabela:

```sql
CREATE TABLE product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key TEXT NOT NULL UNIQUE,  -- 'arquetipos', 'disc', 'codigo_da_essencia', etc
  product_name TEXT NOT NULL,
  price_brl NUMERIC(10,2) NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  price_eur NUMERIC(10,2) NOT NULL,
  stripe_price_id_brl TEXT,
  stripe_price_id_usd TEXT,
  stripe_price_id_eur TEXT,
  is_active BOOLEAN DEFAULT true,
  product_category TEXT NOT NULL,  -- 'test', 'bundle', 'premium', 'upsell'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/admin/AdminSalesReport.tsx` | Relatorio de vendas por produto |
| `src/components/admin/AdminPriceManager.tsx` | Gestao centralizada de precos |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/admin/AdminSidebar.tsx` | Adicionar links para as novas paginas |
| `src/pages/Admin.tsx` | Adicionar rotas para as novas paginas |

## Migracao de Banco de Dados

Criar tabela `product_prices` com dados iniciais de todos os produtos.

---

## Detalhes Tecnicos

### Componente AdminSalesReport

- Usa `supabase.from("test_purchases")` para buscar vendas
- Agrupa por `purchase_category` e `test_slug`
- Calcula receita por moeda (BRL, USD, EUR)
- Usa Recharts para graficos (BarChart, PieChart)
- Permite filtro por periodo

### Componente AdminPriceManager

- Busca dados da tabela `product_prices`
- Exibe todos os produtos em tabela organizada por categoria
- Dialog de edicao com inputs para cada moeda
- Validacao de precos (nao negativos, formato correto)
- Sincroniza com tabela `tests` ao salvar

### Fluxo de Sincronizacao

1. Usuario edita preco no AdminPriceManager
2. Preco e salvo em `product_prices`
3. Trigger ou funcao sincroniza `price_brl` na tabela `tests`
4. Para Stripe, usuario precisa atualizar manualmente ou criar novo price

---

## Ordem de Implementacao

1. Criar tabela `product_prices` com dados iniciais
2. Criar componente `AdminSalesReport.tsx`
3. Criar componente `AdminPriceManager.tsx`
4. Atualizar sidebar e rotas
5. Testar sincronizacao entre tabelas

