

## Problema Identificado

A Janaína reportou dois problemas na seção "Meus Cruzamentos":

### 1. Nome truncado no celular
O nome do parceiro aparece como "lfn" (cortado) porque o layout horizontal forca o nome e o status ("Aguardando consentimento") na mesma linha. No celular, o texto do status ocupa todo o espaco e o nome fica com apenas 3 caracteres visiveis.

### 2. Nomes "trocados"
Janaina convidou Luiz (lfmegda@gmail.com) e Luiz convidou Janaina (janainamegda@gmail.com) separadamente. Ambos veem dois cruzamentos - um como remetente e outro como convidado. Isso gera confusao.

---

## Plano de Correcao

### Correcao 1: Layout responsivo no card de cruzamento

**Arquivo:** `src/components/codigo-essencia/CruzamentoCodigos.tsx`

Alterar o layout do card de cada cruzamento para empilhar verticalmente no mobile:
- Nome do parceiro em uma linha completa (sem competir com o botao/status)
- Status e botoes abaixo do nome
- Remover `truncate` do nome ou garantir que tenha espaco suficiente
- Mostrar o email completo quando o nome nao esta disponivel (user_b_id e null)

### Correcao 2: Deteccao de convites duplicados

**Arquivo:** Edge Function `nello-invite-cruzamento`

Antes de criar um novo cruzamento, verificar se ja existe um convite pendente entre os dois emails (em qualquer direcao). Se existir, vincular automaticamente em vez de criar duplicata.

Verificacao:
- Se o usuario A convida o email B, checar se ja existe um cruzamento onde user_a tem email B e invite_email e o email de A
- Se encontrar, aceitar automaticamente o cruzamento existente em vez de criar um novo

### Correcao 3: Nome de exibicao melhorado

Quando `user_b_id` e null e so temos o email, mostrar apenas o primeiro nome extraido do email (antes do @) de forma mais legivel, ou mostrar "Convite enviado para [email]" em formato mais claro.

---

## Detalhes Tecnicos

### Layout do Card (antes vs depois)

**Antes:** Uma unica linha horizontal com nome + icone de status + texto de status + botao
**Depois:** Duas linhas - nome completo na primeira, status e acao na segunda

```text
+----------------------------------+
| [icon]  lfmegda@gmail.com       |
|         Aguardando consentimento |
+----------------------------------+
```

### Verificacao de duplicata no invite

```text
Ao convidar email X:
  1. Buscar cruzamento onde user_a.email = X e invite_email = meu_email
  2. Se encontrar com status 'pending' -> aceitar automaticamente
  3. Se nao encontrar -> criar novo convite normalmente
```

### Arquivos a modificar
- `src/components/codigo-essencia/CruzamentoCodigos.tsx` - layout responsivo do card
- `supabase/functions/nello-invite-cruzamento/index.ts` - deteccao de convite reverso

