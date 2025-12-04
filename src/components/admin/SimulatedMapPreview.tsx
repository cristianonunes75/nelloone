import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  User, 
  Palette, 
  MessageCircle, 
  Target, 
  BookOpen, 
  Sparkles, 
  Download, 
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

interface SimulatedMapPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyResults: any[];
  language?: string;
}

interface MapSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  color: string;
}

const SECTION_CONFIG: Record<string, { title: string; titleEn: string; icon: React.ReactNode; color: string }> = {
  IDENTIDADE_CENTRAL: { 
    title: "Identidade Central", 
    titleEn: "Core Identity",
    icon: <User className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30"
  },
  IMAGEM_ESSENCIAL: { 
    title: "Imagem Essencial", 
    titleEn: "Essential Image",
    icon: <Palette className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30"
  },
  COMUNICACAO_ESSENCIAL: { 
    title: "Comunicação Essencial", 
    titleEn: "Essential Communication",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
  },
  PROPOSITO_ESSENCIAL: { 
    title: "Propósito Essencial", 
    titleEn: "Essential Purpose",
    icon: <Target className="w-5 h-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
  },
  PLANO_VIDA: { 
    title: "Plano de Vida Essencial", 
    titleEn: "Essential Life Plan",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30"
  },
};

// Generate simulated map content based on journey results
const generateSimulatedMapContent = (journeyResults: any[], lang: string): MapSection[] => {
  const isEn = lang === 'en';
  
  // Extract dominant traits from results
  const getDominantTraits = () => {
    const traits: string[] = [];
    
    journeyResults.forEach(result => {
      if (result.testType === 'disc' && result.dominantProfile) {
        traits.push(`DISC: ${result.dominantProfile}`);
      }
      if (result.testType === 'arquetipos' && result.dominantArchetypes?.primary) {
        traits.push(`Arquétipo: ${result.dominantArchetypes.primary.archetype}`);
      }
      if (result.testType === 'temperamentos' && result.primary) {
        traits.push(`Temperamento: ${result.primary}`);
      }
      if (result.testType === 'linguagens_amor' && result.primary) {
        traits.push(`Conexão: ${result.primary}`);
      }
      if (result.testType === 'mbti' && result.type) {
        traits.push(`MBTI: ${result.type}`);
      }
      if (result.testType === 'eneagrama' && result.primaryType) {
        traits.push(`Eneagrama: Tipo ${result.primaryType}`);
      }
    });
    
    return traits;
  };

  const traits = getDominantTraits();
  const traitsSummary = traits.join(', ') || (isEn ? 'Balanced Profile' : 'Perfil Equilibrado');

  return [
    {
      id: 'IDENTIDADE_CENTRAL',
      title: isEn ? SECTION_CONFIG.IDENTIDADE_CENTRAL.titleEn : SECTION_CONFIG.IDENTIDADE_CENTRAL.title,
      icon: SECTION_CONFIG.IDENTIDADE_CENTRAL.icon,
      color: SECTION_CONFIG.IDENTIDADE_CENTRAL.color,
      content: isEn ? `
**Dominant Energy:** Your results indicate a unique combination of traits that define who you are at your core.

**Identified Traits:** ${traitsSummary}

**Core Strength:** Your ability to integrate multiple perspectives and adapt to different situations with emotional intelligence.

**Emotional Blind Spot:** Tendency to overthink situations before taking action, which can delay important decisions.

**Soul Keyword:** Authenticity

**Inner Voice:** "Trust your intuition and embrace your unique path."

This section represents the essence of who you are - the fundamental patterns that shape your worldview, decisions, and relationships.
      `.trim() : `
**Energia Dominante:** Seus resultados indicam uma combinação única de traços que definem quem você é em sua essência.

**Traços Identificados:** ${traitsSummary}

**Força Principal:** Sua capacidade de integrar múltiplas perspectivas e se adaptar a diferentes situações com inteligência emocional.

**Ponto Cego Emocional:** Tendência a pensar demais antes de agir, o que pode atrasar decisões importantes.

**Palavra-Chave da Alma:** Autenticidade

**Voz Interior:** "Confie na sua intuição e abrace seu caminho único."

Esta seção representa a essência de quem você é - os padrões fundamentais que moldam sua visão de mundo, decisões e relacionamentos.
      `.trim()
    },
    {
      id: 'IMAGEM_ESSENCIAL',
      title: isEn ? SECTION_CONFIG.IMAGEM_ESSENCIAL.titleEn : SECTION_CONFIG.IMAGEM_ESSENCIAL.title,
      icon: SECTION_CONFIG.IMAGEM_ESSENCIAL.icon,
      color: SECTION_CONFIG.IMAGEM_ESSENCIAL.color,
      content: isEn ? `
**Emotional Palette:** Deep earth tones combined with subtle warm accents that convey stability and warmth.

**Recommended Style:** Classic with contemporary touches - pieces that stand the test of time with modern details.

**Textures:** Natural fabrics, soft knits, subtle textures that invite touch and convey comfort.

**Body Expression:** Confident posture, open gestures, grounded presence.

**Photo Rhythm:** Calm, contemplative, natural lighting, authentic moments.

**Environments:** Spaces with natural elements, warm lighting, cozy atmospheres.

**Amplifying Colors:** Navy blue, olive green, warm beige, terracotta.
      `.trim() : `
**Paleta Emocional:** Tons terrosos profundos combinados com acentos quentes sutis que transmitem estabilidade e calor.

**Estilo Recomendado:** Clássico com toques contemporâneos - peças que resistem ao tempo com detalhes modernos.

**Texturas:** Tecidos naturais, malhas suaves, texturas sutis que convidam ao toque e transmitem conforto.

**Expressão Corporal:** Postura confiante, gestos abertos, presença enraizada.

**Ritmo Fotográfico:** Calmo, contemplativo, iluminação natural, momentos autênticos.

**Ambientes:** Espaços com elementos naturais, iluminação quente, atmosferas acolhedoras.

**Cores Amplificadoras:** Azul marinho, verde oliva, bege quente, terracota.
      `.trim()
    },
    {
      id: 'COMUNICACAO_ESSENCIAL',
      title: isEn ? SECTION_CONFIG.COMUNICACAO_ESSENCIAL.titleEn : SECTION_CONFIG.COMUNICACAO_ESSENCIAL.title,
      icon: SECTION_CONFIG.COMUNICACAO_ESSENCIAL.icon,
      color: SECTION_CONFIG.COMUNICACAO_ESSENCIAL.color,
      content: isEn ? `
**Voice Tone:** Calm, thoughtful, warm - you speak with intention and depth.

**Emotional Language:** Preference for meaningful conversations over small talk, values depth over breadth.

**Amplifying Phrases:** "I believe in...", "What matters most is...", "Let me share my perspective..."

**What to Avoid:** Rushed communication, overly formal language, disconnected interactions.

**Presence:** Attentive listener, creates safe space for others to open up.

**Posture:** Open body language, maintains comfortable eye contact, relaxed but engaged.

**Communication Superpower:** Ability to make complex ideas accessible and relatable.
      `.trim() : `
**Tom de Voz:** Calmo, reflexivo, caloroso - você fala com intenção e profundidade.

**Linguagem Emocional:** Preferência por conversas significativas em vez de superficiais, valoriza profundidade sobre amplitude.

**Frases Amplificadoras:** "Acredito que...", "O que mais importa é...", "Deixe-me compartilhar minha perspectiva..."

**O que Evitar:** Comunicação apressada, linguagem excessivamente formal, interações desconectadas.

**Presença:** Ouvinte atento, cria espaço seguro para outros se abrirem.

**Postura:** Linguagem corporal aberta, mantém contato visual confortável, relaxado mas engajado.

**Superpoder Comunicativo:** Capacidade de tornar ideias complexas acessíveis e relacionáveis.
      `.trim()
    },
    {
      id: 'PROPOSITO_ESSENCIAL',
      title: isEn ? SECTION_CONFIG.PROPOSITO_ESSENCIAL.titleEn : SECTION_CONFIG.PROPOSITO_ESSENCIAL.title,
      icon: SECTION_CONFIG.PROPOSITO_ESSENCIAL.icon,
      color: SECTION_CONFIG.PROPOSITO_ESSENCIAL.color,
      content: isEn ? `
**Life Direction:** To inspire and guide others toward self-discovery while continuing your own journey of growth.

**Dominant Virtue:** Wisdom combined with compassion - you understand that true knowledge serves others.

**Shadow Work:** Learning to balance giving to others with receiving, avoiding depletion.

**Foundational Verse:** "Know thyself, and thou shalt know the universe and the gods." - Temple of Apollo

**Personalized Prayer:** "May I have the clarity to see my path, the courage to walk it, and the wisdom to help others find theirs."

**Daily Mantra:** "I am enough. I grow daily. I serve with joy."

**7-Day Alignment Act:** Each morning, spend 5 minutes in silent reflection, asking: "How can I honor my essence today?"
      `.trim() : `
**Direção de Vida:** Inspirar e guiar outros em direção ao autoconhecimento enquanto continua sua própria jornada de crescimento.

**Virtude Dominante:** Sabedoria combinada com compaixão - você entende que o verdadeiro conhecimento serve aos outros.

**Trabalho de Sombra:** Aprender a equilibrar dar aos outros com receber, evitando o esgotamento.

**Versículo Fundamental:** "Conhece-te a ti mesmo, e conhecerás o universo e os deuses." - Templo de Apolo

**Oração Personalizada:** "Que eu tenha a clareza para ver meu caminho, a coragem para trilhá-lo e a sabedoria para ajudar outros a encontrar o deles."

**Mantra Diário:** "Eu sou suficiente. Eu cresço diariamente. Eu sirvo com alegria."

**Ato de Alinhamento de 7 Dias:** Cada manhã, passe 5 minutos em reflexão silenciosa, perguntando: "Como posso honrar minha essência hoje?"
      `.trim()
    },
    {
      id: 'PLANO_VIDA',
      title: isEn ? SECTION_CONFIG.PLANO_VIDA.titleEn : SECTION_CONFIG.PLANO_VIDA.title,
      icon: SECTION_CONFIG.PLANO_VIDA.icon,
      color: SECTION_CONFIG.PLANO_VIDA.color,
      content: isEn ? `
**Health:** Prioritize activities that ground you - walking in nature, mindful movement, adequate rest. Your energy flows best when your body is honored.

**Routine:** Create rituals that anchor your day - morning reflection, intentional breaks, evening gratitude. Structure supports your creative spirit.

**Relationships:** Invest in deep connections over numerous acquaintances. Quality conversations nourish your soul.

**Spiritual Life:** Regular practices of contemplation, whether meditation, prayer, or journaling. Your inner world needs tending.

**Professional Life:** Seek work that aligns with your values and allows you to make meaningful impact. You thrive when purpose meets profession.

**Financial Wisdom:** Build security gradually, invest in experiences and growth over possessions. Freedom matters more than accumulation.

**Creative Expression:** Make time for creative outlets - writing, art, music. Your soul speaks through creation.
      `.trim() : `
**Saúde:** Priorize atividades que te enraízam - caminhar na natureza, movimento consciente, descanso adequado. Sua energia flui melhor quando seu corpo é honrado.

**Rotina:** Crie rituais que ancorem seu dia - reflexão matinal, pausas intencionais, gratidão noturna. A estrutura apoia seu espírito criativo.

**Relacionamentos:** Invista em conexões profundas em vez de numerosos conhecidos. Conversas de qualidade nutrem sua alma.

**Vida Espiritual:** Práticas regulares de contemplação, seja meditação, oração ou escrita. Seu mundo interior precisa de cuidado.

**Vida Profissional:** Busque trabalho que se alinhe com seus valores e permita causar impacto significativo. Você prospera quando propósito encontra profissão.

**Sabedoria Financeira:** Construa segurança gradualmente, invista em experiências e crescimento mais do que em posses. Liberdade importa mais que acumulação.

**Expressão Criativa:** Reserve tempo para saídas criativas - escrita, arte, música. Sua alma fala através da criação.
      `.trim()
    }
  ];
};

export const SimulatedMapPreview = ({ 
  open, 
  onOpenChange, 
  journeyResults, 
  language = 'pt' 
}: SimulatedMapPreviewProps) => {
  const [activeSection, setActiveSection] = useState<string>('IDENTIDADE_CENTRAL');
  
  const sections = generateSimulatedMapContent(journeyResults, language);
  const currentSection = sections.find(s => s.id === activeSection);

  const isEn = language === 'en';

  const growthPoints = {
    mainGrowthPoint: isEn 
      ? "Integrate your dominant energy into daily decisions, honoring who you truly are."
      : "Integrar sua energia dominante nas decisões diárias, honrando quem você verdadeiramente é.",
    mainBlindSpot: isEn
      ? "Tendency to overthink situations before taking action."
      : "Tendência a pensar demais antes de agir.",
    recommendedAction: isEn
      ? "Dedicate 10 minutes daily to reflect on how your actions reflect your essence."
      : "Dedique 10 minutos diários para reflexão sobre como suas ações refletem sua essência."
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEn ? 'Nello One Map Preview' : 'Pré-visualização do Mapa Nello One'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {isEn ? 'Simulated data based on journey results' : 'Dados simulados baseados nos resultados da jornada'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
              {isEn ? 'SIMULATION' : 'SIMULAÇÃO'}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeSection === section.id
                      ? "bg-foreground text-background shadow-lg"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {section.icon}
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              ))}
            </div>

            {/* Active Section Content */}
            {currentSection && (
              <div className={cn(
                "bg-gradient-to-br border rounded-xl p-6 transition-all duration-300",
                currentSection.color
              )}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                    {currentSection.icon}
                  </div>
                  <h2 className="text-lg font-semibold">{currentSection.title}</h2>
                </div>
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {currentSection.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.includes(':**')) {
                        const [label, ...rest] = line.split(':**');
                        const value = rest.join(':**');
                        return (
                          <p key={i} className="mb-2">
                            <strong className="text-foreground">{label.replace(/\*\*/g, '')}:</strong>
                            <span className="text-muted-foreground ml-1">{value.replace(/\*\*/g, '')}</span>
                          </p>
                        );
                      }
                      if (line.trim()) {
                        return <p key={i} className="mb-2 text-muted-foreground">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Growth Points Section */}
            <div className="bg-[#F8F8F4] rounded-xl p-5 border border-border/50">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                {isEn ? 'Growth Points' : 'Pontos de Crescimento'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-emerald-700 mb-1">
                      {isEn ? 'Main Growth Point' : 'Ponto de Crescimento Principal'}
                    </p>
                    <p className="text-sm text-muted-foreground">{growthPoints.mainGrowthPoint}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-1">
                      {isEn ? 'Blind Spot' : 'Ponto Cego'}
                    </p>
                    <p className="text-sm text-muted-foreground">{growthPoints.mainBlindSpot}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-700 mb-1">
                      {isEn ? 'Recommended Action' : 'Ação Recomendada'}
                    </p>
                    <p className="text-sm text-muted-foreground">{growthPoints.recommendedAction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">
                {isEn 
                  ? "This is a simulated preview. In production, the map would be generated by Miguel AI based on the user's actual test results."
                  : "Esta é uma pré-visualização simulada. Em produção, o mapa seria gerado pela IA Miguel baseado nos resultados reais dos testes do usuário."
                }
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
