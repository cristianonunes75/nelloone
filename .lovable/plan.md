
# Plano: Atualizar Descrições do Código do Casal (7 Pilares)

## Contexto

O sistema de cruzamento do casal já gera relatórios com os **7 pilares completos** do método Identity (DISC, Eneagrama, Temperamentos, Inteligências Múltiplas, Arquétipos, Estilos de Conexão e Nello 16), mas as descrições em vários pontos da aplicação mencionam apenas "DISC + Eneagrama", causando confusão na proposta de valor.

---

## Arquivos a Modificar

### 1. `src/components/monetization/productCatalog.ts`

**Alterações:**
- Atualizar `nello_couple.description` de "DISC + Eneagrama" para mencionar os 7 pilares
- Atualizar `nello_couple.descriptionEn` com a mesma correção em inglês
- Expandir a lista de `benefits` para refletir os 7 pilares do relatório
- Expandir `benefitsEn` com a tradução

**Nova descrição PT:**
> "O Mapa de Sinergia do seu relacionamento. 7 pilares cruzados: DISC, Eneagrama, Temperamentos, Inteligências, Arquétipos, Estilos de Conexão e Personalidade."

**Novos benefícios PT:**
- Dinâmica comportamental do casal (DISC)
- Motivações profundas e pontos de tensão (Eneagrama)  
- Protocolo de Ritmo (Temperamentos)
- Sinergia de Talentos (Inteligências Múltiplas)
- O Mito do Casal (Arquétipos)
- Papéis naturais: Sensor de Direção e Construtor
- Relatório PDF profissional de 15-20 páginas

---

### 2. `src/components/monetization/ProgressiveUpsellSection.tsx`

**Linha ~94-96:** Atualizar a descrição do card `nello_couple` no dashboard

**De:**
```
"Descubra o mapa de sinergia do seu relacionamento. DISC + Eneagrama cruzados."
```

**Para:**
```
"O mapa completo de sinergia do seu relacionamento com 7 pilares cruzados."
```

---

### 3. `src/components/admin/AdminCoupons.tsx`

**Linhas 65 e 78:** Corrigir preços desatualizados nas listas de produtos

**De:**
```
"Cruzamento de casal R$147"
```

**Para:**
```
"Código do Casal R$297"
```

---

## Resumo das Mudanças

| Arquivo | O que muda |
|---------|------------|
| `productCatalog.ts` | Descrição + lista de benefícios expandida (7 pilares) |
| `ProgressiveUpsellSection.tsx` | Texto do card no dashboard |
| `AdminCoupons.tsx` | Correção de preço (R$147 → R$297) |

---

## Resultado Esperado

Após as alterações, toda a comunicação do produto "Código do Casal" (nello_couple) refletirá corretamente que ele inclui os **7 pilares completos** do método Identity, alinhando a proposta de valor ao que o sistema realmente entrega no relatório gerado pela IA.

---

## Detalhes Técnicos

Nenhuma alteração em banco de dados ou Edge Functions é necessária, pois o sistema de geração de relatórios já processa os 7 pilares corretamente. As alterações são puramente de comunicação/UI.
