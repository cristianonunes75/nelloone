
## Correcao: Testes de usuarios apontando para versoes desativadas (pt-legacy)

### Diagnostico

A Saula completou 3 testes (DISC, Temperamentos, Arquetipos) quando os registros ativos eram da versao `pt-legacy`. Depois, esses testes foram migrados para novos registros `pt`, mas os `user_tests` dela continuam apontando para os IDs antigos (`pt-legacy`, `active=false`).

O hook `useTests` filtra apenas testes com `language=pt` e `active=true`, entao esses registros completados ficam invisiveis no dashboard. O perfil mostra 7/7 (porque `journey_tests_status` foi atualizado), mas a interface visual nao encontra os resultados.

### Usuarios afetados

Qualquer usuario que completou testes ANTES da migracao `pt-legacy` para `pt` pode ter esse problema. Nao e apenas a Saula.

### Solucao em 2 partes

#### Parte 1: Migracao SQL (correcao imediata para todos os usuarios afetados)

Atualizar todos os `user_tests` que apontam para testes `pt-legacy` desativados, redirecionando para os equivalentes `pt` ativos:

```text
Para cada tipo de teste (disc, temperamentos, arquetipos_proposito, linguagens_amor, mbti):
1. Encontrar o test_id da versao pt-legacy (desativada)
2. Encontrar o test_id da versao pt (ativa)
3. Atualizar user_tests que apontam para o legacy, redirecionando para o ativo
4. Tratar duplicatas: se o usuario ja tem registro no teste pt ativo,
   manter o registro completado e remover o duplicado
```

Mapeamento especifico:
- DISC: `7c533b3e` (legacy) para `bdd55908` (ativo)
- Temperamentos: `2a5c48c4` (legacy) para `b9be06b8` (ativo)
- Arquetipos: `e1a3511e` (legacy) para `d843395e` (ativo)
- Estilos Conexao: `2a1fea19` (legacy) para `12aaa9e6` (ativo)
- Nello16/MBTI: `5b83bbe8` (legacy) para `8de61499` (ativo)

#### Parte 2: Ajuste no useTests.tsx (prevencao futura)

Modificar a query de `userTests` para nao filtrar apenas por idioma ativo. Em vez disso, buscar TODOS os `user_tests` do usuario e depois fazer o mapeamento por `type` para os testes ativos. Isso garante que mesmo se houver registros apontando para versoes antigas, o sistema encontre os resultados.

### Detalhes tecnicos

**Migracao SQL:**
- Para cada par legacy/ativo, executar UPDATE com tratamento de conflito
- Quando o usuario ja tem um `user_test` para ambos os IDs (legacy e ativo), manter o que tem `status=completed` e deletar o duplicado `in_progress`
- Caso da Saula: DISC e Arquetipos nao tem registro `pt` (apenas legacy), entao e um UPDATE simples. Temperamentos tem ambos (legacy=completed, pt=in_progress), entao deleta o `in_progress` e atualiza o `completed`

**useTests.tsx:**
- Remover o pre-filtro por `language` na query de `user_tests`
- Buscar todos os `user_tests` do usuario com join em `tests`
- No mapeamento (linha 64), priorizar registros `completed` sobre `in_progress` quando existirem duplicatas para o mesmo `type`
