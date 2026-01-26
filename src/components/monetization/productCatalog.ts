import { ProductInfo } from "./ProductPaywallModal";

// Centralized product catalog for the monetization system
export const PRODUCT_CATALOG: Record<string, ProductInfo> = {
  activation_individual: {
    id: "activation_individual",
    name: "Ativação do Código da Essência",
    nameEn: "Essence Code Activation",
    description: "Transforme autoconhecimento em ação. Um guia personalizado para viver sua essência.",
    descriptionEn: "Transform self-knowledge into action. A personalized guide to live your essence.",
    benefits: [
      "Identificação de sabotadores inconscientes",
      "Libertação de padrões de auto-abandono",
      "Roteiro alinhado com sua essência",
      "Permissões e ressignificações personalizadas",
      "Caminho claro sem culpa ou auto-cobrança",
    ],
    benefitsEn: [
      "Identification of unconscious saboteurs",
      "Release from self-abandonment patterns",
      "Roadmap aligned with your essence",
      "Personalized permissions and reframings",
      "Clear path without guilt or self-demand",
    ],
    priceBRL: 97,
    priceUSD: 27,
    priceEUR: 27,
    priceIdBRL: null, // To be created in Stripe
    priceIdUSD: null,
    priceIdEUR: null,
    productType: "activation_individual",
    badge: "Individual",
  },

  nello_couple: {
    id: "nello_couple",
    name: "Código do Casal",
    nameEn: "Couple's Code",
    description: "O mapa de compatibilidade do seu relacionamento. DISC + Eneagrama cruzados.",
    descriptionEn: "The compatibility map of your relationship. DISC + Enneagram crossed.",
    benefits: [
      "Análise cruzada DISC do casal",
      "Sinergias e pontos de tensão do Eneagrama",
      "Pontos fortes da combinação",
      "Alertas de conflito e soluções",
      "PDF profissional para baixar",
    ],
    benefitsEn: [
      "Couple's DISC cross-analysis",
      "Enneagram synergies and tension points",
      "Combination strengths",
      "Conflict alerts and solutions",
      "Professional PDF to download",
    ],
    priceBRL: 147,
    priceUSD: 47,
    priceEUR: 39,
    priceIdBRL: null,
    priceIdUSD: null,
    priceIdEUR: null,
    productType: "nello_couple",
  },

  activation_couple: {
    id: "activation_couple",
    name: "Ativação do Código do Casal",
    nameEn: "Couple's Code Activation",
    description: "Transformem a conexão em prática. Ações e rituais personalizados para o casal.",
    descriptionEn: "Transform connection into practice. Personalized actions and rituals for the couple.",
    benefits: [
      "Ritual semanal do casal personalizado",
      "Script de conversa para momentos difíceis",
      "Checklist de micro-acordos",
      "Plano de abastecimento emocional",
      "Ativações práticas baseadas nos perfis",
    ],
    benefitsEn: [
      "Personalized weekly couple ritual",
      "Conversation script for difficult moments",
      "Micro-agreements checklist",
      "Emotional supply plan",
      "Practical activations based on profiles",
    ],
    priceBRL: 197,
    priceUSD: 57,
    priceEUR: 47,
    priceIdBRL: null,
    priceIdUSD: null,
    priceIdEUR: null,
    productType: "activation_couple",
    badge: "Casal",
  },

  identity_couple_premium: {
    id: "identity_couple_premium",
    name: "Identity Couple Premium",
    nameEn: "Identity Couple Premium",
    description: "O Mapa Definitivo do Casal. 7 pilares de inteligência cruzada em 15-20 páginas.",
    descriptionEn: "The Definitive Couple's Map. 7 pillars of crossed intelligence in 15-20 pages.",
    benefits: [
      "15-20 páginas de análise profunda",
      "Protocolo de Ritmo (Temperamentos)",
      "Sinergia de Talentos (Inteligências Múltiplas)",
      "Mito do Casal (Arquétipos)",
      "Plano de Abastecimento Emocional",
      "Tomada de Decisão Conjunta (Nello 16)",
      "Seção de Ativações para recorrência",
    ],
    benefitsEn: [
      "15-20 pages of deep analysis",
      "Rhythm Protocol (Temperaments)",
      "Talent Synergy (Multiple Intelligences)",
      "Couple's Myth (Archetypes)",
      "Emotional Supply Plan",
      "Joint Decision Making (Nello 16)",
      "Activations section for recurrence",
    ],
    priceBRL: 997,
    priceUSD: 297,
    priceEUR: 247,
    priceIdBRL: "price_1StyMcDjhZZxZELM5IVwqfhV",
    priceIdUSD: null,
    priceIdEUR: null,
    installments: 12,
    installmentPrice: 99,
    originalPrice: 1497,
    productType: "identity_couple_premium",
    badge: "Premium",
  },
};

// Helper to get product by type
export function getProductInfo(productType: string): ProductInfo | null {
  return PRODUCT_CATALOG[productType] || null;
}

// Helper to check if a product type exists
export function isValidProductType(productType: string): boolean {
  return productType in PRODUCT_CATALOG;
}
