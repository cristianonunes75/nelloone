

# Plano: Página de Venda "Jornada Identity - Código da Essência" (R$ 99)

## Contexto

Atualmente, o produto "Código da Essência Express" (R$ 99) é vendido apenas como upsell inline no componente `EssenceUpsell.tsx`, que aparece após a Leitura Inicial. Não existe uma página de venda dedicada e independente. A "Jornada Completa" (R$ 248,50) foi descontinuada como produto separado.

O objetivo é criar uma **página de venda dedicada** para o produto unificado, agora chamado **"Jornada Identity"**, com todos os depoimentos aprovados e um botão de login para usuários que já fizeram a Leitura Inicial.

---

## O que muda

### 1. Nova página de venda: `/jornada-identity`

Uma página completa e dedicada com:

- **Nome do produto**: "Jornada Identity - Código da Essência"
- **Preço**: R$ 99,00 (pagamento único)
- **Seção de depoimentos**: Todos os depoimentos aprovados do banco (não apenas 3 featured)
- **Botão "Já fiz minha Leitura Inicial"**: Redireciona para `/auth` (login), para que o usuário acesse seu dashboard e compre de lá
- **Botão de compra principal**: Inicia o checkout do `codigo_essencia_express` via edge function `create-checkout`
- **Seções explicativas**: O que está incluído, como funciona, benefícios

### 2. Desabilitar caminho da Jornada Completa (R$ 248,50)

- A página `/checkout` (que vendia a Jornada Completa) será redirecionada para `/jornada-identity`
- O `bundlePrices` permanece no código para compatibilidade com compras existentes, mas não será mais acessível por novos usuários

### 3. Depoimentos - Todos os aprovados

- Query sem filtro `is_featured`, trazendo todos os aprovados com `consent_given = true`
- Layout em grid responsivo com scroll
- Exibindo nome (display_name prioritário) e produto "Jornada Identity"

---

## Detalhes Técnicos

### Arquivos a criar
- `src/pages/JornadaIdentity.tsx` - Nova página de venda dedicada

### Arquivos a modificar

- **`src/App.tsx`**: Adicionar rota `/jornada-identity` e redirecionar `/checkout` para ela
- **`src/components/express/EssenceUpsell.tsx`**: Atualizar nome do produto para "Jornada Identity - Código da Essência"
- **`src/components/express/ExpressResult.tsx`**: Atualizar referências ao nome do produto

### Estrutura da página `/jornada-identity`

```text
+------------------------------------------+
|  Hero: Jornada Identity                  |
|  Código da Essência                      |
|  Subtítulo explicativo                   |
+------------------------------------------+
|  O que você vai descobrir                |
|  (dimensoes ocultas - lista)             |
+------------------------------------------+
|  Preço: R$ 99,00                         |
|  [Começar minha Jornada] (checkout)      |
+------------------------------------------+
|  Depoimentos (todos aprovados)           |
|  Grid responsivo                         |
+------------------------------------------+
|  Já fez a Leitura Inicial?               |
|  [Entrar na minha conta] (login)         |
+------------------------------------------+
|  Disclaimer institucional                |
+------------------------------------------+
```

### Query de depoimentos

Busca todos os aprovados (sem limite de 3, sem filtro `is_featured`), com `display_name` prioritário e label fixo "Jornada Identity".

### Botão Login

Para usuários que já fizeram a Leitura Inicial: redireciona para `/auth` com parâmetro `?redirect=/dashboard`, permitindo que acessem o dashboard e comprem de lá.

