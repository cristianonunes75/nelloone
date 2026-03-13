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
    priceBRL: 197,
    priceUSD: 57,
    priceEUR: 47,
    priceIdBRL: "price_1SxRhHDjhZZxZELMuoj7N1CN",
    priceIdUSD: "price_1SxRhuDjhZZxZELMsAYBZqUP",
    priceIdEUR: "price_1SxRjKDjhZZxZELMAqWHQKbm",
    productType: "activation_individual",
    badge: "Individual",
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
    priceIdBRL: "price_1SvfkCDjhZZxZELMoL8Larml",
    priceIdUSD: "price_1SvfkQDjhZZxZELMQofkLGjG",
    priceIdEUR: "price_1SvfkeDjhZZxZELMCyZ5YLXK",
    productType: "activation_couple",
    badge: "Casal",
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
