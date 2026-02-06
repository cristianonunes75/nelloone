

# Implementação: Corrigir Idiomas dos Testes

## O Problema
Os testes ativos estão configurados com idioma `pt-pt` (Portugal) ao invés de `pt` (Brasil), fazendo com que usuários brasileiros não consigam ver/acessar os testes corretamente.

## Ações a Executar

### 1. Migration SQL - Corrigir Idioma dos Testes

Atualizar os 5 testes que estão incorretamente marcados:

```sql
UPDATE tests
SET language = 'pt'
WHERE id IN (
  'bdd55908-87a6-46de-9d1d-e5b37c24cf58',  -- DISC
  '8de61499-2e46-45ad-8f1c-87523ac5d339',  -- Nello 16
  '12aaa9e6-cabe-4f77-aae2-5bf478dec76a',  -- Conexão Afetiva
  'b9be06b8-1692-4d05-aa06-baa21704118e',  -- Temperamentos
  'd843395e-8b1e-4d80-8fa8-8a5a0c555491'   -- Arquétipos
)
AND language = 'pt-pt';
```

### 2. Corrigir Registro da Suami

Atualizar o `user_test` existente para apontar ao teste correto:

```sql
UPDATE user_tests
SET test_id = 'd843395e-8b1e-4d80-8fa8-8a5a0c555491'
WHERE id = 'fe3a05bf-c392-488d-91b0-31011113ab4e'
AND test_id = 'e1a3511e-7b93-4dec-87f1-b5ef87d7f8a3';
```

## Resultado Esperado

| Teste | Antes | Depois |
|-------|-------|--------|
| DISC | Invisível para BR | Visível |
| Nello 16 | Invisível para BR | Visível |
| Conexão Afetiva | Invisível para BR | Visível |
| Temperamentos | Invisível para BR | Visível |
| Arquétipos | Invisível para BR | Visível |
| Suami - Arquétipos | Teste inativo | Teste correto |

## Impacto

- Todos os usuários brasileiros voltam a ver a jornada completa (7 testes)
- Suami consegue continuar o teste de Arquétipos normalmente
- Nenhum impacto em usuários de Portugal (se existirem, precisarão de testes próprios)

