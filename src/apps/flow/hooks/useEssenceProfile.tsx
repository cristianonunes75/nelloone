import { useMemo } from 'react';
import { useCodigoEssencia } from '@/hooks/useCodigoEssencia';

export type DoorType = 'visionary' | 'seeker' | 'executor' | 'unknown';

export interface EssenceProfile {
  doorType: DoorType;
  doorName: string;
  doorIcon: string;
  primaryDISC: string | null;
  primaryTemperament: string | null;
  primaryArchetype: string | null;
  dom: string | null;
  chamado: string | null;
  essencia: string | null;
  hasEssenceData: boolean;
  isLoading: boolean;
  
  // UI customization based on door type
  emptyStateMessage: string;
  mentorGreeting: string;
  mentorTone: string;
  highlightedFeatures: string[];
  suggestionsPrompt: string;
}

// Door mapping based on profiles
const VISIONARY_PROFILES = {
  disc: ['D', 'I', 'DI', 'ID'],
  archetypes: ['mago', 'amante', 'explorador', 'criador', 'heroi'],
  temperaments: ['colerico', 'sanguineo'],
};

const SEEKER_PROFILES = {
  disc: ['S', 'IS', 'SI', 'SC'],
  archetypes: ['inocente', 'cuidador', 'sabio', 'amante'],
  temperaments: ['melancolico', 'fleumatico'],
};

const EXECUTOR_PROFILES = {
  disc: ['C', 'CD', 'DC', 'CS'],
  archetypes: ['governante', 'heroi', 'cara-comum'],
  temperaments: ['fleumatico', 'colerico'],
};

function extractPrimaryDISC(sections: any[]): string | null {
  const discSection = sections?.find(s => 
    s.id === 'disc' || s.title?.toLowerCase().includes('disc')
  );
  
  if (discSection?.content) {
    const content = typeof discSection.content === 'string' 
      ? discSection.content 
      : JSON.stringify(discSection.content);
    
    // Try to extract primary DISC type
    const match = content.match(/tipo\s*(?:prim[aá]rio|dominante)?[:\s]*([DISC]{1,2})/i);
    if (match) return match[1].toUpperCase();
    
    // Check for "Alto D", "Alto I" patterns
    const altoMatch = content.match(/alto\s*([DISC])/i);
    if (altoMatch) return altoMatch[1].toUpperCase();
  }
  return null;
}

function extractPrimaryTemperament(sections: any[]): string | null {
  const tempSection = sections?.find(s => 
    s.id === 'temperament' || 
    s.id === 'temperamento' || 
    s.title?.toLowerCase().includes('temperament')
  );
  
  if (tempSection?.content) {
    const content = typeof tempSection.content === 'string' 
      ? tempSection.content 
      : JSON.stringify(tempSection.content);
    
    const temperaments = ['colerico', 'sanguineo', 'melancolico', 'fleumatico'];
    for (const temp of temperaments) {
      if (content.toLowerCase().includes(temp)) {
        return temp;
      }
    }
  }
  return null;
}

function extractPrimaryArchetype(sections: any[]): string | null {
  const archSection = sections?.find(s => 
    s.id === 'archetype' || 
    s.id === 'arquetipo' || 
    s.title?.toLowerCase().includes('arqu[eé]tipo')
  );
  
  if (archSection?.content) {
    const content = typeof archSection.content === 'string' 
      ? archSection.content 
      : JSON.stringify(archSection.content);
    
    const archetypes = ['mago', 'amante', 'explorador', 'criador', 'heroi', 'inocente', 
                        'cuidador', 'sabio', 'governante', 'cara-comum', 'rebelde', 'bobo'];
    for (const arch of archetypes) {
      if (content.toLowerCase().includes(arch)) {
        return arch;
      }
    }
  }
  return null;
}

function extractEssenceField(sections: any[], fieldNames: string[]): string | null {
  for (const fieldName of fieldNames) {
    const section = sections?.find(s => 
      s.id?.toLowerCase().includes(fieldName) || 
      s.title?.toLowerCase().includes(fieldName)
    );
    
    if (section?.content) {
      const content = typeof section.content === 'string' 
        ? section.content 
        : Array.isArray(section.content) && section.content.length > 0
          ? section.content[0]
          : null;
      
      if (content && typeof content === 'string' && content.length > 10) {
        return content.slice(0, 200);
      }
    }
  }
  return null;
}

function determineDoorType(
  disc: string | null, 
  temperament: string | null, 
  archetype: string | null
): DoorType {
  let visionaryScore = 0;
  let seekerScore = 0;
  let executorScore = 0;
  
  // Score based on DISC
  if (disc) {
    if (VISIONARY_PROFILES.disc.some(d => disc.includes(d))) visionaryScore += 3;
    if (SEEKER_PROFILES.disc.some(d => disc.includes(d))) seekerScore += 3;
    if (EXECUTOR_PROFILES.disc.some(d => disc.includes(d))) executorScore += 3;
  }
  
  // Score based on temperament
  if (temperament) {
    if (VISIONARY_PROFILES.temperaments.includes(temperament)) visionaryScore += 2;
    if (SEEKER_PROFILES.temperaments.includes(temperament)) seekerScore += 2;
    if (EXECUTOR_PROFILES.temperaments.includes(temperament)) executorScore += 2;
  }
  
  // Score based on archetype
  if (archetype) {
    if (VISIONARY_PROFILES.archetypes.includes(archetype)) visionaryScore += 2;
    if (SEEKER_PROFILES.archetypes.includes(archetype)) seekerScore += 2;
    if (EXECUTOR_PROFILES.archetypes.includes(archetype)) executorScore += 2;
  }
  
  const maxScore = Math.max(visionaryScore, seekerScore, executorScore);
  
  if (maxScore === 0) return 'unknown';
  if (visionaryScore === maxScore) return 'visionary';
  if (seekerScore === maxScore) return 'seeker';
  return 'executor';
}

const DOOR_CONFIG = {
  visionary: {
    name: 'Visionário',
    icon: '⚡',
    emptyStateMessage: 'Muitas ideias? Vamos escolher a que vai mudar seu jogo hoje.',
    mentorGreeting: 'Oi! Vamos direto ao ponto. Qual a ÚNICA coisa que importa agora?',
    mentorTone: 'Desafiador e direto',
    highlightedFeatures: ['Captura Rápida', 'Filtro de Prioridades'],
    suggestionsPrompt: 'Você tem o dom de ver possibilidades. Qual destas ressoa mais?',
  },
  seeker: {
    name: 'Buscador',
    icon: '🌱',
    emptyStateMessage: 'Sentindo-se sem direção? Vamos ouvir o que sua essência tem a dizer.',
    mentorGreeting: 'Olá! Vamos descobrir seu primeiro passo juntos? Não precisa ter pressa.',
    mentorTone: 'Acolhedor e socrático',
    highlightedFeatures: ['Sugestões Baseadas na Essência', 'Primeiro Passo Guiado'],
    suggestionsPrompt: 'Baseado no que você realmente é, talvez um destes projetos faça sentido:',
  },
  executor: {
    name: 'Executor',
    icon: '🎯',
    emptyStateMessage: 'Pronto para colocar ordem no caos? Defina seu alvo.',
    mentorGreeting: 'Bom te ver. Como podemos tornar seu processo mais eficiente hoje?',
    mentorTone: 'Pragmático e focado em método',
    highlightedFeatures: ['Otimização de Rotina', 'Planos Estruturados'],
    suggestionsPrompt: 'Aqui estão opções estruturadas baseadas no seu perfil:',
  },
  unknown: {
    name: 'Explorador',
    icon: '✨',
    emptyStateMessage: 'Vamos descobrir juntos o que faz sentido para você.',
    mentorGreeting: 'Olá! Estou aqui para te ajudar. Como posso ser útil hoje?',
    mentorTone: 'Adaptável e curioso',
    highlightedFeatures: ['Descoberta Guiada', 'Conversas Exploratórias'],
    suggestionsPrompt: 'Vamos explorar algumas possibilidades juntos:',
  },
};

export function useEssenceProfile(): EssenceProfile {
  const { savedCodigo, isLoading } = useCodigoEssencia();
  
  return useMemo(() => {
    const sections = savedCodigo?.sections || [];
    
    const primaryDISC = extractPrimaryDISC(sections);
    const primaryTemperament = extractPrimaryTemperament(sections);
    const primaryArchetype = extractPrimaryArchetype(sections);
    
    const dom = extractEssenceField(sections, ['dom', 'talento', 'gift']);
    const chamado = extractEssenceField(sections, ['chamado', 'calling', 'missao', 'mission']);
    const essencia = extractEssenceField(sections, ['essencia', 'essence', 'sintese', 'synthesis']);
    
    const doorType = determineDoorType(primaryDISC, primaryTemperament, primaryArchetype);
    const config = DOOR_CONFIG[doorType];
    
    const hasEssenceData = !!(primaryDISC || primaryTemperament || primaryArchetype || dom || chamado);
    
    return {
      doorType,
      doorName: config.name,
      doorIcon: config.icon,
      primaryDISC,
      primaryTemperament,
      primaryArchetype,
      dom,
      chamado,
      essencia,
      hasEssenceData,
      isLoading,
      emptyStateMessage: config.emptyStateMessage,
      mentorGreeting: config.mentorGreeting,
      mentorTone: config.mentorTone,
      highlightedFeatures: config.highlightedFeatures,
      suggestionsPrompt: config.suggestionsPrompt,
    };
  }, [savedCodigo, isLoading]);
}
