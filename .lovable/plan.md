

# Depoimentos reais na Landing Page

## Objetivo
Substituir os depoimentos fictícios/hardcoded da landing por depoimentos reais do banco de dados, exibindo nome completo e profissao dos usuarios.

## Como funciona hoje
- A `TestimonialsSection` na landing usa 3 depoimentos hardcoded com nomes inventados (Mariana S., Rafael M., Camila L.)
- Ja existe uma `ApprovedTestimonialsSection` que busca depoimentos aprovados e featured do banco, mas nao e usada na landing
- A tabela `testimonials` tem `display_name` e `user_id` (ligado a `profiles` que tem `full_name` e `profession`)

## Plano de implementacao

### 1. Atualizar TestimonialsSection para buscar do banco
- Adicionar query ao banco buscando depoimentos com `status = 'approved'` e `is_featured = true`, limitando a 3
- Fazer join com `profiles` via `user_id` para obter `full_name` e `profession`
- Usar `full_name` do perfil (nome e sobrenome) em vez do `display_name` do depoimento
- Usar `profession` do perfil como subtitulo (ex: "Arquiteta", "Empresario")
- Manter compliance check (filtrar depoimentos com risco critico)
- Manter fallback para os depoimentos hardcoded caso nao existam depoimentos aprovados no banco

### 2. Estilo visual
- Manter o layout minimalista atual (cards com Quote icon, rating stars)
- Exibir nome completo (ex: "Mariana Santos") em vez de iniciais abreviadas
- Exibir profissao real do perfil
- Manter scroll horizontal no mobile e grid 3 colunas no desktop

### 3. Privacidade e compliance
- Buscar apenas depoimentos com `consent_given = true` (ja garantido pelo fluxo de aprovacao)
- Aplicar filtro de compliance existente (`checkTestimonialCompliance`)
- Manter disclaimer institucional

## Detalhes tecnicos

**Arquivo editado:** `src/components/landing/v2/TestimonialsSection.tsx`

**Query:**
```sql
SELECT t.id, t.content, t.is_featured, p.full_name, p.profession
FROM testimonials t
JOIN profiles p ON t.user_id = p.id
WHERE t.status = 'approved' 
  AND t.is_featured = true
  AND t.consent_given = true
ORDER BY t.created_at DESC
LIMIT 3
```

**Fallback:** Se a query retornar 0 resultados, exibir os depoimentos hardcoded atuais para que a secao nunca fique vazia.

Nenhuma alteracao de banco, migrations ou RLS necessaria — a tabela testimonials ja tem RLS permitindo leitura publica para depoimentos aprovados.
