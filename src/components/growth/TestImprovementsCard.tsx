import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Heart, 
  Brain, 
  Users, 
  Target, 
  Sparkles,
  MessageCircle,
  Compass,
  Eye,
  Flame,
  Shield
} from "lucide-react";

interface TestImprovementsCardProps {
  testType: string;
  className?: string;
}

const testImprovements = {
  arquetipos_proposito: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Clareza sobre sua energia dominante",
        "Consciência do que te move e te paralisa",
        "Entendimento dos padrões inconscientes",
        "Direção para expressão autêntica",
        "Alinhamento entre quem você é e como age"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Clareza sobre a sua energia dominante",
        "Consciência do que o move e paralisa",
        "Entendimento dos padrões inconscientes",
        "Direção para expressão autêntica",
        "Alinhamento entre quem é e como age"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Clarity about your dominant energy",
        "Awareness of what moves and paralyzes you",
        "Understanding of unconscious patterns",
        "Direction for authentic expression",
        "Alignment between who you are and how you act"
      ]
    },
    icon: Sparkles,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20"
  },
  disc: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Consciência do seu ritmo natural",
        "Entendimento do seu estilo de liderança",
        "Melhoria na comunicação profissional",
        "Gestão de conflitos e relacionamentos",
        "Autoconhecimento comportamental"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Consciência do seu ritmo natural",
        "Entendimento do seu estilo de liderança",
        "Melhoria na comunicação profissional",
        "Gestão de conflitos e relações",
        "Autoconhecimento comportamental"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Awareness of your natural rhythm",
        "Understanding your leadership style",
        "Professional communication improvement",
        "Conflict and relationship management",
        "Behavioral self-knowledge"
      ]
    },
    icon: Target,
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20"
  },
  mbti: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Clareza sobre como você toma decisões",
        "Entendimento da sua energia social",
        "Consciência de como processa informações",
        "Melhoria nos relacionamentos interpessoais",
        "Direcionamento de carreira alinhado"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Clareza sobre como toma decisões",
        "Entendimento da sua energia social",
        "Consciência de como processa informações",
        "Melhoria nas relações interpessoais",
        "Direcionamento de carreira alinhado"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Clarity about how you make decisions",
        "Understanding your social energy",
        "Awareness of how you process information",
        "Improvement in interpersonal relationships",
        "Aligned career direction"
      ]
    },
    icon: Brain,
    color: "from-emerald-500/10 to-green-500/10 border-emerald-500/20"
  },
  nello16: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Clareza sobre como você toma decisões",
        "Entendimento da sua energia social",
        "Consciência de como processa informações",
        "Melhoria nos relacionamentos interpessoais",
        "Direcionamento de carreira alinhado"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Clareza sobre como toma decisões",
        "Entendimento da sua energia social",
        "Consciência de como processa informações",
        "Melhoria nas relações interpessoais",
        "Direcionamento de carreira alinhado"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Clarity about how you make decisions",
        "Understanding your social energy",
        "Awareness of how you process information",
        "Improvement in interpersonal relationships",
        "Aligned career direction"
      ]
    },
    icon: Brain,
    color: "from-emerald-500/10 to-green-500/10 border-emerald-500/20"
  },
  eneagrama: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Consciência das motivações profundas",
        "Entendimento dos medos centrais",
        "Clareza sobre padrões de autossabotagem",
        "Caminho de crescimento pessoal",
        "Compaixão consigo mesmo e outros"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Consciência das motivações profundas",
        "Entendimento dos medos centrais",
        "Clareza sobre padrões de autossabotagem",
        "Caminho de crescimento pessoal",
        "Compaixão consigo próprio e com os outros"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Awareness of deep motivations",
        "Understanding core fears",
        "Clarity about self-sabotage patterns",
        "Personal growth path",
        "Compassion for yourself and others"
      ]
    },
    icon: Eye,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20"
  },
  temperamentos: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Entendimento do seu modo natural de ser",
        "Consciência de reações emocionais",
        "Melhoria na gestão de energia",
        "Clareza sobre necessidades básicas",
        "Harmonização dos temperamentos"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Entendimento do seu modo natural de ser",
        "Consciência de reações emocionais",
        "Melhoria na gestão de energia",
        "Clareza sobre necessidades básicas",
        "Harmonização dos temperamentos"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Understanding your natural way of being",
        "Awareness of emotional reactions",
        "Energy management improvement",
        "Clarity about basic needs",
        "Temperament harmonization"
      ]
    },
    icon: Flame,
    color: "from-red-500/10 to-rose-500/10 border-red-500/20"
  },
  linguagens_amor: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Consciência de como se conecta emocionalmente",
        "Entendimento do seu estilo de conexão afetiva",
        "Melhoria nos relacionamentos interpessoais",
        "Comunicação emocional mais clara",
        "Conexões mais profundas e autênticas"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Consciência de como se liga emocionalmente",
        "Entendimento do seu estilo de conexão afetiva",
        "Melhoria nas relações interpessoais",
        "Comunicação emocional mais clara",
        "Ligações mais profundas e autênticas"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Awareness of how you emotionally connect",
        "Understanding your affection connection style",
        "Improvement in interpersonal relationships",
        "Clearer emotional communication",
        "Deeper and more authentic connections"
      ]
    },
    icon: Heart,
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20"
  },
  inteligencias_multiplas: {
    pt: {
      title: "O que você melhora com este teste",
      items: [
        "Clareza sobre suas formas de aprender",
        "Entendimento dos seus talentos naturais",
        "Direcionamento de carreira e estudos",
        "Aproveitamento máximo das capacidades",
        "Desenvolvimento de pontos fortes"
      ]
    },
    'pt-pt': {
      title: "O que melhora com este teste",
      items: [
        "Clareza sobre as suas formas de aprender",
        "Entendimento dos seus talentos naturais",
        "Direcionamento de carreira e estudos",
        "Aproveitamento máximo das capacidades",
        "Desenvolvimento de pontos fortes"
      ]
    },
    en: {
      title: "What you improve with this test",
      items: [
        "Clarity about your ways of learning",
        "Understanding your natural talents",
        "Career and study direction",
        "Maximum use of capabilities",
        "Development of strengths"
      ]
    },
    icon: Compass,
    color: "from-indigo-500/10 to-blue-500/10 border-indigo-500/20"
  }
};

export const TestImprovementsCard = ({ testType, className }: TestImprovementsCardProps) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt';
  
  const data = testImprovements[testType as keyof typeof testImprovements];
  if (!data) return null;
  
  const content = data[lang];
  const Icon = data.icon;
  
  return (
    <div className={cn(
      "bg-gradient-to-br rounded-2xl p-6 md:p-8 border shadow-sm",
      data.color,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm">
          <Icon className="w-7 h-7 text-foreground" />
        </div>
        
        <div className="flex-1 space-y-4">
          <h3 className="font-semibold text-lg text-foreground">
            {content.title}
          </h3>
          
          <ul className="space-y-2">
            {content.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-ink-blue mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
