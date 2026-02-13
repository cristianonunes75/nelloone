
## Correção do Bug: "Desbloquear por [object Object]"

O problema que o Sérgio encontrou acontece porque o botão de desbloqueio tenta mostrar o preço, mas exibe `[object Object]` em vez do valor formatado (ex: `R$ 648,50`).

### Causa
A variavel `bundlePrice` retorna um objeto com propriedades (`symbol`, `price`, `original`), mas o codigo usa `${bundlePrice}` diretamente no texto do botao, sem acessar as propriedades corretas.

### Correção
No arquivo `src/pages/TestExecution.tsx`, linha 541-542, trocar:

```
Unlock for ${bundlePrice}
Desbloquear por ${bundlePrice}
```

Por:

```
Unlock for ${bundlePrice.symbol}${bundlePrice.price}
Desbloquear por ${bundlePrice.symbol}${bundlePrice.price}
```

Isso vai exibir corretamente, por exemplo: **"Desbloquear por R$648.5"** ou **"Unlock for $198.5"**.

### Detalhes Técnicos
- **Arquivo**: `src/pages/TestExecution.tsx` (linhas 540-542)
- **Função origem**: `getBundlePriceForLanguage()` em `src/lib/priceConfig.ts` retorna um objeto `{ symbol, price, original, priceId, currency }`
- Correção pontual de 2 linhas, sem impacto em outros fluxos
