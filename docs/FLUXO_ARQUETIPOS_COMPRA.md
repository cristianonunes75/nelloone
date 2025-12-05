# Fluxo de Compra e Desbloqueio - Arquétipos com Propósito

## Arquivos Principais

| Arquivo | Função |
|---------|--------|
| `supabase/functions/create-checkout/index.ts` | Criação do checkout Stripe |
| `supabase/functions/stripe-webhook/index.ts` | Processa pagamento confirmado |
| `src/lib/priceConfig.ts` | Configuração de preços por moeda |
| `src/pages/TestExecution.tsx` | Execução do teste |
| `src/hooks/useTestExecution.tsx` | Lógica de perguntas e acesso |
| `src/hooks/useJourneyProgress.tsx` | Estados da jornada |
| `src/components/cliente/JourneyStepCard.tsx` | Card de cada teste na jornada |

## Estados do Teste de Arquétipos

```
not_started → in_progress (parte gratuita) → awaiting_payment → full_version_available → completed
```

| Estado | Descrição |
|--------|-----------|
| `not_started` | Usuário não iniciou o teste |
| `in_progress` | Respondendo perguntas |
| `awaiting_payment` | Completou 5 perguntas gratuitas, aguardando pagamento |
| `full_version_available` | Pagou, pode continuar com todas as perguntas |
| `completed` | Completou TODAS as perguntas (versão completa) |

## Variáveis de Ambiente Necessárias

Para ativar pagamento BRL do teste de Arquétipos, crie um produto no Stripe:

**Nome do Produto:** `Arquétipos com Propósito – Acesso Completo NELLO ONE`  
**Descrição:** `Desbloqueie todas as 36 perguntas e o relatório completo dos 12 arquétipos`  
**Preço BRL:** R$ 47,00  
**Preço EUR:** € 9,90

Após criar, adicione os Price IDs em `src/lib/priceConfig.ts` e `supabase/functions/create-checkout/index.ts`.

## Cenários de Teste

### Cenário 1: Usuário Novo
1. Acessa NELLO ONE
2. Clica em "Começar" no teste de Arquétipos
3. Responde 5 perguntas gratuitas
4. Vê resultado parcial com Top 3 arquétipos
5. Clica em "Liberar Relatório Completo"
6. Stripe abre com:
   - Nome: "Arquétipos com Propósito – Acesso Completo NELLO ONE"
   - Moeda: BRL para /pt, EUR para /pt-pt, USD para /en
7. Conclui pagamento
8. Retorna ao dashboard com toast "Pagamento confirmado!"
9. Card mostra "Liberado ✓" e botão "Continuar Teste"
10. Responde perguntas restantes
11. Teste muda para "Concluído"

### Cenário 2: Usuário que já Pagou
1. Retorna ao dashboard
2. Teste de Arquétipos mostra:
   - "Concluído" se terminou tudo
   - "Liberado ✓" + "Continuar Teste" se tem perguntas pendentes
3. Não é jogado para checkout novamente

### Cenário 3: Admin
1. Mesmo fluxo, mas valor pode ser R$ 0
2. Webhook ainda processa e libera acesso

## Correções Aplicadas

1. **Branding**: Todos os nomes de produto usam "NELLO ONE", não "Essentia"
2. **Estado**: Parte gratuita NÃO marca como "completed", usa `awaiting_full_version: true`
3. **Moeda**: Validação de idioma → moeda (pt=BRL, en=USD, pt-pt=EUR)
4. **UI**: JourneyStepCard mostra estados corretos com badges e botões apropriados
