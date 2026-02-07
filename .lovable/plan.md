
# Plano: Checkout de Confiança Premium (Apple Style)

## Objetivo

Transformar a experiência de pagamento do Nello One em um checkout premium com sensação de confiança máxima, eliminando dúvidas sobre preenchimento automático de cartões pelo iPhone/navegador.

---

## Componentes a Criar

### 1. `CheckoutTrustBlock.tsx` (Novo Componente Reutilizável)

Bloco minimalista que aparece abaixo do botão de pagamento com:

**Estrutura Visual:**
```text
┌─────────────────────────────────────────────────┐
│  🔒  Pagamento 100% seguro via Stripe           │
│                                                 │
│  O Nello One nunca armazena ou acessa dados    │
│  do seu cartão. Seu pagamento é processado      │
│  diretamente pela Stripe, com padrão bancário   │
│  internacional.                                 │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  📱 Seu dispositivo pode sugerir               │
│     automaticamente um cartão já salvo.        │
│     [Por que isso acontece?]                    │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Privacidade protegida por padrão PCI DSS.     │
└─────────────────────────────────────────────────┘
```

**Estilo Apple:**
- Fonte pequena e sofisticada (text-xs/text-sm)
- Cinza suave (text-muted-foreground)
- Espaçamento elegante (space-y-3)
- Ícone de cadeado discreto
- Fundo sutil (bg-muted/30)

---

### 2. `AutofillExplainerModal.tsx` (Modal Explicativo)

Modal clean que abre ao clicar em "Por que isso acontece?":

**Conteúdo:**

| Seção | Texto |
|-------|-------|
| Título | Cartão preenchido automaticamente |
| Explicação | Isso é um recurso do iPhone e do navegador, chamado Preenchimento Automático. Ele pode sugerir cartões já salvos no Safari ou no Apple Pay. |
| Reforço | O Nello One **não vê, não salva e não tem acesso** a essas informações. |
| Onde verificar | Ajustes → Safari → Preenchimento Automático → Cartões Salvos / Ajustes → Wallet e Apple Pay |
| Botão | Entendi |

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/checkout/CheckoutTrustBlock.tsx` | **CRIAR** - Componente reutilizável premium |
| `src/components/checkout/AutofillExplainerModal.tsx` | **CRIAR** - Modal explicativo sobre preenchimento automático |
| `src/pages/Checkout.tsx` | Adicionar `<CheckoutTrustBlock />` abaixo do botão de pagamento |
| `src/components/monetization/ProductPaywallModal.tsx` | Adicionar `<CheckoutTrustBlock />` após o botão CTA |

---

## Traduções (i18n)

### Português (PT-BR)
```typescript
const trustTexts = {
  secure: "Pagamento 100% seguro via Stripe",
  noStorage: "O Nello One nunca armazena ou acessa dados do seu cartão. Seu pagamento é processado diretamente pela Stripe, com padrão bancário internacional.",
  autofillHint: "Seu dispositivo pode sugerir automaticamente um cartão já salvo.",
  whyLink: "Por que isso acontece?",
  pciCompliance: "Privacidade protegida por padrão internacional (PCI DSS).",
  
  // Modal
  modalTitle: "Cartão preenchido automaticamente",
  modalExplanation: "Isso é um recurso do iPhone e do navegador, chamado Preenchimento Automático. Ele pode sugerir cartões já salvos no Safari ou no Apple Pay.",
  modalReinforce: "O Nello One não vê, não salva e não tem acesso a essas informações.",
  modalSettings: "Onde verificar no iPhone:",
  modalPath1: "Ajustes → Safari → Preenchimento Automático → Cartões Salvos",
  modalPath2: "Ajustes → Wallet e Apple Pay",
  modalButton: "Entendi",
};
```

### Inglês (EN)
```typescript
const trustTexts = {
  secure: "100% secure payment via Stripe",
  noStorage: "Nello One never stores or accesses your card data. Your payment is processed directly by Stripe, with international banking standards.",
  autofillHint: "Your device may automatically suggest a saved card.",
  whyLink: "Why did this happen?",
  pciCompliance: "Privacy protected by international standard (PCI DSS).",
  
  // Modal
  modalTitle: "Card filled automatically",
  modalExplanation: "This is a feature of your iPhone and browser called Autofill. It can suggest cards already saved in Safari or Apple Pay.",
  modalReinforce: "Nello One does not see, store, or have access to this information.",
  modalSettings: "Where to check on iPhone:",
  modalPath1: "Settings → Safari → AutoFill → Saved Cards",
  modalPath2: "Settings → Wallet & Apple Pay",
  modalButton: "Got it",
};
```

### Português Europeu (PT-PT)
```typescript
const trustTexts = {
  secure: "Pagamento 100% seguro via Stripe",
  noStorage: "O Nello One nunca armazena ou acede aos dados do seu cartão. O seu pagamento é processado diretamente pela Stripe, com padrão bancário internacional.",
  autofillHint: "O seu dispositivo pode sugerir automaticamente um cartão já guardado.",
  whyLink: "Porque é que isto acontece?",
  pciCompliance: "Privacidade protegida por padrão internacional (PCI DSS).",
  
  // Modal
  modalTitle: "Cartão preenchido automaticamente",
  modalExplanation: "Isto é uma funcionalidade do iPhone e do navegador, chamada Preenchimento Automático. Pode sugerir cartões já guardados no Safari ou no Apple Pay.",
  modalReinforce: "O Nello One não vê, não guarda e não tem acesso a estas informações.",
  modalSettings: "Onde verificar no iPhone:",
  modalPath1: "Definições → Safari → Preenchimento Automático → Cartões Guardados",
  modalPath2: "Definições → Wallet e Apple Pay",
  modalButton: "Percebi",
};
```

---

## Implementação Visual

### CheckoutTrustBlock

```tsx
// Estrutura do componente
<div className="mt-6 space-y-4">
  {/* Bloco Principal de Confiança */}
  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
    {/* Linha principal */}
    <div className="flex items-center gap-2">
      <Lock className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{texts.secure}</span>
    </div>
    
    {/* Texto secundário */}
    <p className="text-xs text-muted-foreground leading-relaxed">
      {texts.noStorage}
    </p>
  </div>

  {/* Dica sobre Preenchimento Automático */}
  <div className="flex items-start gap-2 px-1">
    <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5" />
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        {texts.autofillHint}
      </p>
      <button 
        onClick={() => setShowModal(true)}
        className="text-xs text-primary hover:underline"
      >
        {texts.whyLink}
      </button>
    </div>
  </div>

  {/* Rodapé PCI */}
  <p className="text-[10px] text-muted-foreground/60 text-center">
    {texts.pciCompliance}
  </p>
</div>
```

### AutofillExplainerModal

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <DialogTitle>{texts.modalTitle}</DialogTitle>
      </div>
    </DialogHeader>
    
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {texts.modalExplanation}
      </p>
      
      {/* Reforço com destaque */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
        <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
          {texts.modalReinforce}
        </p>
      </div>
      
      {/* Onde verificar */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {texts.modalSettings}
        </p>
        <div className="bg-muted/50 rounded-lg p-3 space-y-1 font-mono text-xs">
          <p>{texts.modalPath1}</p>
          <p>{texts.modalPath2}</p>
        </div>
      </div>
    </div>
    
    <Button onClick={() => onOpenChange(false)} className="w-full">
      {texts.modalButton}
    </Button>
  </DialogContent>
</Dialog>
```

---

## Garantia de Segurança Técnica

| Requisito | Status |
|-----------|--------|
| Nenhum dado de cartão no Supabase | Garantido - Stripe Checkout é externo |
| Stripe como único processador | Garantido - `create-checkout` redireciona |
| PCI DSS compliance | Automático via Stripe |
| Frontend não registra dados sensíveis | Garantido - apenas IDs de sessão |

---

## Resultado Esperado

**Antes:**
- Usuário vê cartão aparecer automaticamente
- Pensa: "Como eles têm meu cartão?"
- Desconfiança e abandono

**Depois:**
- Usuário vê cartão aparecer automaticamente
- Lê: "Seu dispositivo pode sugerir..."
- Clica em "Por que isso acontece?"
- Entende que é recurso do iPhone
- Sente confiança e finaliza compra

---

## Seção Técnica

### Estrutura de Arquivos

```text
src/
└── components/
    └── checkout/
        ├── CheckoutTrustBlock.tsx      # Novo
        ├── AutofillExplainerModal.tsx  # Novo
        └── index.ts                     # Exports
```

### Props do CheckoutTrustBlock

```typescript
interface CheckoutTrustBlockProps {
  variant?: 'default' | 'compact'; // compact para modais
  showAutofillHint?: boolean;      // default true
  className?: string;
}
```

### Uso

```tsx
// Em Checkout.tsx
import { CheckoutTrustBlock } from "@/components/checkout/CheckoutTrustBlock";

// Após o botão de pagamento
<Button>Pagar Agora</Button>
<CheckoutTrustBlock />

// Em ProductPaywallModal.tsx
<Button>Pagar com Stripe</Button>
<CheckoutTrustBlock variant="compact" />
```
