/**
 * Compliance Linguístico Nello
 * Sistema de auditoria contínua para blindagem institucional
 */

export type RiskLevel = 'critical' | 'moderate' | 'safe';

export interface ProhibitedTerm {
  term: string;
  riskLevel: RiskLevel;
  suggestedFix: string;
  context?: string; // Optional context for when the term is problematic
}

// 🔴 TERMOS PROIBIDOS - RISCO CRÍTICO
export const CRITICAL_TERMS: ProhibitedTerm[] = [
  { term: 'diagnóstico', riskLevel: 'critical', suggestedFix: 'reflexão' },
  { term: 'diagnostico', riskLevel: 'critical', suggestedFix: 'reflexão' },
  { term: 'diagnosis', riskLevel: 'critical', suggestedFix: 'reflection' },
  { term: 'laudo', riskLevel: 'critical', suggestedFix: 'mapa' },
  { term: 'avaliação psicológica', riskLevel: 'critical', suggestedFix: 'jornada de autoconhecimento' },
  { term: 'psychological evaluation', riskLevel: 'critical', suggestedFix: 'self-knowledge journey' },
  { term: 'psicométrico', riskLevel: 'critical', suggestedFix: 'instrumento de reflexão' },
  { term: 'psychometric', riskLevel: 'critical', suggestedFix: 'reflection instrument' },
  { term: 'validado cientificamente', riskLevel: 'critical', suggestedFix: 'baseado em modelos de desenvolvimento humano' },
  { term: 'scientifically validated', riskLevel: 'critical', suggestedFix: 'based on human development models' },
  { term: 'cura', riskLevel: 'critical', suggestedFix: 'desenvolvimento' },
  { term: 'cure', riskLevel: 'critical', suggestedFix: 'development' },
  { term: 'tratamento', riskLevel: 'critical', suggestedFix: 'jornada de crescimento', context: 'quando usado em contexto clínico' },
  { term: 'treatment', riskLevel: 'critical', suggestedFix: 'growth journey', context: 'when used in clinical context' },
  { term: 'transtorno', riskLevel: 'critical', suggestedFix: 'padrão comportamental' },
  { term: 'disorder', riskLevel: 'critical', suggestedFix: 'behavioral pattern' },
  { term: 'você tem TDAH', riskLevel: 'critical', suggestedFix: 'você pode apresentar tendências de atenção diversificada' },
  { term: 'you have ADHD', riskLevel: 'critical', suggestedFix: 'you may show diversified attention tendencies' },
  { term: 'você tem depressão', riskLevel: 'critical', suggestedFix: 'você pode estar vivenciando um momento difícil' },
  { term: 'you have depression', riskLevel: 'critical', suggestedFix: 'you may be going through a difficult time' },
  { term: 'você tem ansiedade', riskLevel: 'critical', suggestedFix: 'você pode perceber uma tendência à preocupação' },
  { term: 'you have anxiety', riskLevel: 'critical', suggestedFix: 'you may notice a tendency toward worry' },
  { term: 'isso prova que você', riskLevel: 'critical', suggestedFix: 'isso sugere tendências de' },
  { term: 'this proves that you', riskLevel: 'critical', suggestedFix: 'this suggests tendencies of' },
  { term: 'perfil definitivo', riskLevel: 'critical', suggestedFix: 'tendências predominantes' },
  { term: 'definitive profile', riskLevel: 'critical', suggestedFix: 'predominant tendencies' },
  { term: 'personalidade real', riskLevel: 'critical', suggestedFix: 'padrões observados' },
  { term: 'real personality', riskLevel: 'critical', suggestedFix: 'observed patterns' },
  { term: 'substitui terapia', riskLevel: 'critical', suggestedFix: 'complementa o autoconhecimento' },
  { term: 'replaces therapy', riskLevel: 'critical', suggestedFix: 'complements self-knowledge' },
  { term: 'substitui psicólogo', riskLevel: 'critical', suggestedFix: 'apoia sua jornada pessoal' },
  { term: 'replaces psychologist', riskLevel: 'critical', suggestedFix: 'supports your personal journey' },
];

// 🟡 TERMOS DE RISCO MODERADO
export const MODERATE_TERMS: ProhibitedTerm[] = [
  { term: 'teste psicológico', riskLevel: 'moderate', suggestedFix: 'mapa de autoconhecimento' },
  { term: 'psychological test', riskLevel: 'moderate', suggestedFix: 'self-knowledge map' },
  { term: 'identifica seu tipo', riskLevel: 'moderate', suggestedFix: 'explora suas tendências' },
  { term: 'identifies your type', riskLevel: 'moderate', suggestedFix: 'explores your tendencies' },
  { term: 'melhora garantida', riskLevel: 'moderate', suggestedFix: 'apoio ao desenvolvimento' },
  { term: 'guaranteed improvement', riskLevel: 'moderate', suggestedFix: 'development support' },
  { term: 'revela sua personalidade', riskLevel: 'moderate', suggestedFix: 'apoia reflexões sobre padrões' },
  { term: 'reveals your personality', riskLevel: 'moderate', suggestedFix: 'supports reflections on patterns' },
  { term: 'certeza clínica', riskLevel: 'moderate', suggestedFix: 'tendência observada' },
  { term: 'clinical certainty', riskLevel: 'moderate', suggestedFix: 'observed tendency' },
  { term: 'resultado definitivo', riskLevel: 'moderate', suggestedFix: 'reflexão estruturada' },
  { term: 'definitive result', riskLevel: 'moderate', suggestedFix: 'structured reflection' },
  { term: 'você é assim', riskLevel: 'moderate', suggestedFix: 'você tende a' },
  { term: 'you are like this', riskLevel: 'moderate', suggestedFix: 'you tend to' },
];

// Todos os termos combinados para verificação
export const ALL_PROHIBITED_TERMS: ProhibitedTerm[] = [
  ...CRITICAL_TERMS,
  ...MODERATE_TERMS,
];

// Termos sensíveis que requerem escalonamento para profissional
export const ESCALATION_TERMS = [
  'depressão',
  'depression',
  'suicídio',
  'suicide',
  'suicida',
  'suicidal',
  'pensamentos suicidas',
  'suicidal thoughts',
  'ansiedade severa',
  'severe anxiety',
  'trauma',
  'pânico',
  'panic',
  'automutilação',
  'self-harm',
  'sofrimento intenso',
  'intense suffering',
];

export const ESCALATION_RESPONSE = {
  pt: '"Percebo que você está passando por um momento difícil. O Nello pode apoiar seu autoconhecimento, mas não substitui cuidado especializado. Recomendo que você procure um profissional habilitado — um psicólogo ou psiquiatra pode te ajudar de forma mais adequada. Você não precisa passar por isso sozinho(a)."',
  en: '"I notice you are going through a difficult time. Nello can support your self-knowledge, but it does not replace specialized care. I recommend that you seek a qualified professional — a psychologist or psychiatrist can help you more appropriately. You don\'t have to go through this alone."',
};
