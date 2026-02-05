/**
 * Testimonial-specific compliance checker for institutional shielding
 * Blocks clinical/diagnostic language in user testimonials
 */

export const TESTIMONIAL_PROHIBITED_TERMS = [
  // Clinical conditions
  'cura', 'curou', 'curado', 'cure', 'cured',
  'tratamento', 'tratar', 'treatment', 'treat',
  'depressão', 'deprimido', 'depression', 'depressed',
  'ansiedade', 'ansioso', 'anxiety', 'anxious',
  'transtorno', 'disorder',
  'síndrome', 'syndrome',
  'tdah', 'adhd',
  'bipolaridade', 'bipolar',
  'borderline',
  'trauma', 'tept', 'ptsd',
  'diagnóstico', 'diagnosis',
  'laudo', 'clinical report',
  
  // Therapy replacement phrases
  'não preciso mais de terapia',
  'don\'t need therapy anymore',
  'substituiu minha terapia',
  'replaced my therapy',
  
  // Absolute/miraculous claims
  'me salvou', 'saved me',
  'mudou minha vida para sempre', 'changed my life forever',
  'garantiu', 'guaranteed',
  'resolveu tudo', 'solved everything',
  'agora eu sei exatamente quem eu sou',
  'now i know exactly who i am',
];

export const TESTIMONIAL_MODERATE_TERMS = [
  'terapia', 'therapy', // context-dependent
  'psicólogo', 'psychologist',
  'psiquiatra', 'psychiatrist',
  'medicação', 'medication',
  'remédio', 'medicine',
];

export interface TestimonialComplianceResult {
  isCompliant: boolean;
  riskLevel: 'safe' | 'moderate' | 'critical';
  detectedTerms: string[];
  suggestedRewrite?: string;
}

export function checkTestimonialCompliance(text: string): TestimonialComplianceResult {
  const lowerText = text.toLowerCase();
  const criticalTerms: string[] = [];
  const moderateTerms: string[] = [];

  // Check critical terms
  for (const term of TESTIMONIAL_PROHIBITED_TERMS) {
    if (lowerText.includes(term.toLowerCase())) {
      criticalTerms.push(term);
    }
  }

  // Check moderate terms
  for (const term of TESTIMONIAL_MODERATE_TERMS) {
    if (lowerText.includes(term.toLowerCase())) {
      moderateTerms.push(term);
    }
  }

  if (criticalTerms.length > 0) {
    return {
      isCompliant: false,
      riskLevel: 'critical',
      detectedTerms: criticalTerms,
      suggestedRewrite: generateSafeRewrite(text, criticalTerms),
    };
  }

  if (moderateTerms.length > 0) {
    return {
      isCompliant: true, // Allow but flag
      riskLevel: 'moderate',
      detectedTerms: moderateTerms,
    };
  }

  return {
    isCompliant: true,
    riskLevel: 'safe',
    detectedTerms: [],
  };
}

function generateSafeRewrite(text: string, detectedTerms: string[]): string {
  let rewritten = text;

  const replacements: Record<string, string> = {
    // Portuguese
    'cura': 'clareza',
    'curou': 'trouxe clareza',
    'curado': 'mais organizado',
    'tratamento': 'processo de autoconhecimento',
    'ansiedade': 'inquietação',
    'depressão': 'momento difícil',
    'diagnóstico': 'reflexão',
    'me salvou': 'me apoiou',
    'mudou minha vida para sempre': 'trouxe novas perspectivas',
    'resolveu tudo': 'ajudou a organizar minhas ideias',
    'não preciso mais de terapia': 'foi um apoio importante no meu processo',
    
    // English
    'cure': 'clarity',
    'cured': 'brought clarity',
    'treatment': 'self-knowledge journey',
    'anxiety': 'restlessness',
    'depression': 'difficult moment',
    'diagnosis': 'reflection',
    'saved me': 'supported me',
    'changed my life forever': 'brought new perspectives',
    'solved everything': 'helped organize my thoughts',
  };

  for (const term of detectedTerms) {
    const replacement = replacements[term.toLowerCase()];
    if (replacement) {
      const regex = new RegExp(term, 'gi');
      rewritten = rewritten.replace(regex, replacement);
    }
  }

  return rewritten;
}

export const TESTIMONIAL_DISCLAIMER = {
  pt: "Depoimentos refletem experiências pessoais. O Nello Identity é uma ferramenta de autoconhecimento e não substitui acompanhamento profissional.",
  en: "Testimonials reflect personal experiences. Nello Identity is a self-knowledge tool and does not replace professional guidance."
};

export const TESTIMONIAL_FORM_GUIDANCE = {
  pt: "Evite mencionar diagnósticos, condições clínicas ou promessas de cura. Conte sua experiência em termos de clareza, organização e autoconhecimento.",
  en: "Avoid mentioning diagnoses, clinical conditions, or promises of cure. Share your experience in terms of clarity, organization, and self-knowledge."
};

export const TESTIMONIAL_CONSENT_TEXT = {
  pt: "Confirmo que meu depoimento não descreve diagnóstico, cura, tratamento ou substituição de terapia.",
  en: "I confirm that my testimonial does not describe diagnosis, cure, treatment, or therapy replacement."
};
