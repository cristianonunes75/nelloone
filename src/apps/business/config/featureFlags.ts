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
  PRAXIS_MODULE: false,
  TEAM_INSIGHTS: false, // Reports page shows "in development"
  PEOPLE_ANALYTICS: false,
  
  // BILLING - Enable after validation
  BILLING_ENABLED: true, // Code exists, needs production validation
} as const;

/**
 * Product Identity
 */
export const PRODUCT_IDENTITY = {
  name: 'Nello Hiring',
  tagline: 'Avaliação comportamental para contratações mais assertivas',
  description: 'Ferramenta de avaliação comportamental para processos seletivos. Crie vagas, defina perfis ideais e avalie candidatos com DISC e Temperamentos.',
  
  // What the product delivers (can be mentioned)
  delivers: [
    'Criação de vagas com link público',
    'Avaliação DISC + Temperamentos',
    'Relatório individual por candidato',
    'Comparação candidato x perfil ideal',
  ],
  
  // What the product does NOT deliver (cannot be mentioned)
  doesNotDeliver: [
    'Gestão de equipes existentes',
    'Insights de colaboradores',
    'Relatórios consolidados de empresa',
    'Integrações ATS',
    'API',
    'People Analytics',
    'Inteligência artificial',
  ],
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof BUSINESS_FEATURE_FLAGS): boolean {
  return BUSINESS_FEATURE_FLAGS[feature] === true;
}
