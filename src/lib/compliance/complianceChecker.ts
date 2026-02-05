/**
 * Compliance Linguístico Nello - Verificador Automático
 */

import { 
  ALL_PROHIBITED_TERMS, 
  ESCALATION_TERMS, 
  ESCALATION_RESPONSE,
  type ProhibitedTerm, 
  type RiskLevel 
} from './prohibitedTerms';

export interface ComplianceResult {
  isCompliant: boolean;
  overallRisk: RiskLevel;
  violations: ComplianceViolation[];
  requiresEscalation: boolean;
  escalationResponse?: string;
}

export interface ComplianceViolation {
  term: string;
  riskLevel: RiskLevel;
  suggestedFix: string;
  position: number;
  context: string;
}

/**
 * Verifica texto contra termos proibidos
 */
export function checkCompliance(
  text: string, 
  language: 'pt' | 'en' = 'pt'
): ComplianceResult {
  const lowerText = text.toLowerCase();
  const violations: ComplianceViolation[] = [];
  let requiresEscalation = false;

  // Verificar termos de escalonamento primeiro
  for (const escalationTerm of ESCALATION_TERMS) {
    if (lowerText.includes(escalationTerm.toLowerCase())) {
      requiresEscalation = true;
      break;
    }
  }

  // Verificar termos proibidos
  for (const prohibitedTerm of ALL_PROHIBITED_TERMS) {
    const termLower = prohibitedTerm.term.toLowerCase();
    const position = lowerText.indexOf(termLower);
    
    if (position !== -1) {
      // Extrair contexto (50 chars antes e depois)
      const contextStart = Math.max(0, position - 50);
      const contextEnd = Math.min(text.length, position + prohibitedTerm.term.length + 50);
      const context = text.substring(contextStart, contextEnd);

      violations.push({
        term: prohibitedTerm.term,
        riskLevel: prohibitedTerm.riskLevel,
        suggestedFix: prohibitedTerm.suggestedFix,
        position,
        context: `...${context}...`,
      });
    }
  }

  // Determinar nível de risco geral
  let overallRisk: RiskLevel = 'safe';
  if (violations.some(v => v.riskLevel === 'critical')) {
    overallRisk = 'critical';
  } else if (violations.some(v => v.riskLevel === 'moderate')) {
    overallRisk = 'moderate';
  }

  return {
    isCompliant: violations.length === 0,
    overallRisk,
    violations,
    requiresEscalation,
    escalationResponse: requiresEscalation ? ESCALATION_RESPONSE[language] : undefined,
  };
}

/**
 * Aplica correções automáticas ao texto
 */
export function autoCorrectText(text: string): string {
  let correctedText = text;

  for (const prohibitedTerm of ALL_PROHIBITED_TERMS) {
    // Criar regex case-insensitive para substituição
    const regex = new RegExp(escapeRegExp(prohibitedTerm.term), 'gi');
    correctedText = correctedText.replace(regex, prohibitedTerm.suggestedFix);
  }

  return correctedText;
}

/**
 * Escapa caracteres especiais para regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gera relatório de compliance formatado
 */
export function generateComplianceReport(result: ComplianceResult): string {
  if (result.isCompliant) {
    return '✅ Texto em conformidade com as diretrizes de blindagem institucional.';
  }

  const lines = [
    '⚠️ ALERTA DE COMPLIANCE LINGUÍSTICO',
    '',
    `Nível de risco: ${getRiskEmoji(result.overallRisk)} ${result.overallRisk.toUpperCase()}`,
    '',
    'Violações encontradas:',
    '',
  ];

  for (const violation of result.violations) {
    lines.push(`${getRiskEmoji(violation.riskLevel)} "${violation.term}"`);
    lines.push(`   → Substituir por: "${violation.suggestedFix}"`);
    lines.push(`   → Contexto: ${violation.context}`);
    lines.push('');
  }

  if (result.requiresEscalation) {
    lines.push('');
    lines.push('🚨 ESCALONAMENTO NECESSÁRIO: Termos sensíveis detectados.');
    lines.push('Resposta de cuidado será adicionada automaticamente.');
  }

  return lines.join('\n');
}

function getRiskEmoji(risk: RiskLevel): string {
  switch (risk) {
    case 'critical': return '🔴';
    case 'moderate': return '🟡';
    case 'safe': return '🟢';
  }
}

/**
 * Verifica se disclaimers obrigatórios estão presentes
 */
export function checkDisclaimers(pageContent: string): {
  hasDisclaimer: boolean;
  missingElements: string[];
} {
  const requiredPhrases = [
    'não substitui',
    'autoconhecimento',
    'profissional habilitado',
    'desenvolvimento pessoal',
  ];

  const missingElements: string[] = [];
  const lowerContent = pageContent.toLowerCase();

  for (const phrase of requiredPhrases) {
    if (!lowerContent.includes(phrase)) {
      missingElements.push(phrase);
    }
  }

  return {
    hasDisclaimer: missingElements.length === 0,
    missingElements,
  };
}
