/**
 * Nello Hiring - Feature Flags
 * 
 * STRATEGIC DECISION (Post-Audit):
 * Only the Hiring module is commercially viable.
 * Praxis, Team Insights, and Reports are disabled until validated.
 */

export const BUSINESS_FEATURE_FLAGS = {
  // ENABLED - Ready for sale
  HIRING_MODULE: true,
  JOBS_MODULE: true,
  TEAM_MANAGEMENT: true, // Basic team management only
  
  // DISABLED - Not ready, hide from UI
  PRAXIS_MODULE: true,
  TEAM_INSIGHTS: true, // Enabled for companies with active subscription
  PEOPLE_ANALYTICS: false,
  
  // BILLING - Enable after validation
  BILLING_ENABLED: true, // Code exists, needs production validation
} as const;

/**
 * Product Identity
 */
export const PRODUCT_IDENTITY = {
  name: 'Nello Business',
  tagline: 'Plataforma de Inteligência Humana para Empresas',
  description: 'Integra recrutamento inteligente, diagnóstico comportamental e desenvolvimento humano em uma única plataforma corporativa.',
  
  // What the product delivers (can be mentioned)
  delivers: [
    // Recrutamento Inteligente
    'Criação de vagas com perfil comportamental ideal',
    'Avaliação DISC + Temperamentos para candidatos',
    'Relatório individual por candidato',
    'Comparação candidato x perfil ideal da função',
    // Inteligência Organizacional
    'Visão comportamental da equipe',
    'Decisões baseadas em dados humanos',
    'Redução estratégica de turnover',
    // Base para Desenvolvimento Contínuo
    'Integração futura com acompanhamento profissional',
    'Evolução comportamental dos colaboradores',
  ],
  
  // What the product does NOT deliver (cannot be mentioned)
  doesNotDeliver: [
    'Integrações ATS',
    'API',
    'People Analytics avançado',
  ],
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof BUSINESS_FEATURE_FLAGS): boolean {
  return BUSINESS_FEATURE_FLAGS[feature] === true;
}
