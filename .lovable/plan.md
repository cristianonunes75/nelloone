

## Situacao atual

Existem dois registros no banco:

1. **d32a4e73** (Janaina convidou Luiz) - Status: `generated`, conteudo: SIM - Este e o relatorio pronto do casal
2. **cb1a4fc9** (Luiz convidou Janaina hoje) - Status: `pending`, conteudo: NAO - Duplicata desnecessaria

O relatorio do casal **ja esta gerado e pronto** no cruzamento original. O Luiz Fernando criou um novo convite sem necessidade.

## Acao necessaria

Apenas **deletar o convite duplicado** (`cb1a4fc9`) criado hoje pelo Luiz. Com isso:

- Ambos verao apenas o cruzamento original com status "Relatorio pronto"
- Podem clicar em "Ver Relatorio" normalmente
- Nenhuma confusao com duplicatas

### SQL a executar

```text
DELETE FROM codigo_cruzamentos
WHERE id = 'cb1a4fc9-b697-4e58-845d-42d924175212';
```

Nenhuma alteracao de codigo necessaria - apenas remocao de dado duplicado.

