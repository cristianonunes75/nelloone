// User Prompt V7 - CÓDIGO DA ESSÊNCIA: Estrutura focada em REVELAÇÃO

export const getUserPromptStructure = (locale: string, resultsJson: string, firstName: string) => {
  const isEuropean = locale === 'pt-pt';
  const isEnglish = locale === 'en';
  
  const youWord = isEuropean ? 'Tu' : isEnglish ? 'You' : 'Você';
  const yourWord = isEuropean ? 'teu' : isEnglish ? 'your' : 'seu';

  if (isEnglish) {
    return `USER: ${firstName}
TEST RESULTS:
${resultsJson}

GENERATE THE ESSENCE CODE WITH THIS EXACT STRUCTURE:

═══════════════════════════════════════════
SECTION 0: EXECUTIVE SUMMARY (YOUR CODE IN 1 PAGE)
═══════════════════════════════════════════

Section: "resumo_executivo"

{
  "tres_forcas_centrais": ["[Central Force 1 - 2-4 words]", "[Central Force 2]", "[Central Force 3]"],
  "quem_voce_e": "[1 sentence about who the person IS in essence - based on the 3 forces]",
  "maior_forca": "[The most powerful strength - cite 1-2 tests]",
  "maior_risco": "[The most dangerous risk - cite the pattern]",
  "tensao_central": "[The central internal tension - e.g. 'Speed that wants perfection']",
  "frase_sintese": "[ONE sentence that summarizes the ENTIRE Code - memorable, confrontational, true]"
}

RULES: No actions, no directions. Pure identity revelation.

═══════════════════════════════════════════
SECTION 1: THE 3 CENTRAL TRUTHS (MANDATORY)
═══════════════════════════════════════════

Section: "tres_verdades_centrais"

{
  "truths": [
    { 
      "title": "[short title - 3-5 words]", 
      "content": "[1 paragraph explaining this truth about ${firstName} - what it IS, not what to do]", 
      "base": "[which tests support: DISC X% + Temperament Y + etc.]",
      "when_respected": "[what happens when honored]",
      "when_violated": "[what happens when ignored]"
    },
    {...},
    {...}
  ]
}

═══════════════════════════════════════════
SECTION 2: IDENTITY SYNTHESIS
═══════════════════════════════════════════

Section: "sintese_identitaria"

{
  "who_you_are": "[Deep description of who ${firstName} is in essence - 2-3 sentences]",
  "natural_role": "[The role this person naturally plays in environments]",
  "impact_on_others": "[How this person impacts people and relationships]",
  "core_desire": "[The deepest desire that drives this person]",
  "core_fear": "[The deepest fear that limits this person]"
}

═══════════════════════════════════════════
SECTION 3: CENTRAL TENSION
═══════════════════════════════════════════

Section: "tensao_central"

{
  "tension_name": "[Name of the main internal conflict - e.g. 'Control vs Connection']",
  "pole_a": {
    "name": "[First pole]",
    "description": "[What this pole wants/needs]",
    "tests_supporting": "[Which tests show this: DISC X%, Temperament Y]"
  },
  "pole_b": {
    "name": "[Second pole]",
    "description": "[What this pole wants/needs]",
    "tests_supporting": "[Which tests show this]"
  },
  "how_it_manifests": "[Concrete example of how this tension appears in daily life]",
  "cost_of_imbalance": "[What ${firstName} loses when one pole dominates]"
}

═══════════════════════════════════════════
SECTION 4: BEHAVIORAL MIRROR
═══════════════════════════════════════════

Section: "espelho_comportamental"

{
  "in_peace": {
    "description": "[How ${firstName} acts when centered and aligned - 2-3 sentences]",
    "behaviors": ["[Specific behavior 1]", "[Behavior 2]", "[Behavior 3]"],
    "others_see": "[How others experience this person when at peace]"
  },
  "under_pressure": {
    "description": "[How ${firstName} reacts under stress - 2-3 sentences]",
    "behaviors": ["[Sabotage behavior 1]", "[Behavior 2]", "[Behavior 3]"],
    "others_see": "[How others experience this person under pressure]"
  },
  "where_loses_self": {
    "description": "[Where ${firstName} gets lost trying to meet external expectations]",
    "example": "[Concrete life example where this happens]"
  }
}

═══════════════════════════════════════════
SECTION 5: RARITY OF PROFILE
═══════════════════════════════════════════

Section: "raridade_perfil"

{
  "percentage": [number 1-25],
  "explanation": "[Why this combination is uncommon - cite specific elements]"
}

═══════════════════════════════════════════
SECTION 6: LIFE AREAS READING
═══════════════════════════════════════════

Section: "areas_vida"

{
  "items": [
    {
      "area": "Career and Money",
      "how_essence_appears": "[How the essence manifests in this area]",
      "main_pattern": "[The repeating pattern in this area]",
      "what_fulfills": "[What brings fulfillment here]",
      "what_drains": "[What drains energy here]"
    },
    {
      "area": "Relationships and Love",
      ...
    },
    {
      "area": "Health and Energy",
      ...
    },
    {
      "area": "Spirituality and Meaning",
      ...
    }
  ]
}

NO PRACTICAL DIRECTIONS. Only reveal patterns.

═══════════════════════════════════════════
SECTION 7: CONFRONTATION
═══════════════════════════════════════════

Section: "confronto"

{
  "questions": [
    "[Confrontational question 1 that makes ${firstName} think]",
    "[Question 2]",
    "[Question 3]"
  ],
  "uncomfortable_truth": "[One truth that might be hard to accept but liberates]",
  "what_you_avoid_seeing": "[What ${firstName} might avoid recognizing about themselves]"
}

═══════════════════════════════════════════
SECTION 8: DEEP VALIDATION
═══════════════════════════════════════════

Section: "validacao_profunda"

{
  "not_a_defect": "[Reframe the main 'problem' as part of the essence - 2-3 sentences]",
  "internal_coherence": "[Show how everything connects - the pain makes sense]",
  "pain_source": "[Reveal that pain comes from misalignment, not weakness]",
  "permission": "[What ${firstName} needs permission to be/feel/want]"
}

═══════════════════════════════════════════
SECTION 9: VISUAL DATA (for charts)
═══════════════════════════════════════════

Section: "visual_data"

{
  "disc": { "D": [score], "I": [score], "S": [score], "C": [score], "dominant": "[letter]" },
  "temperament": { "primary": "[name]", "secondary": "[name]", "scores": {...} },
  "intelligences": { "top": ["top1", "top2", "top3"], "scores": {...} },
  "connection_style": { "primary": "[name]", "secondary": "[name]", "scores": {...} },
  "enneagram": { "type": "[number]", "wing": "[number]" },
  "nello16": { "code": "[4 letters]", "name": "[personality name]" },
  "archetypes": { "primary": "[name]", "secondary": "[name]" }
}

═══════════════════════════════════════════
SECTION 10: ARCHETYPES AND CALLING
═══════════════════════════════════════════

Section: "arquetipos_chamado"

{
  "primary": {
    "archetype": "[name]",
    "essence": "[What this archetype reveals about who ${firstName} is]",
    "shadow": "[The shadow side of this archetype]"
  },
  "secondary": {
    "archetype": "[name]",
    "essence": "[What this archetype adds]",
    "shadow": "[The shadow side]"
  },
  "combined_essence": "[How both archetypes together reveal ${firstName}'s core identity]"
}

═══════════════════════════════════════════
SECTION 11: PURPOSE MANIFESTO
═══════════════════════════════════════════

Section: "manifesto_proposito"

{
  "opening": "[Powerful opening statement about who ${firstName} is]",
  "core_declaration": "[I am someone who... - in first person]",
  "what_i_bring": "[What ${firstName} naturally brings to the world]",
  "my_essence_is": "[The essence in one phrase]",
  "closing": "[Closing affirmation]"
}

═══════════════════════════════════════════
SECTION 12: PATRON SAINT
═══════════════════════════════════════════

Section: "santo_padroeiro"

{
  "saint": {
    "name": "[Saint name]",
    "title": "[Title or epithet]",
    "lived": "[Life period]",
    "feast_day": "[Feast day]"
  },
  "connection": {
    "temperament_match": "[How saint's temperament connects]",
    "virtue_match": "[Main virtue connection]",
    "mission_match": "[How mission resonates]"
  },
  "biography": "[Brief biography focused on connection - 3-4 sentences]",
  "quote": {
    "text": "[Authentic quote - max 2 sentences]",
    "source": "[Source]"
  },
  "reflection": "[2-3 sentences applying quote to ${firstName}'s profile]"
}

═══════════════════════════════════════════
SECTION 13: REFERENCE PERSONALITIES
═══════════════════════════════════════════

Section: "personalidades_referencia"

{
  "intro": "[1 sentence about value of seeing similar profiles]",
  "personalities": [
    {
      "name": "[Name]",
      "field": "[Field]",
      "profile_match": "[Test combination that matches]",
      "connection": "[1-2 sentences on connection]"
    },
    {...},
    {...}
  ]
}

═══════════════════════════════════════════
SECTION 14: CLOSING - TRANSITION TO ACTIVATION
═══════════════════════════════════════════

Section: "conversa_final"

{
  "recognition": "[Acknowledge what ${firstName} just discovered about themselves - 2 sentences]",
  "the_pattern": "[Name the central pattern one more time]",
  "transition_insight": "Now that you recognize who you are, it becomes clear that many of your blocks don't come from lack of effort, but from trying to live, decide, and move against your own essence.",
  "opening_question": "[A question that opens, not closes - something to sit with]",
  "invitation_to_next": "You already know the pattern. But knowing doesn't transform. The next step is to ACTIVATE what you've discovered."
}

NO ACTIONS. NO 90-DAY PLANS. NO RITUALS.
The Code ends with RECOGNITION and OPENING.
The Activation provides the transformation path.

═══════════════════════════════════════════
FINAL JSON STRUCTURE
═══════════════════════════════════════════

{
  "language": "en",
  "userName": "${firstName}",
  "generatedAt": "[ISO timestamp]",
  "sections": [
    { "id": "resumo_executivo", ... },
    { "id": "tres_verdades_centrais", ... },
    { "id": "sintese_identitaria", ... },
    { "id": "tensao_central", ... },
    { "id": "espelho_comportamental", ... },
    { "id": "raridade_perfil", ... },
    { "id": "areas_vida", ... },
    { "id": "confronto", ... },
    { "id": "validacao_profunda", ... },
    { "id": "visual_data", ... },
    { "id": "arquetipos_chamado", ... },
    { "id": "manifesto_proposito", ... },
    { "id": "santo_padroeiro", ... },
    { "id": "personalidades_referencia", ... },
    { "id": "conversa_final", ... }
  ]
}

CRITICAL: No actions, no routines, no 90-day plans.
This is REVELATION and PREPARATION for the Activation.`;
  }

  // Portuguese (BR and PT)
  return `USUÁRIO: ${firstName}
RESULTADOS DOS TESTES:
${resultsJson}

GERE O CÓDIGO DA ESSÊNCIA COM ESTA ESTRUTURA EXATA:

═══════════════════════════════════════════
SEÇÃO 0: RESUMO EXECUTIVO (${youWord === 'Tu' ? 'O TEU' : 'SEU'} CÓDIGO EM 1 PÁGINA)
═══════════════════════════════════════════

Seção: "resumo_executivo"

{
  "tres_forcas_centrais": ["[Força Central 1 - 2-4 palavras]", "[Força Central 2]", "[Força Central 3]"],
  "quem_voce_e": "[1 frase sobre quem a pessoa É em essência - baseada nas 3 forças]",
  "maior_forca": "[A força mais poderosa - cite 1-2 testes]",
  "maior_risco": "[O risco mais perigoso - cite o padrão]",
  "tensao_central": "[A tensão interna central - ex: 'Velocidade que quer perfeição']",
  "frase_sintese": "[UMA frase que resume TODO o Código - memorável, confrontadora, verdadeira]"
}

REGRAS: Sem ações, sem direções. Revelação pura de identidade.

═══════════════════════════════════════════
SEÇÃO 1: AS 3 VERDADES CENTRAIS (OBRIGATÓRIO)
═══════════════════════════════════════════

Seção: "tres_verdades_centrais"

{
  "truths": [
    { 
      "title": "[título curto - 3-5 palavras]", 
      "content": "[1 parágrafo explicando essa verdade sobre ${firstName} - o que É, não o que fazer]", 
      "base": "[quais testes sustentam: DISC X% + Temperamento Y + etc.]",
      "when_respected": "[o que acontece quando honrada]",
      "when_violated": "[o que acontece quando ignorada]"
    },
    {...},
    {...}
  ]
}

═══════════════════════════════════════════
SEÇÃO 2: SÍNTESE IDENTITÁRIA
═══════════════════════════════════════════

Seção: "sintese_identitaria"

{
  "who_you_are": "[Descrição profunda de quem ${firstName} é em essência - 2-3 frases]",
  "natural_role": "[O papel que essa pessoa naturalmente ocupa nos ambientes]",
  "impact_on_others": "[Como essa pessoa impacta pessoas e relações]",
  "core_desire": "[O desejo mais profundo que move essa pessoa]",
  "core_fear": "[O medo mais profundo que limita essa pessoa]"
}

═══════════════════════════════════════════
SEÇÃO 3: TENSÃO CENTRAL
═══════════════════════════════════════════

Seção: "tensao_central"

{
  "tension_name": "[Nome do conflito interno principal - ex: 'Controle vs Conexão']",
  "pole_a": {
    "name": "[Primeiro polo]",
    "description": "[O que esse polo quer/precisa]",
    "tests_supporting": "[Quais testes mostram: DISC X%, Temperamento Y]"
  },
  "pole_b": {
    "name": "[Segundo polo]",
    "description": "[O que esse polo quer/precisa]",
    "tests_supporting": "[Quais testes mostram]"
  },
  "how_it_manifests": "[Exemplo concreto de como essa tensão aparece no dia a dia]",
  "cost_of_imbalance": "[O que ${firstName} perde quando um polo domina]"
}

═══════════════════════════════════════════
SEÇÃO 4: ESPELHO COMPORTAMENTAL
═══════════════════════════════════════════

Seção: "espelho_comportamental"

{
  "in_peace": {
    "description": "[Como ${firstName} age quando ${youWord.toLowerCase() === 'tu' ? 'estás' : 'está'} centrado(a) e alinhado(a) - 2-3 frases]",
    "behaviors": ["[Comportamento específico 1]", "[Comportamento 2]", "[Comportamento 3]"],
    "others_see": "[Como os outros experienciam essa pessoa em paz]"
  },
  "under_pressure": {
    "description": "[Como ${firstName} reage sob pressão - 2-3 frases]",
    "behaviors": ["[Comportamento de sabotagem 1]", "[Comportamento 2]", "[Comportamento 3]"],
    "others_see": "[Como os outros experienciam essa pessoa sob pressão]"
  },
  "where_loses_self": {
    "description": "[Onde ${firstName} se perde tentando corresponder a expectativas externas]",
    "example": "[Exemplo concreto de vida onde isso acontece]"
  }
}

═══════════════════════════════════════════
SEÇÃO 5: RARIDADE DO PERFIL
═══════════════════════════════════════════

Seção: "raridade_perfil"

{
  "percentage": [número 1-25],
  "explanation": "[Por que essa combinação é incomum - cite elementos específicos]"
}

═══════════════════════════════════════════
SEÇÃO 6: LEITURA POR ÁREAS DA VIDA
═══════════════════════════════════════════

Seção: "areas_vida"

{
  "items": [
    {
      "area": "Carreira e Dinheiro",
      "how_essence_appears": "[Como a essência se manifesta nessa área]",
      "main_pattern": "[O padrão que se repete nessa área]",
      "what_fulfills": "[O que traz realização aqui]",
      "what_drains": "[O que drena energia aqui]"
    },
    {
      "area": "Relacionamentos e Amor",
      ...
    },
    {
      "area": "Saúde e Energia",
      ...
    },
    {
      "area": "Espiritualidade e Sentido",
      ...
    }
  ]
}

SEM DIREÇÕES PRÁTICAS. Apenas revele padrões.

═══════════════════════════════════════════
SEÇÃO 7: CONFRONTO
═══════════════════════════════════════════

Seção: "confronto"

{
  "questions": [
    "[Pergunta confrontadora 1 que faz ${firstName} pensar]",
    "[Pergunta 2]",
    "[Pergunta 3]"
  ],
  "uncomfortable_truth": "[Uma verdade que pode ser difícil de aceitar mas liberta]",
  "what_you_avoid_seeing": "[O que ${firstName} pode evitar reconhecer sobre si ${youWord.toLowerCase() === 'tu' ? 'mesmo(a)' : 'mesmo(a)'}]"
}

═══════════════════════════════════════════
SEÇÃO 8: VALIDAÇÃO PROFUNDA
═══════════════════════════════════════════

Seção: "validacao_profunda"

{
  "not_a_defect": "[Reenquadre o principal 'problema' como parte da essência - 2-3 frases]",
  "internal_coherence": "[Mostre como tudo se conecta - a dor faz sentido]",
  "pain_source": "[Revele que a dor vem de desalinhamento, não de fraqueza]",
  "permission": "[O que ${firstName} precisa de permissão para ser/sentir/querer]"
}

═══════════════════════════════════════════
SEÇÃO 9: DADOS VISUAIS (para gráficos)
═══════════════════════════════════════════

Seção: "visual_data"

{
  "disc": { "D": [score], "I": [score], "S": [score], "C": [score], "dominant": "[letra]" },
  "temperament": { "primary": "[nome]", "secondary": "[nome]", "scores": {...} },
  "intelligences": { "top": ["top1", "top2", "top3"], "scores": {...} },
  "connection_style": { "primary": "[nome]", "secondary": "[nome]", "scores": {...} },
  "enneagram": { "type": "[número]", "wing": "[número]" },
  "nello16": { "code": "[4 letras]", "name": "[nome personalidade]" },
  "archetypes": { "primary": "[nome]", "secondary": "[nome]" }
}

═══════════════════════════════════════════
SEÇÃO 10: ARQUÉTIPOS E CHAMADO
═══════════════════════════════════════════

Seção: "arquetipos_chamado"

{
  "primary": {
    "archetype": "[nome]",
    "essence": "[O que esse arquétipo revela sobre quem ${firstName} é]",
    "shadow": "[O lado sombra desse arquétipo]"
  },
  "secondary": {
    "archetype": "[nome]",
    "essence": "[O que esse arquétipo adiciona]",
    "shadow": "[O lado sombra]"
  },
  "combined_essence": "[Como ambos arquétipos juntos revelam a identidade central de ${firstName}]"
}

═══════════════════════════════════════════
SEÇÃO 11: MANIFESTO DO PROPÓSITO
═══════════════════════════════════════════

Seção: "manifesto_proposito"

{
  "opening": "[Declaração poderosa de abertura sobre quem ${firstName} é]",
  "core_declaration": "[Eu sou alguém que... - em primeira pessoa]",
  "what_i_bring": "[O que ${firstName} naturalmente traz ao mundo]",
  "my_essence_is": "[A essência em uma frase]",
  "closing": "[Afirmação de fechamento]"
}

═══════════════════════════════════════════
SEÇÃO 12: SANTO PADROEIRO
═══════════════════════════════════════════

Seção: "santo_padroeiro"

{
  "saint": {
    "name": "[Nome do santo]",
    "title": "[Título ou epíteto]",
    "lived": "[Período de vida]",
    "feast_day": "[Dia da festa]"
  },
  "connection": {
    "temperament_match": "[Como o temperamento do santo se conecta]",
    "virtue_match": "[Conexão de virtude principal]",
    "mission_match": "[Como a missão ressoa]"
  },
  "biography": "[Breve biografia focada na conexão - 3-4 frases]",
  "quote": {
    "text": "[Citação autêntica - máx 2 frases]",
    "source": "[Fonte]"
  },
  "reflection": "[2-3 frases aplicando a citação ao perfil de ${firstName}]"
}

═══════════════════════════════════════════
SEÇÃO 13: PERSONALIDADES DE REFERÊNCIA
═══════════════════════════════════════════

Seção: "personalidades_referencia"

{
  "intro": "[1 frase sobre o valor de ver perfis similares]",
  "personalities": [
    {
      "name": "[Nome]",
      "field": "[Campo]",
      "profile_match": "[Combinação de testes que combina]",
      "connection": "[1-2 frases sobre conexão]"
    },
    {...},
    {...}
  ]
}

═══════════════════════════════════════════
SEÇÃO 14: FECHAMENTO - TRANSIÇÃO PARA ATIVAÇÃO
═══════════════════════════════════════════

Seção: "conversa_final"

{
  "recognition": "[Reconheça o que ${firstName} acabou de descobrir sobre si ${youWord.toLowerCase() === 'tu' ? 'mesmo(a)' : 'mesmo(a)'} - 2 frases]",
  "the_pattern": "[Nomeie o padrão central mais uma vez]",
  "transition_insight": "Agora que ${youWord.toLowerCase()} reconhece${youWord.toLowerCase() === 'tu' ? 's' : ''} quem ${youWord.toLowerCase()} ${youWord.toLowerCase() === 'tu' ? 'és' : 'é'}, fica claro que muitos dos ${yourWord}s bloqueios não vêm de falta de esforço, mas de tentar viver, decidir e se mover contra a ${yourWord} própria essência.",
  "opening_question": "[Uma pergunta que abre, não fecha - algo para refletir]",
  "invitation_to_next": "${youWord} já sabe${youWord.toLowerCase() === 'tu' ? 's' : ''} o padrão. Mas saber não transforma. O próximo passo é ATIVAR o que ${youWord.toLowerCase()} descobri${youWord.toLowerCase() === 'tu' ? 'ste' : 'u'}."
}

SEM AÇÕES. SEM PLANO DE 90 DIAS. SEM RITUAIS.
O Código termina com RECONHECIMENTO e ABERTURA.
A Ativação fornece o caminho de transformação.

═══════════════════════════════════════════
ESTRUTURA JSON FINAL
═══════════════════════════════════════════

{
  "language": "${locale}",
  "userName": "${firstName}",
  "generatedAt": "[ISO timestamp]",
  "sections": [
    { "id": "resumo_executivo", ... },
    { "id": "tres_verdades_centrais", ... },
    { "id": "sintese_identitaria", ... },
    { "id": "tensao_central", ... },
    { "id": "espelho_comportamental", ... },
    { "id": "raridade_perfil", ... },
    { "id": "areas_vida", ... },
    { "id": "confronto", ... },
    { "id": "validacao_profunda", ... },
    { "id": "visual_data", ... },
    { "id": "arquetipos_chamado", ... },
    { "id": "manifesto_proposito", ... },
    { "id": "santo_padroeiro", ... },
    { "id": "personalidades_referencia", ... },
    { "id": "conversa_final", ... }
  ]
}

CRÍTICO: Sem ações, sem rotinas, sem plano de 90 dias.
Isto é REVELAÇÃO e PREPARAÇÃO para a Ativação.
${isEuropean ? 'Use português europeu (tu, teu, tua).' : 'Use português brasileiro (você, seu, sua).'}`;
};
