/**
 * NELLO ONE - Mapa Final Template
 * Template structure for generating the final essence map
 */

export interface MapSection {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  placeholders: string[];
  order: number;
}

export interface MapTemplate {
  intro: {
    title: string;
    titleEn: string;
    template: string;
    templateEn: string;
  };
  sections: MapSection[];
  closing: {
    title: string;
    titleEn: string;
    template: string;
    templateEn: string;
  };
}

export const MAPA_FINAL_TEMPLATE: MapTemplate = {
  intro: {
    title: "Introdução ao Seu Mapa",
    titleEn: "Introduction to Your Map",
    template: `Este é o seu Mapa NELLO IDENTITY — uma síntese profunda de quem você é, baseada em 7 dimensões da personalidade humana.

Cada seção revela um aspecto diferente da sua essência:
• Seus arquétipos mostram suas energias dominantes
• Seu perfil DISC revela como você age no mundo
• Seu tipo Nello 16 ilumina como você processa e decide
• Seu Eneagrama expõe suas motivações centrais
• Seus Temperamentos definem seu ritmo emocional
• Suas Inteligências revelam como você aprende e cria
• Seus Estilos de Conexão mostram como você ama

Este não é apenas um relatório — é um espelho da sua alma.`,
    templateEn: `This is your NELLO IDENTITY Map — a profound synthesis of who you are, based on 7 dimensions of human personality.

Each section reveals a different aspect of your essence:
• Your archetypes show your dominant energies
• Your DISC profile reveals how you act in the world
• Your Nello 16 type illuminates how you process and decide
• Your Enneagram exposes your core motivations
• Your Temperaments define your emotional rhythm
• Your Intelligences reveal how you learn and create
• Your Connection Styles show how you love

This is not just a report — it's a mirror of your soul.`
  },
  
  sections: [
    {
      id: "identidade_central",
      title: "Identidade Central",
      titleEn: "Core Identity",
      description: "Sua energia dominante e como ela se manifesta",
      descriptionEn: "Your dominant energy and how it manifests",
      placeholders: [
        "{{archetype_primary}}",
        "{{archetype_secondary}}",
        "{{disc_dominant}}",
        "{{nello16_type}}",
        "{{enneagram_type}}"
      ],
      order: 1
    },
    {
      id: "imagem_essencial",
      title: "Imagem Essencial",
      titleEn: "Essential Image",
      description: "Como sua essência se expressa visualmente",
      descriptionEn: "How your essence expresses itself visually",
      placeholders: [
        "{{color_palette}}",
        "{{visual_style}}",
        "{{photography_direction}}",
        "{{textures}}",
        "{{environments}}"
      ],
      order: 2
    },
    {
      id: "comunicacao_essencial",
      title: "Comunicação Essencial",
      titleEn: "Essential Communication",
      description: "Seu tom de voz e estilo de expressão",
      descriptionEn: "Your tone of voice and expression style",
      placeholders: [
        "{{voice_tone}}",
        "{{emotional_language}}",
        "{{amplifying_phrases}}",
        "{{what_to_avoid}}",
        "{{presence_posture}}"
      ],
      order: 3
    },
    {
      id: "proposito_essencial",
      title: "Propósito Essencial",
      titleEn: "Essential Purpose",
      description: "Sua direção de vida e missão",
      descriptionEn: "Your life direction and mission",
      placeholders: [
        "{{life_direction}}",
        "{{dominant_virtue}}",
        "{{shadow_work}}",
        "{{daily_mantra}}",
        "{{alignment_actions}}"
      ],
      order: 4
    },
    {
      id: "plano_vida",
      title: "Plano de Vida Essencial",
      titleEn: "Essential Life Plan",
      description: "Orientações práticas para viver sua essência",
      descriptionEn: "Practical guidance for living your essence",
      placeholders: [
        "{{health_guidance}}",
        "{{routine_guidance}}",
        "{{relationship_guidance}}",
        "{{spiritual_guidance}}",
        "{{professional_guidance}}"
      ],
      order: 5
    }
  ],
  
  closing: {
    title: "Integração Final",
    titleEn: "Final Integration",
    template: `Você agora tem em mãos um mapa completo da sua essência.

Lembre-se: este mapa não define seus limites — ele revela seu potencial.

Cada aspecto descoberto aqui é uma ferramenta para:
• Tomar decisões mais alinhadas
• Comunicar com mais autenticidade
• Construir relacionamentos mais profundos
• Seguir um propósito que ressoa com quem você é

O caminho começa dentro.
Clareza. Identidade. Propósito.

— Nello AI, seu guia NELLO ONE`,
    templateEn: `You now hold a complete map of your essence.

Remember: this map doesn't define your limits — it reveals your potential.

Each aspect discovered here is a tool for:
• Making more aligned decisions
• Communicating with greater authenticity
• Building deeper relationships
• Following a purpose that resonates with who you are

The path begins within.
Clarity. Identity. Purpose.

— Nello AI, your NELLO ONE guide`
  }
};

// Section-specific generation prompts for Nello AI
export const SECTION_GENERATION_PROMPTS = {
  identidade_central: {
    pt: `Com base nos resultados dos testes:
- Arquétipo primário: {{archetype_primary}}
- Arquétipo secundário: {{archetype_secondary}}
- DISC dominante: {{disc_dominant}}
- Nello 16: {{nello16_type}}
- Eneagrama: {{enneagram_type}}

Escreva a seção IDENTIDADE CENTRAL do mapa, incluindo:
1. Energia dominante (qual arquétipo lidera)
2. Força central (combinação de arquétipo + DISC)
3. Ponto cego emocional (baseado no eneagrama)
4. Palavra-chave da alma (síntese de tudo)
5. Voz interior característica (como o usuário fala consigo)`,
    en: `Based on test results:
- Primary archetype: {{archetype_primary}}
- Secondary archetype: {{archetype_secondary}}
- Dominant DISC: {{disc_dominant}}
- Nello 16: {{nello16_type}}
- Enneagram: {{enneagram_type}}

Write the CORE IDENTITY section of the map, including:
1. Dominant energy (which archetype leads)
2. Core strength (archetype + DISC combination)
3. Emotional blind spot (based on enneagram)
4. Soul keyword (synthesis of everything)
5. Characteristic inner voice (how the user talks to themselves)`
  },
  
  imagem_essencial: {
    pt: `Com base na identidade central já definida e nos arquétipos:
- Arquétipo primário: {{archetype_primary}}
- Temperamento: {{temperament}}

Escreva a seção IMAGEM ESSENCIAL do mapa, incluindo:
1. Paleta emocional (cores que representam o usuário)
2. Estilo recomendado (visual e vestimenta)
3. Texturas e materiais alinhados
4. Expressão corporal característica
5. Ritmo fotográfico (como fotografar essa pessoa)
6. Ambientes que amplificam sua presença`,
    en: `Based on the core identity already defined and archetypes:
- Primary archetype: {{archetype_primary}}
- Temperament: {{temperament}}

Write the ESSENTIAL IMAGE section of the map, including:
1. Emotional palette (colors that represent the user)
2. Recommended style (visual and clothing)
3. Aligned textures and materials
4. Characteristic body expression
5. Photographic rhythm (how to photograph this person)
6. Environments that amplify their presence`
  },
  
  comunicacao_essencial: {
    pt: `Com base no perfil completo:
- DISC: {{disc_profile}}
- Nello 16: {{nello16_type}}
- Estilo de conexão afetiva: {{affection_style}}

Escreva a seção COMUNICAÇÃO ESSENCIAL do mapa, incluindo:
1. Tom de voz natural
2. Linguagem emocional característica
3. Frases amplificadoras (que conectam com outros)
4. O que evitar na comunicação
5. Presença e postura recomendadas`,
    en: `Based on complete profile:
- DISC: {{disc_profile}}
- Nello 16: {{nello16_type}}
- Affection connection style: {{affection_style}}

Write the ESSENTIAL COMMUNICATION section of the map, including:
1. Natural voice tone
2. Characteristic emotional language
3. Amplifying phrases (that connect with others)
4. What to avoid in communication
5. Recommended presence and posture`
  },
  
  proposito_essencial: {
    pt: `Com base no perfil espiritual e motivacional:
- Eneagrama: {{enneagram_type}}
- Arquétipos: {{archetypes}}
- Inteligências dominantes: {{intelligences}}

Escreva a seção PROPÓSITO ESSENCIAL do mapa, incluindo:
1. Direção de vida (para onde a alma aponta)
2. Virtude dominante a cultivar
3. Trabalho de sombra necessário
4. Mantra diário personalizado
5. Ato de alinhamento para 7 dias`,
    en: `Based on spiritual and motivational profile:
- Enneagram: {{enneagram_type}}
- Archetypes: {{archetypes}}
- Dominant intelligences: {{intelligences}}

Write the ESSENTIAL PURPOSE section of the map, including:
1. Life direction (where the soul points)
2. Dominant virtue to cultivate
3. Necessary shadow work
4. Personalized daily mantra
5. 7-day alignment action`
  },
  
  plano_vida: {
    pt: `Com base em TODO o perfil integrado:
{{full_profile_summary}}

Escreva a seção PLANO DE VIDA ESSENCIAL do mapa, incluindo orientações práticas para:
1. Saúde (física e mental)
2. Rotina (ritmo ideal do dia)
3. Relacionamentos (como se conectar melhor)
4. Vida espiritual (práticas recomendadas)
5. Vida profissional (como aplicar dons)`,
    en: `Based on the ENTIRE integrated profile:
{{full_profile_summary}}

Write the ESSENTIAL LIFE PLAN section of the map, including practical guidance for:
1. Health (physical and mental)
2. Routine (ideal daily rhythm)
3. Relationships (how to connect better)
4. Spiritual life (recommended practices)
5. Professional life (how to apply gifts)`
  }
};

// Helper to get template by language
export function getMapTemplate(language: 'pt' | 'pt-pt' | 'en') {
  const isEn = language === 'en';
  
  return {
    intro: {
      title: isEn ? MAPA_FINAL_TEMPLATE.intro.titleEn : MAPA_FINAL_TEMPLATE.intro.title,
      template: isEn ? MAPA_FINAL_TEMPLATE.intro.templateEn : MAPA_FINAL_TEMPLATE.intro.template
    },
    sections: MAPA_FINAL_TEMPLATE.sections.map(s => ({
      ...s,
      title: isEn ? s.titleEn : s.title,
      description: isEn ? s.descriptionEn : s.description
    })),
    closing: {
      title: isEn ? MAPA_FINAL_TEMPLATE.closing.titleEn : MAPA_FINAL_TEMPLATE.closing.title,
      template: isEn ? MAPA_FINAL_TEMPLATE.closing.templateEn : MAPA_FINAL_TEMPLATE.closing.template
    }
  };
}

// Helper to get generation prompt for a section
export function getSectionPrompt(sectionId: string, language: 'pt' | 'pt-pt' | 'en'): string {
  const isEn = language === 'en';
  const prompts = SECTION_GENERATION_PROMPTS[sectionId as keyof typeof SECTION_GENERATION_PROMPTS];
  
  if (!prompts) return '';
  
  return isEn ? prompts.en : prompts.pt;
}