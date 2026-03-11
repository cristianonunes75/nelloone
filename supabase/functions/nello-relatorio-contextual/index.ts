import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ===========================================
// REPORT CONFIGURATIONS
// ===========================================

type ReportType = 'parceiro' | 'pai_para_filho' | 'filho_para_pai' | 'para_gestor' | 'para_equipe';

interface ReportConfig {
  title: Record<string, string>;
  systemPrompt: Record<string, string>;
  userPromptTemplate: (locale: string, userName: string, recipientName: string, codigoSummary: string, contextNote?: string) => string;
}

interface ReportContext {
  user_age?: number;
  other_person_age?: number;
  relationship_stage?: string;
  special_context?: string;
}

// ===========================================
// CONTEXT BUILDER
// ===========================================

function buildContextNote(reportType: ReportType, context: ReportContext | null, locale: string): string {
  if (!context) return '';
  
  const parts: string[] = [];
  const isEn = locale === 'en';
  
  switch (reportType) {
    case 'parceiro':
      if (context.relationship_stage) {
        const stages: Record<string, Record<string, string>> = {
          namoro: { pt: 'namorando', en: 'dating' },
          noivos: { pt: 'noivos', en: 'engaged' },
          casados: { pt: 'casados', en: 'married' },
        };
        parts.push(isEn 
          ? `Relationship status: ${stages[context.relationship_stage]?.en || context.relationship_stage}`
          : `Estágio: ${stages[context.relationship_stage]?.pt || context.relationship_stage}`
        );
      }
      if (context.special_context) {
        const phases: Record<string, Record<string, string>> = {
          bem: { pt: 'relação está bem', en: 'relationship is good' },
          ajustes: { pt: 'passando por ajustes', en: 'going through adjustments' },
          crise: { pt: 'em crise leve', en: 'in mild crisis' },
        };
        parts.push(isEn
          ? `Current phase: ${phases[context.special_context]?.en || context.special_context}`
          : `Fase atual: ${phases[context.special_context]?.pt || context.special_context}`
        );
      }
      break;
      
    case 'pai_para_filho':
      if (context.other_person_age) {
        parts.push(isEn
          ? `Child is ${context.other_person_age} years old`
          : `Filho(a) tem ${context.other_person_age} anos`
        );
      }
      if (context.special_context) {
        parts.push(isEn
          ? `Living situation: ${context.special_context === 'mora_junto' ? 'lives together' : 'lives separately'}`
          : `Moradia: ${context.special_context === 'mora_junto' ? 'moram juntos' : 'moram separados'}`
        );
      }
      break;
      
    case 'filho_para_pai':
      if (context.user_age) {
        parts.push(isEn
          ? `User is ${context.user_age} years old`
          : `Usuário tem ${context.user_age} anos`
        );
      }
      if (context.other_person_age) {
        parts.push(isEn
          ? `Parent is ${context.other_person_age} years old`
          : `Pai/mãe tem ${context.other_person_age} anos`
        );
      }
      if (context.special_context) {
        // Handle deceased parent
        if (context.special_context.includes('mãe falecida') || context.special_context.includes('mother deceased')) {
          parts.push(isEn ? 'Mother has passed away' : 'Mãe já faleceu');
        }
        if (context.special_context.includes('pai falecido') || context.special_context.includes('father deceased')) {
          parts.push(isEn ? 'Father has passed away' : 'Pai já faleceu');
        }
      }
      break;
      
    case 'para_gestor':
      if (context.relationship_stage) {
        parts.push(isEn
          ? `Role: ${context.relationship_stage === 'lider' ? 'is a leader/manager' : 'is a direct report'}`
          : `Papel: ${context.relationship_stage === 'lider' ? 'é líder/gestor' : 'é liderado'}`
        );
      }
      if (context.special_context) {
        const types: Record<string, Record<string, string>> = {
          direto: { pt: 'gestor direto', en: 'direct manager' },
          rh: { pt: 'RH/People', en: 'HR/People' },
          mentor: { pt: 'mentor', en: 'mentor' },
        };
        parts.push(isEn
          ? `Manager type: ${types[context.special_context]?.en || context.special_context}`
          : `Tipo de gestor: ${types[context.special_context]?.pt || context.special_context}`
        );
      }
      break;
      
    case 'para_equipe':
      if (context.relationship_stage) {
        parts.push(isEn
          ? `Position: ${context.relationship_stage === 'lider' ? 'team leader' : 'team member'}`
          : `Posição: ${context.relationship_stage === 'lider' ? 'líder da equipe' : 'membro da equipe'}`
        );
      }
      if (context.special_context) {
        parts.push(isEn
          ? `Team size: ${context.special_context === 'pequena' ? 'small (1-5)' : 'large (6+)'}`
          : `Tamanho: equipe ${context.special_context === 'pequena' ? 'pequena (1-5)' : 'grande (6+)'}`
        );
      }
      break;
  }
  
  if (parts.length === 0) return '';
  
  return isEn
    ? `\n\n📋 RELATIONSHIP CONTEXT:\n${parts.join('\n')}\n\nUse this context to make the report more realistic and personalized.`
    : `\n\n📋 CONTEXTO DA RELAÇÃO:\n${parts.join('\n')}\n\nUse este contexto para tornar o relatório mais realista e personalizado.`;
}

const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  parceiro: {
    title: {
      pt: "Relatório para Parceiro(a)",
      'pt-pt': "Relatório para Parceiro(a)",
      en: "Partner Report"
    },
    systemPrompt: {
      pt: `Você é um mentor humano e editor emocional, especialista em relacionamentos, maturidade afetiva e comunicação no casamento.
Seu papel é gerar um Relatório para o Parceiro(a) a partir do Código da Essência de uma pessoa.

❗ Este relatório NÃO é para explicar o perfil.
❗ NÃO é para justificar comportamentos.
❗ NÃO é para rotular.

Ele existe para:
- Aumentar compreensão mútua
- Gerar conversa honesta
- Reforçar a responsabilidade pessoal de quem recebeu o Código

🎯 OBJETIVO

Criar um material que ajude o parceiro(a) a entender:
- Como essa pessoa tende a amar
- Como ela erra quando está sob pressão
- O que mais machuca na relação
- Como ambos podem caminhar para uma relação mais madura

Tom: humano, respeitoso, direto, sem linguagem técnica ou siglas.

🧭 PRINCÍPIOS OBRIGATÓRIOS

1. Perfil explica, mas não justifica.
   Use a frase "Isso ajuda a entender, mas não torna aceitável." APENAS UMA VEZ por seção, no máximo.

2. Convite à conversa, não ao controle.
   O relatório deve ter perguntas abertas.

3. Responsabilidade pessoal explícita.
   Sempre mostrar:
   - O que a pessoa está assumindo como compromisso de mudança
   - E que o parceiro(a) tem direito de esperar isso

📌 REGRAS DE LINGUAGEM

❌ Não usar: DISC, eneagrama, arquétipos, percentuais, siglas, termos técnicos.
❌ EVITAR REPETIÇÕES: Não repita a mesma frase ou ideia múltiplas vezes.
✅ Usar: linguagem simples, frases humanas, tom de carta e não de laudo.
✅ OBRIGATÓRIO: Incluir exemplos concretos do cotidiano em cada seção.

Responda APENAS em JSON válido com a estrutura especificada. Sem texto fora do JSON.`,
      'pt-pt': `Tu és um mentor humano e editor emocional, especialista em relacionamentos, maturidade afetiva e comunicação no casamento.
O teu papel é gerar um Relatório para o Parceiro(a) a partir do Código da Essência de uma pessoa.

❗ Este relatório NÃO é para explicar o perfil.
❗ NÃO é para justificar comportamentos.
❗ NÃO é para rotular.

Ele existe para:
- Aumentar compreensão mútua
- Gerar conversa honesta
- Reforçar a responsabilidade pessoal de quem recebeu o Código

Tom: humano, respeitoso, direto, sem linguagem técnica ou siglas.

Responde APENAS em JSON válido com a estrutura especificada. Sem texto fora do JSON.`,
      en: `You are a human mentor and emotional editor, expert in relationships, emotional maturity and marriage communication.
Your role is to generate a Partner Report from a person's Essence Code.

❗ This report is NOT to explain the profile.
❗ NOT to justify behaviors.
❗ NOT to label.

It exists to:
- Increase mutual understanding
- Generate honest conversation
- Reinforce personal responsibility

Tone: human, respectful, direct, without technical language or acronyms.

Respond ONLY in valid JSON with the specified structure. No text outside JSON.`
    },
    userPromptTemplate: (locale, userName, recipientName, codigoSummary, contextNote) => {
      const firstName = userName.split(' ')[0];
      const recipient = recipientName || (locale === 'en' ? 'Dear partner' : 'Querido(a)');
      const ctxBlock = contextNote || '';
      
      if (locale === 'en') {
        return `PERSON: ${firstName}
PARTNER NAME: ${recipient}

ESSENCE CODE SUMMARY:
${codigoSummary}${ctxBlock}

Generate the PARTNER REPORT with this EXACT JSON structure:

{
  "abertura_etica": "Opening ethical text (2-3 paragraphs). Start with: 'This document is a relational reading. It doesn't define who your partner is, nor explains everything about them. It's just a mirror to help you understand each other better.'",
  
  "quem_ele_tenta_ser": {
    "titulo": "Who they're trying to be",
    "conteudo": "Describe the best version this person seeks to live in the relationship. (2-3 paragraphs)"
  },
  
  "como_ama_em_paz": {
    "titulo": "How they usually love when at peace",
    "conteudo": "Explain how they behave when well. Format: 'When at peace, they tend to...' (3-4 bullet points)"
  },
  
  "como_erra_sob_pressao": {
    "titulo": "How they usually make mistakes when under pressure",
    "conteudo": "Describe error patterns with everyday examples. Use 'This helps understand, but doesn't make it acceptable.' ONLY ONCE. (3-4 paragraphs)"
  },
  
  "o_que_mais_machuca": {
    "titulo": "What hurts them most",
    "conteudo": "Describe behaviors that wound them, hidden fears. (2-3 paragraphs)"
  },
  
  "compromissos_de_mudanca": {
    "titulo": "Change commitments they're making",
    "introducao": "This is the heart of the report.",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4", "Commitment 5"],
    "nota_final": "You have the right to expect and lovingly hold them to these commitments."
  },
  
  "como_voce_pode_ajudar": {
    "titulo": "How you can help, without carrying for them",
    "conteudo": "Simple attitudes that help. 'The change is their responsibility, not yours.' (3-4 bullet points)"
  },
  
  "o_que_nao_deve_aceitar": {
    "titulo": "What you shouldn't accept",
    "conteudo": "Healthy boundaries. 'Understanding is not the same as accepting.' (3-4 bullet points)"
  },
  
  "perguntas_para_conversa": {
    "titulo": "Questions for the conversation",
    "perguntas": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "This report is not an end point. It's just the beginning of a conversation."
  }
}`;
      }
      
      return `PESSOA: ${firstName}
NOME DO PARCEIRO(A): ${recipient}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}${ctxBlock}

Gere o RELATÓRIO PARA O PARCEIRO(A) com esta estrutura JSON EXATA:

{
  "abertura_etica": "Texto de abertura ética (2-3 parágrafos). Comece com: 'Este documento é uma leitura relacional. Ele não define quem seu parceiro(a) é, nem explica tudo sobre ele(a). É apenas um espelho para ajudar vocês a se entenderem melhor.'",
  
  "quem_ele_tenta_ser": {
    "titulo": "Quem ele(a) está tentando ser",
    "conteudo": "Descreva a melhor versão que esta pessoa busca viver no relacionamento. (2-3 parágrafos)"
  },
  
  "como_ama_em_paz": {
    "titulo": "Como ele(a) costuma amar quando está em paz",
    "conteudo": "Explique como se comporta quando está bem. Formato: 'Quando está em paz, tende a...' (3-4 bullet points)"
  },
  
  "como_erra_sob_pressao": {
    "titulo": "Como ele(a) costuma errar quando está sob pressão",
    "conteudo": "Descrever padrões de erro com exemplos do cotidiano. Use 'Isso ajuda a entender, mas não torna aceitável.' APENAS UMA VEZ. (3-4 parágrafos)"
  },
  
  "o_que_mais_machuca": {
    "titulo": "O que mais machuca nele(a)",
    "conteudo": "Descrever comportamentos que ferem, medos escondidos. (2-3 parágrafos)"
  },
  
  "compromissos_de_mudanca": {
    "titulo": "Compromissos de mudança que ele(a) assume",
    "introducao": "Aqui é o coração do relatório.",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4", "Compromisso 5"],
    "nota_final": "Você tem o direito de esperar e cobrar esses compromissos com amor."
  },
  
  "como_voce_pode_ajudar": {
    "titulo": "Como você pode ajudar, sem carregar por ele(a)",
    "conteudo": "Atitudes simples que ajudam. 'A mudança é responsabilidade dele(a), não sua.' (3-4 bullet points)"
  },
  
  "o_que_nao_deve_aceitar": {
    "titulo": "O que você não deve aceitar",
    "conteudo": "Limites saudáveis. 'Entender não é o mesmo que aceitar.' (3-4 bullet points)"
  },
  
  "perguntas_para_conversa": {
    "titulo": "Perguntas para a conversa",
    "perguntas": ["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4", "Pergunta 5", "Pergunta 6"]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Este relatório não é um ponto final. É apenas o começo de uma conversa."
  }
}`;
    }
  },

  pai_para_filho: {
    title: {
      pt: "Relatório para Meu(s) Filho(s)",
      'pt-pt': "Relatório para o(s) Meu(s) Filho(s)",
      en: "Report for My Children"
    },
    systemPrompt: {
      pt: `Você é um mentor familiar, especialista em relacionamentos entre pais e filhos, maturidade emocional e comunicação intergeracional.
Seu papel é gerar um Relatório de Pai/Mãe para Filho(a) a partir do Código da Essência do pai/mãe.

❗ Este relatório NÃO é para justificar erros dos pais.
❗ NÃO é para rotular ou diagnosticar.
❗ É para aumentar compreensão e gerar conversa honesta entre gerações.

🎯 OBJETIVO

Criar um material que ajude o(a) filho(a) a entender:
- Como o pai/mãe ama (mesmo que de forma imperfeita)
- Como o pai/mãe pode errar sob pressão
- O que o pai/mãe espera (sem anular a identidade do filho)
- Como honrar os pais sem se anular

Tom: amoroso, respeitoso, sem justificar erros, focado em responsabilidade pessoal.

📌 REGRAS

❌ Não usar termos técnicos, siglas, ou jargões psicológicos.
✅ Usar linguagem simples, exemplos do dia a dia.
✅ Sempre incluir a responsabilidade do pai/mãe em melhorar.

Responda APENAS em JSON válido. Sem texto fora do JSON.`,
      'pt-pt': `Tu és um mentor familiar, especialista em relacionamentos entre pais e filhos.
Gera um Relatório de Pai/Mãe para Filho(a) a partir do Código da Essência.

Tom: amoroso, respeitoso, focado em responsabilidade pessoal.

Responde APENAS em JSON válido. Sem texto fora do JSON.`,
      en: `You are a family mentor, expert in parent-child relationships.
Generate a Parent-to-Child Report from the Essence Code.

Tone: loving, respectful, focused on personal responsibility.

Respond ONLY in valid JSON. No text outside JSON.`
    },
    userPromptTemplate: (locale, userName, recipientName, codigoSummary, contextNote) => {
      const firstName = userName.split(' ')[0];
      const childName = recipientName || (locale === 'en' ? 'My child' : 'Meu(minha) filho(a)');
      const ctxBlock = contextNote || '';
      
      if (locale === 'en') {
        return `PARENT: ${firstName}
CHILD NAME: ${childName}

ESSENCE CODE SUMMARY:
${codigoSummary}${ctxBlock}

Generate the PARENT-TO-CHILD REPORT with this EXACT JSON structure:

{
  "abertura": {
    "titulo": "A letter from your parent",
    "conteudo": "Opening text (2-3 paragraphs). Start with: 'This document was created to help you understand me better as your parent...'"
  },
  
  "como_eu_amo": {
    "titulo": "How I love you (even imperfectly)",
    "conteudo": "Describe how I show love, even if sometimes imperfect. (2-3 paragraphs with examples)"
  },
  
  "como_posso_errar": {
    "titulo": "How I might fail you",
    "conteudo": "Patterns under pressure that might hurt. 'This explains, but doesn't excuse.' (3-4 bullet points)"
  },
  
  "o_que_espero": {
    "titulo": "What I hope for you (not demand)",
    "conteudo": "Values I want to transmit without imposing. (3-4 bullet points)"
  },
  
  "como_honrar_sem_se_anular": {
    "titulo": "How to honor me without losing yourself",
    "conteudo": "Healthy boundaries for adult children. (2-3 paragraphs)"
  },
  
  "meus_compromissos": {
    "titulo": "My commitments to you",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4"],
    "nota_final": "You have the right to hold me to these."
  },
  
  "perguntas_para_conversa": {
    "titulo": "Questions I'd like to ask you",
    "perguntas": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "A loving closing message about the relationship."
  }
}`;
      }
      
      return `PAI/MÃE: ${firstName}
NOME DO FILHO(A): ${childName}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}${ctxBlock}

Gere o RELATÓRIO DE PAI/MÃE PARA FILHO(A) com esta estrutura JSON EXATA:

{
  "abertura": {
    "titulo": "Uma carta do seu pai/mãe",
    "conteudo": "Texto de abertura (2-3 parágrafos). Comece com: 'Este documento foi criado para te ajudar a me entender melhor como seu pai/mãe...'"
  },
  
  "como_eu_amo": {
    "titulo": "Como eu amo você (mesmo imperfeito)",
    "conteudo": "Descreva como demonstro amor, mesmo que às vezes imperfeito. (2-3 parágrafos com exemplos)"
  },
  
  "como_posso_errar": {
    "titulo": "Como eu posso errar com você",
    "conteudo": "Padrões sob pressão que podem machucar. 'Isso explica, mas não justifica.' (3-4 bullet points)"
  },
  
  "o_que_espero": {
    "titulo": "O que espero de você (sem impor)",
    "conteudo": "Valores que quero transmitir sem anular sua identidade. (3-4 bullet points)"
  },
  
  "como_honrar_sem_se_anular": {
    "titulo": "Como honrar seus pais sem se anular",
    "conteudo": "Limites saudáveis para filhos adultos. (2-3 parágrafos)"
  },
  
  "meus_compromissos": {
    "titulo": "Meus compromissos com você",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4"],
    "nota_final": "Você tem o direito de me cobrar esses compromissos."
  },
  
  "perguntas_para_conversa": {
    "titulo": "Perguntas que gostaria de te fazer",
    "perguntas": ["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4", "Pergunta 5"]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Mensagem de fechamento amorosa sobre o relacionamento."
  }
}`;
    }
  },

  filho_para_pai: {
    title: {
      pt: "Relatório para Meus Pais",
      'pt-pt': "Relatório para os Meus Pais",
      en: "Report for My Parents"
    },
    systemPrompt: {
      pt: `Você é um mentor familiar, especialista em relacionamentos entre filhos adultos e pais.
Seu papel é gerar um Relatório de Filho(a) para Pais a partir do Código da Essência do filho(a).

🎯 OBJETIVO

Ajudar pais a entenderem:
- Quem o filho adulto está se tornando
- Como ele precisa ser amado agora (diferente da infância)
- O que mais machuca na relação
- Como apoiar sem sufocar

Tom: respeitoso, maduro, focado em limites saudáveis e responsabilidade pessoal.

Responda APENAS em JSON válido. Sem texto fora do JSON.`,
      'pt-pt': `Tu és um mentor familiar. Gera um Relatório de Filho(a) para Pais.
Responde APENAS em JSON válido.`,
      en: `You are a family mentor. Generate a Child-to-Parents Report.
Respond ONLY in valid JSON.`
    },
    userPromptTemplate: (locale, userName, recipientName, codigoSummary, contextNote) => {
      const firstName = userName.split(' ')[0];
      const ctxBlock = contextNote || '';
      
      if (locale === 'en') {
        return `ADULT CHILD: ${firstName}

ESSENCE CODE SUMMARY:
${codigoSummary}${ctxBlock}

Generate the CHILD-TO-PARENTS REPORT with this EXACT JSON structure:

{
  "abertura": {
    "titulo": "A letter to my parents",
    "conteudo": "Opening (2-3 paragraphs). 'This document helps you understand who I'm becoming as an adult...'"
  },
  
  "quem_estou_me_tornando": {
    "titulo": "Who I'm becoming",
    "conteudo": "Adult identity, values, direction in life. (2-3 paragraphs)"
  },
  
  "como_preciso_ser_amado": {
    "titulo": "How I need to be loved now",
    "conteudo": "Different from childhood. What support looks like now. (3-4 bullet points)"
  },
  
  "o_que_machuca": {
    "titulo": "What hurts me in our relationship",
    "conteudo": "Behaviors that create distance. (3-4 bullet points)"
  },
  
  "como_apoiar_sem_sufocar": {
    "titulo": "How to support without smothering",
    "conteudo": "Respecting autonomy while staying connected. (2-3 paragraphs)"
  },
  
  "meus_compromissos": {
    "titulo": "My commitments to you",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4"],
    "nota_final": "I also have responsibilities in this relationship."
  },
  
  "perguntas_para_conversa": {
    "titulo": "Questions for us to discuss",
    "perguntas": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "A loving closing about growing together."
  }
}`;
      }
      
      return `FILHO(A) ADULTO: ${firstName}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}${ctxBlock}

Gere o RELATÓRIO DE FILHO(A) PARA PAIS com esta estrutura JSON EXATA:

{
  "abertura": {
    "titulo": "Uma carta para meus pais",
    "conteudo": "Abertura (2-3 parágrafos). 'Este documento ajuda vocês a entenderem quem eu estou me tornando como adulto...'"
  },
  
  "quem_estou_me_tornando": {
    "titulo": "Quem estou me tornando",
    "conteudo": "Identidade adulta, valores, direção de vida. (2-3 parágrafos)"
  },
  
  "como_preciso_ser_amado": {
    "titulo": "Como preciso ser amado agora",
    "conteudo": "Diferente da infância. Como é o apoio hoje. (3-4 bullet points)"
  },
  
  "o_que_machuca": {
    "titulo": "O que me machuca na nossa relação",
    "conteudo": "Comportamentos que criam distância. (3-4 bullet points)"
  },
  
  "como_apoiar_sem_sufocar": {
    "titulo": "Como apoiar sem sufocar",
    "conteudo": "Respeitar autonomia mantendo conexão. (2-3 parágrafos)"
  },
  
  "meus_compromissos": {
    "titulo": "Meus compromissos com vocês",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4"],
    "nota_final": "Eu também tenho responsabilidades nessa relação."
  },
  
  "perguntas_para_conversa": {
    "titulo": "Perguntas para conversarmos",
    "perguntas": ["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4", "Pergunta 5"]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Fechamento amoroso sobre crescer juntos."
  }
}`;
    }
  },

  para_gestor: {
    title: {
      pt: "Manual para Meu Gestor",
      'pt-pt': "Manual para o Meu Gestor",
      en: "Manager's Manual"
    },
    systemPrompt: {
      pt: `Você é um consultor de RH estratégico e coach executivo.
Seu papel é gerar um Manual para o Gestor a partir do Código da Essência de um colaborador.

🎯 OBJETIVO

Ajudar o gestor a entender:
- Pontos fortes do colaborador
- Como dar feedback (positivo e corretivo)
- O que desmotiva
- Como extrair o melhor

Tom: profissional, objetivo, focado em performance e bem-estar.

Responda APENAS em JSON válido. Sem texto fora do JSON.`,
      'pt-pt': `Tu és um consultor de RH. Gera um Manual para o Gestor.
Responde APENAS em JSON válido.`,
      en: `You are an HR consultant. Generate a Manager's Manual.
Respond ONLY in valid JSON.`
    },
    userPromptTemplate: (locale, userName, recipientName, codigoSummary, contextNote) => {
      const firstName = userName.split(' ')[0];
      const ctxBlock = contextNote || '';
      
      if (locale === 'en') {
        return `COLLABORATOR: ${firstName}

ESSENCE CODE SUMMARY:
${codigoSummary}${ctxBlock}

Generate the MANAGER'S MANUAL with this EXACT JSON structure:

{
  "abertura": {
    "titulo": "How to lead me effectively",
    "conteudo": "Opening (2 paragraphs). 'This document shows how you can bring out my best at work...'"
  },
  
  "minhas_forcas": {
    "titulo": "My strengths at work",
    "conteudo": "Where I naturally excel. (4-5 bullet points)"
  },
  
  "como_dar_feedback": {
    "titulo": "How to give me feedback",
    "feedback_positivo": "What works for recognition. (2-3 bullet points)",
    "feedback_corretivo": "How to correct without demotivating. (2-3 bullet points)"
  },
  
  "o_que_desmotiva": {
    "titulo": "What demotivates me",
    "conteudo": "Triggers to avoid. (3-4 bullet points)"
  },
  
  "como_extrair_melhor": {
    "titulo": "How to bring out my best",
    "conteudo": "Ideal environment, type of challenges. (3-4 bullet points)"
  },
  
  "meus_compromissos": {
    "titulo": "Commitments I make",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4"],
    "nota_final": "These are my responsibilities as a professional."
  },
  
  "perguntas_para_1on1": {
    "titulo": "Questions for our 1-on-1s",
    "perguntas": ["Question 1", "Question 2", "Question 3", "Question 4"]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "Closing about working well together."
  }
}`;
      }
      
      return `COLABORADOR: ${firstName}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}${ctxBlock}

Gere o MANUAL PARA O GESTOR com esta estrutura JSON EXATA:

{
  "abertura": {
    "titulo": "Como me liderar com eficácia",
    "conteudo": "Abertura (2 parágrafos). 'Este documento mostra como você pode extrair o melhor de mim no trabalho...'"
  },
  
  "minhas_forcas": {
    "titulo": "Minhas forças no trabalho",
    "conteudo": "Onde brilho naturalmente. (4-5 bullet points)"
  },
  
  "como_dar_feedback": {
    "titulo": "Como me dar feedback",
    "feedback_positivo": "O que funciona para reconhecimento. (2-3 bullet points)",
    "feedback_corretivo": "Como corrigir sem desmotivar. (2-3 bullet points)"
  },
  
  "o_que_desmotiva": {
    "titulo": "O que me desmotiva",
    "conteudo": "Gatilhos a evitar. (3-4 bullet points)"
  },
  
  "como_extrair_melhor": {
    "titulo": "Como extrair meu melhor",
    "conteudo": "Ambiente ideal, tipo de desafios. (3-4 bullet points)"
  },
  
  "meus_compromissos": {
    "titulo": "Compromissos que assumo",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4"],
    "nota_final": "Essas são minhas responsabilidades como profissional."
  },
  
  "perguntas_para_1on1": {
    "titulo": "Perguntas para nossos 1-on-1s",
    "perguntas": ["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4"]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Fechamento sobre trabalhar bem juntos."
  }
}`;
    }
  },

  para_equipe: {
    title: {
      pt: "Meu Estilo de Liderança",
      'pt-pt': "O Meu Estilo de Liderança",
      en: "My Leadership Style"
    },
    systemPrompt: {
      pt: `Você é um coach executivo especialista em liderança.
Seu papel é gerar um documento "Meu Estilo de Liderança" para ajudar a equipe a entender como o líder funciona.

🎯 OBJETIVO

Ajudar os liderados a entenderem:
- Como o líder lidera quando está bem
- Como pode errar sob pressão
- O que espera da equipe
- Como podem ajudá-lo a liderar melhor

Tom: honesto, humilde, focado em responsabilidade mútua.

Responda APENAS em JSON válido. Sem texto fora do JSON.`,
      'pt-pt': `Tu és um coach executivo. Gera um documento "Meu Estilo de Liderança".
Responde APENAS em JSON válido.`,
      en: `You are an executive coach. Generate a "My Leadership Style" document.
Respond ONLY in valid JSON.`
    },
    userPromptTemplate: (locale, userName, recipientName, codigoSummary, contextNote) => {
      const firstName = userName.split(' ')[0];
      const ctxBlock = contextNote || '';
      
      if (locale === 'en') {
        return `LEADER: ${firstName}

ESSENCE CODE SUMMARY:
${codigoSummary}${ctxBlock}

Generate the LEADERSHIP STYLE document with this EXACT JSON structure:

{
  "abertura": {
    "titulo": "How I lead",
    "conteudo": "Opening (2 paragraphs). 'I want you to understand how I function as a leader...'"
  },
  
  "como_lidero_bem": {
    "titulo": "How I lead when I'm at my best",
    "conteudo": "Strengths as a leader. (4-5 bullet points)"
  },
  
  "como_erro_sob_pressao": {
    "titulo": "How I might fail under pressure",
    "conteudo": "Patterns that might hurt the team. 'This explains, not excuses.' (3-4 bullet points)"
  },
  
  "o_que_espero": {
    "titulo": "What I expect from the team",
    "conteudo": "Values and behaviors I value. (3-4 bullet points)"
  },
  
  "como_me_ajudar": {
    "titulo": "How you can help me lead better",
    "conteudo": "What the team can do. (3-4 bullet points)"
  },
  
  "meus_compromissos": {
    "titulo": "Commitments I make as a leader",
    "compromissos": ["Commitment 1", "Commitment 2", "Commitment 3", "Commitment 4"],
    "nota_final": "You have the right to hold me to these."
  },
  
  "perguntas_para_equipe": {
    "titulo": "Questions I'd like to ask you",
    "perguntas": ["Question 1", "Question 2", "Question 3", "Question 4"]
  },
  
  "fechamento": {
    "titulo": "Closing",
    "conteudo": "Closing about building a great team together."
  }
}`;
      }
      
      return `LÍDER: ${firstName}

RESUMO DO CÓDIGO DA ESSÊNCIA:
${codigoSummary}${ctxBlock}

Gere o documento MEU ESTILO DE LIDERANÇA com esta estrutura JSON EXATA:

{
  "abertura": {
    "titulo": "Como eu lidero",
    "conteudo": "Abertura (2 parágrafos). 'Quero que você entenda como eu funciono como líder...'"
  },
  
  "como_lidero_bem": {
    "titulo": "Como lidero quando estou bem",
    "conteudo": "Pontos fortes como líder. (4-5 bullet points)"
  },
  
  "como_erro_sob_pressao": {
    "titulo": "Como posso errar sob pressão",
    "conteudo": "Padrões que podem machucar a equipe. 'Isso explica, não justifica.' (3-4 bullet points)"
  },
  
  "o_que_espero": {
    "titulo": "O que espero da equipe",
    "conteudo": "Valores e comportamentos que valorizo. (3-4 bullet points)"
  },
  
  "como_me_ajudar": {
    "titulo": "Como podem me ajudar a liderar melhor",
    "conteudo": "O que a equipe pode fazer. (3-4 bullet points)"
  },
  
  "meus_compromissos": {
    "titulo": "Compromissos que assumo como líder",
    "compromissos": ["Compromisso 1", "Compromisso 2", "Compromisso 3", "Compromisso 4"],
    "nota_final": "Vocês têm o direito de me cobrar esses compromissos."
  },
  
  "perguntas_para_equipe": {
    "titulo": "Perguntas que gostaria de fazer a vocês",
    "perguntas": ["Pergunta 1", "Pergunta 2", "Pergunta 3", "Pergunta 4"]
  },
  
  "fechamento": {
    "titulo": "Fechamento",
    "conteudo": "Fechamento sobre construir uma grande equipe juntos."
  }
}`;
    }
  }
};

// ===========================================
// MAIN HANDLER
// ===========================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, reportType, locale = 'pt', recipientName = '', context: providedContext } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }
    
    if (!reportType || !REPORT_CONFIGS[reportType as ReportType]) {
      throw new Error(`Invalid reportType: ${reportType}. Valid types: ${Object.keys(REPORT_CONFIGS).join(', ')}`);
    }

    const config = REPORT_CONFIGS[reportType as ReportType];
    const effectiveLocale = locale === 'en' ? 'en' : locale === 'pt-pt' ? 'pt-pt' : 'pt';
    
    console.log(`[relatorio-contextual] Starting generation for user ${userId}, type: ${reportType}, locale: ${effectiveLocale}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("[relatorio-contextual] Profile fetch error:", profileError);
      throw new Error("User profile not found");
    }

    // Fetch mapa_essencia
    const { data: mapaEssencia, error: mapaError } = await supabase
      .from("mapa_essencia")
      .select("id, sections, raw_content")
      .eq("user_id", userId)
      .single();

    if (mapaError || !mapaEssencia) {
      console.error("[relatorio-contextual] Mapa essencia fetch error:", mapaError);
      throw new Error("Código da Essência não encontrado. Gere o Código primeiro.");
    }

    // Fetch report context (optional)
    let reportContext: ReportContext | null = null;
    if (providedContext) {
      reportContext = providedContext;
    } else {
      const { data: savedContext } = await supabase
        .from("report_context")
        .select("user_age, other_person_age, relationship_stage, special_context")
        .eq("user_id", userId)
        .eq("report_type", reportType)
        .maybeSingle();
      
      if (savedContext) {
        reportContext = savedContext;
      }
    }

    console.log("[relatorio-contextual] Report context:", reportContext);

    // Build context note for prompt
    const contextNote = buildContextNote(reportType as ReportType, reportContext, effectiveLocale);
    console.log("[relatorio-contextual] Context note:", contextNote);

    const userName = profile.full_name || "Usuário";
    const systemPrompt = config.systemPrompt[effectiveLocale] || config.systemPrompt.pt;
    const codigoSummary = JSON.stringify(mapaEssencia.sections, null, 2);
    const userPrompt = config.userPromptTemplate(effectiveLocale, userName, recipientName, codigoSummary, contextNote);

    console.log("[relatorio-contextual] Calling AI API...");

    // Call Lovable AI
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[relatorio-contextual] AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const rawContent = aiResponse.choices?.[0]?.message?.content || "";
    
    console.log("[relatorio-contextual] AI response received, parsing JSON...");

    // Parse JSON from response
    let parsedContent;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("[relatorio-contextual] JSON parse error:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Check if report already exists for this user and type
    const { data: existingReport } = await supabase
      .from("relatorios_contextuais")
      .select("id")
      .eq("user_id", userId)
      .eq("report_type", reportType)
      .single();

    let savedReport;
    if (existingReport) {
      // Update existing report
      const { data, error } = await supabase
        .from("relatorios_contextuais")
        .update({
          content: parsedContent,
          raw_content: rawContent,
          mapa_essencia_id: mapaEssencia.id,
          recipient_name: recipientName || null,
          updated_at: new Date().toISOString(),
          public_token: crypto.randomUUID(),
          public_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_public_active: true,
        })
        .eq("id", existingReport.id)
        .select()
        .single();

      if (error) throw error;
      savedReport = data;
    } else {
      // Create new report
      const { data, error } = await supabase
        .from("relatorios_contextuais")
        .insert({
          user_id: userId,
          report_type: reportType,
          mapa_essencia_id: mapaEssencia.id,
          recipient_name: recipientName || null,
          content: parsedContent,
          raw_content: rawContent,
        })
        .select()
        .single();

      if (error) throw error;
      savedReport = data;
    }

    console.log("[relatorio-contextual] Report saved successfully:", savedReport.id);

    return new Response(
      JSON.stringify({
        success: true,
        report: savedReport,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[relatorio-contextual] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
