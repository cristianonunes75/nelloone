

## Resolver cruzamentos duplicados da Janaina e do Luiz Fernando

### Situacao atual no banco

Existem **dois cruzamentos pendentes**:

1. **Janaina convidou Luiz** (`d32a4e73`) - criado em 13/02, status: pending
2. **Luiz convidou Janaina** (`d477e707`) - criado em 13/02, status: pending

Nenhum dos dois foi aceito, entao ambos aparecem como "Aguardando consentimento" para cada um.

### Solucao

1. **Aceitar o cruzamento mais antigo** (o da Janaina, `d32a4e73`):
   - Definir `user_b_id` como o ID do Luiz (`54c70e85-714a-4ce9-b2e3-e004de0a51f0`)
   - Registrar `user_b_consent_at` e `invite_accepted_at` como agora
   - Mudar `status` para `accepted`

2. **Remover o cruzamento duplicado** (`d477e707`) criado pelo Luiz:
   - Deletar o registro para nao gerar confusao

### Resultado esperado

- Janaina e Luiz verao **um unico cruzamento** com status "Aceito"
- Ambos podem prosseguir para gerar o relatorio de casal
- Nenhuma duplicata visivel

### Detalhes tecnicos

Duas operacoes SQL via ferramenta de dados:

```text
-- 1. Aceitar cruzamento da Janaina
UPDATE codigo_cruzamentos
SET user_b_id = '54c70e85-714a-4ce9-b2e3-e004de0a51f0',
    user_b_consent_at = now(),
    invite_accepted_at = now(),
    status = 'accepted'
WHERE id = 'd32a4e73-b3f0-4725-97ef-0f75348747a2';

-- 2. Deletar duplicata do Luiz
DELETE FROM codigo_cruzamentos
WHERE id = 'd477e707-28ad-4844-89df-737c8a26ce3a';
```

Nenhuma alteracao de codigo necessaria - apenas correcao de dados.
