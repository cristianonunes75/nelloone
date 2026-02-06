
# Plano: Internacionalizar a Landing Page Identity

## Problema Identificado

O usuário selecionou **EN (inglês)** no seletor de idioma, mas toda a landing page continua exibindo conteúdo em português brasileiro.

### Screenshot do Bug
Como mostrado: o badge "EN" está selecionado, mas o Hero exibe:
- "A JORNADA IDENTITY EM 7 ETAPAS"
- "O Identity não te define. Ele te liberta."
- "Acessar meu Código da Essência"

### Diagnóstico Técnico

**Causa raiz**: O componente `NelloOneLanding.tsx` e seus subcomponentes têm **todo o texto hardcoded em português**, ignorando completamente o sistema de tradução `t` do `LanguageContext`.

**Arquivos afetados com conteúdo hardcoded:**

| Arquivo | Seções PT-BR Hardcoded |
|---------|------------------------|
| `NelloOneLanding.tsx` | Hero, Dores (pains), Etapas da jornada, Descobertas, "Para quem é/não é", Pricing, CTAs |
| `StrategicFAQ.tsx` | Todas as 8 perguntas e respostas do FAQ |
| `PillarsSection.tsx` | Títulos e descrições dos 7 pilares |
| `ApprovedTestimonialsSection.tsx` | Reações em português (parcialmente traduzido) |

**O que já existe de correto:**
- Arquivo `src/locales/en/landing.json` com 368 linhas de traduções completas para inglês
- `LanguageContext` funcionando e detectando corretamente a mudança de idioma
- `NavSection` parcialmente traduzido (usa `t.landing.nav`)

---

## Solução Proposta

### Fase 1: Refatorar `NelloOneLanding.tsx`

Substituir todos os textos hardcoded pelo objeto de tradução `t.landing`:

```typescript
// ANTES (hardcoded)
const mainPains = [
  "Você sente que repete os mesmos padrões...",
  "Já fez vários testes, mas nenhum...",
];

// DEPOIS (i18n)
const { t, language } = useLanguage();
const mainPains = t.landing.mirror.items;
```

**Mapeamento de seções → traduções:**

| Seção em NelloOneLanding | Chave em landing.json |
|--------------------------|----------------------|
| Hero title | `t.landing.hero.title` |
| Hero subtitle | `t.landing.hero.subtitle` |
| Hero CTA | `t.landing.pricing.cta` |
| Dores (pains) | `t.landing.mirror.items` |
| Etapas (steps) | `t.landing.transformation.steps` |
| Descobertas | `t.landing.improvements.items` |
| Para quem é | `t.landing.not_for_you.items_for` |
| Para quem não é | `t.landing.not_for_you.items_not` |
| Pricing | `t.landing.pricing.*` |

### Fase 2: Refatorar `StrategicFAQ.tsx`

```typescript
// ANTES
const faqItems = [
  { question: "Isso é um teste psicológico?", answer: "Não. O Nello..." },
];

// DEPOIS
const { t } = useLanguage();
const faqItems = t.landing.faq.items;
```

### Fase 3: Refatorar `PillarsSection.tsx`

Adicionar traduções para os 7 pilares em `landing.json` e consumir via `t.landing`.

### Fase 4: Atualizar `ApprovedTestimonialsSection.tsx`

As "reações comuns" hardcoded também precisam ser traduzidas:

```typescript
// ANTES
const FEATURED_REACTIONS = [
  { content: "Isso é muito eu." },
];

// DEPOIS
const reactions = language === 'en' 
  ? [{ content: "This is so me." }, ...]
  : FEATURED_REACTIONS;
```

---

## Novas Traduções Necessárias

Algumas seções da Landing v2 não existem no `landing.json` atual e precisam ser adicionadas:

```json
// Adicionar em src/locales/en/landing.json
{
  "identity_journey": {
    "pains": [
      "You feel like you repeat patterns, even when wanting to change.",
      "You've taken many tests, but none showed you the whole picture.",
      "You want true self-knowledge, without labels or empty promises."
    ],
    "steps": [
      { "number": "01", "title": "Awaken" },
      { "number": "02", "title": "Recognize" },
      { "number": "03", "title": "Deepen" },
      { "number": "04", "title": "Connect" },
      { "number": "05", "title": "Integrate" },
      { "number": "06", "title": "Clarify" },
      { "number": "07", "title": "Live" }
    ],
    "discoveries": [
      { "mainText": "How you react emotionally", "testName": "Enneagram" },
      { "mainText": "How you make decisions and communicate", "testName": "DISC" },
      // ...
    ]
  },
  "faq_strategic": {
    "title": "Frequently Asked Questions",
    "subtitle": "Understand why the Identity Journey is different from any other test",
    "items": [
      {
        "question": "Is this a psychological test or clinical diagnosis?",
        "answer": "No. Nello Identity is a self-knowledge journey based on widely used models in human development..."
      }
      // ... remaining 7 items
    ]
  },
  "pillars": {
    "title": "Understand the 7 Pillars",
    "subtitle": "Deepen your knowledge about each layer of the Identity Journey",
    "items": [
      {
        "title": "The 9 Enneagram Types",
        "description": "Discover which of the 9 personality types you are...",
        "linkText": "Understand the Enneagram"
      }
      // ... remaining 6 items
    ]
  }
}
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/locales/en/landing.json` | Adicionar novas seções: `identity_journey`, `faq_strategic`, `pillars` |
| `src/locales/pt/landing.json` | Adicionar mesmas seções em português (mover hardcoded) |
| `src/locales/pt-pt/landing.json` | Adicionar versão PT-PT das novas seções |
| `src/components/landing/v2/NelloOneLanding.tsx` | Substituir textos hardcoded por `t.landing.*` |
| `src/components/landing/v2/StrategicFAQ.tsx` | Usar `t.landing.faq_strategic.items` |
| `src/components/landing/v2/PillarsSection.tsx` | Usar `t.landing.pillars.items` |
| `src/components/landing/v2/ApprovedTestimonialsSection.tsx` | Traduzir reações hardcoded |

---

## Resultado Esperado

| Idioma Selecionado | Antes | Depois |
|--------------------|-------|--------|
| 🇺🇸 EN | Página em português | Página em inglês |
| 🇧🇷 PT | Página em português | Página em português (inalterado) |
| 🇵🇹 PT-PT | Página em português | Página em português europeu |

---

## Seção Técnica

### Padrão de Implementação

```tsx
// Exemplo de refatoração do Hero
export const NelloOneLanding = () => {
  const { t, language } = useLanguage();
  
  // Mapear traduções estruturadas
  const heroContent = {
    tagline: t.landing.identity_journey?.tagline || "The Identity Journey in 7 steps",
    title: t.landing.hero.title,
    subtitle: t.landing.hero.subtitle,
    cta: t.landing.pricing.cta,
  };
  
  return (
    <section>
      <p>{heroContent.tagline}</p>
      <h1>{heroContent.title}</h1>
      <p>{heroContent.subtitle}</p>
      <Button>{heroContent.cta}</Button>
    </section>
  );
};
```

### Fallback Pattern

Para evitar erros durante a migração, usar fallback:

```tsx
const pains = t.landing.identity_journey?.pains || [
  "You feel like you repeat patterns...",
  // fallback em inglês
];
```

### Estimativa de Esforço

- **Linhas de código**: ~200-300 linhas de modificação
- **Linhas de tradução**: ~150 novas linhas em cada arquivo de locale
- **Risco**: Baixo (não afeta funcionalidade, apenas texto)
