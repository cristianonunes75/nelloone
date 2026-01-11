// Re-export from the new file for backwards compatibility
// This file now delegates to the new Estilos de Conexão Afetiva system
import { calculateEstilosConexaoAfetiva, EstilosConexaoAfetiva } from './estilosConexaoAfetiva';

export interface LinguagensAmorResult {
  primary: {
    language: string;
    score: number;
    name: string;
    symbol: string;
    essence: string;
    description?: string;
  };
  secondary: {
    language: string;
    score: number;
    name: string;
    symbol: string;
    essence: string;
    description?: string;
  };
  scores: {
    // Support both old and new keys for compatibility
    palavras_afirmacao?: number;
    tempo_qualidade?: number;
    presentes?: number;
    atos_servico?: number;
    toque_fisico?: number;
    presenca_ativa?: number;
    expressao_verbal?: number;
    cuidado_pratico?: number;
    gestos_simbolicos?: number;
    conexao_fisica?: number;
  };
  interpretation: string;
}

// Map new style keys to old style keys for backwards compatibility
const NEW_TO_OLD_STYLE_MAP: Record<string, string> = {
  'expressao_verbal': 'palavras_afirmacao',
  'presenca_ativa': 'tempo_qualidade', 
  'cuidado_pratico': 'atos_servico',
  'gestos_simbolicos': 'presentes',
  'conexao_fisica': 'toque_fisico',
};

export const calculateLinguagensAmor = (answers: any[], language: 'pt' | 'en' | 'pt-pt' = 'pt'): LinguagensAmorResult => {
  // Use the new calculation function
  const estilosResult = calculateEstilosConexaoAfetiva(answers, language);
  
  // Convert to the old format for backwards compatibility
  const oldScores: Record<string, number> = {};
  
  // Map new scores to old keys
  Object.entries(estilosResult.scores).forEach(([key, value]) => {
    const oldKey = NEW_TO_OLD_STYLE_MAP[key] || key;
    oldScores[oldKey] = value;
    // Also include new keys
    oldScores[key] = value;
  });
  
  return {
    primary: {
      language: NEW_TO_OLD_STYLE_MAP[estilosResult.primary.style] || estilosResult.primary.style,
      score: estilosResult.primary.score,
      name: estilosResult.primary.name[language] || estilosResult.primary.name.pt,
      symbol: estilosResult.primary.symbol,
      essence: estilosResult.primary.essence[language] || estilosResult.primary.essence.pt,
    },
    secondary: {
      language: NEW_TO_OLD_STYLE_MAP[estilosResult.secondary.style] || estilosResult.secondary.style,
      score: estilosResult.secondary.score,
      name: estilosResult.secondary.name[language] || estilosResult.secondary.name.pt,
      symbol: estilosResult.secondary.symbol,
      essence: estilosResult.secondary.essence[language] || estilosResult.secondary.essence.pt,
    },
    scores: oldScores as LinguagensAmorResult['scores'],
    interpretation: estilosResult.interpretation[language] || estilosResult.interpretation.pt,
  };
};
