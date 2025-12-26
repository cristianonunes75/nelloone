import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTELLIGENCES } from "@/lib/inteligenciasMultiplas";
import { ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";

interface InteligenciasIntroScreenProps {
  lang: 'pt' | 'pt-pt' | 'en';
  onStart: () => void;
}

const translations = {
  pt: {
    title: "As 8 Inteligências que vamos mapear",
    intro: "Este teste avalia diferentes formas de pensar, aprender e resolver problemas.",
    intro2: "Não mede habilidade nem talento real, mas suas preferências naturais.",
    disclaimer: "Todas as pessoas têm todas essas inteligências em algum grau. O teste apenas mostra quais tendem a ser mais usadas por você hoje.",
    button: "Entendi, vamos começar"
  },
  'pt-pt': {
    title: "As 8 Inteligências que vamos mapear",
    intro: "Este teste avalia diferentes formas de pensar, aprender e resolver problemas.",
    intro2: "Não mede habilidade nem talento real, mas as suas preferências naturais.",
    disclaimer: "Todas as pessoas têm todas estas inteligências em algum grau. O teste apenas mostra quais tendem a ser mais usadas por si hoje.",
    button: "Entendi, vamos começar"
  },
  en: {
    title: "The 8 Intelligences we'll map",
    intro: "This test evaluates different ways of thinking, learning, and solving problems.",
    intro2: "It doesn't measure real skill or talent, but your natural preferences.",
    disclaimer: "Everyone has all these intelligences to some degree. The test only shows which ones you tend to use more today.",
    button: "Got it, let's start"
  }
};

const intelligenceDescriptions = {
  pt: {
    linguistica: "Facilidade para usar palavras para explicar, escrever, ensinar, argumentar e organizar ideias verbalmente.",
    logico_matematica: "Tendência a pensar em padrões, lógica, causas e efeitos, números e estruturas.",
    espacial: "Capacidade de visualizar, imaginar, desenhar, perceber formas, mapas e relações visuais.",
    musical: "Sensibilidade a sons, ritmos, tons, melodias e padrões sonoros.",
    corporal_cinestesica: "Aprender e se expressar pelo corpo, movimento, toque, ação prática e coordenação.",
    interpessoal: "Facilidade para perceber emoções, intenções e necessidades das outras pessoas e se conectar.",
    intrapessoal: "Capacidade de refletir sobre si, entender sentimentos, motivações e mundo interior.",
    naturalista: "Sensibilidade para padrões da natureza, ambientes, seres vivos e classificação de fenômenos naturais."
  },
  'pt-pt': {
    linguistica: "Facilidade para usar palavras para explicar, escrever, ensinar, argumentar e organizar ideias verbalmente.",
    logico_matematica: "Tendência a pensar em padrões, lógica, causas e efeitos, números e estruturas.",
    espacial: "Capacidade de visualizar, imaginar, desenhar, perceber formas, mapas e relações visuais.",
    musical: "Sensibilidade a sons, ritmos, tons, melodias e padrões sonoros.",
    corporal_cinestesica: "Aprender e expressar-se pelo corpo, movimento, toque, ação prática e coordenação.",
    interpessoal: "Facilidade para perceber emoções, intenções e necessidades das outras pessoas e conectar-se.",
    intrapessoal: "Capacidade de refletir sobre si, entender sentimentos, motivações e mundo interior.",
    naturalista: "Sensibilidade para padrões da natureza, ambientes, seres vivos e classificação de fenómenos naturais."
  },
  en: {
    linguistica: "Ease in using words to explain, write, teach, argue, and organize ideas verbally.",
    logico_matematica: "Tendency to think in patterns, logic, causes and effects, numbers, and structures.",
    espacial: "Ability to visualize, imagine, draw, perceive shapes, maps, and visual relationships.",
    musical: "Sensitivity to sounds, rhythms, tones, melodies, and sound patterns.",
    corporal_cinestesica: "Learning and expressing through body, movement, touch, practical action, and coordination.",
    interpessoal: "Ease in perceiving emotions, intentions, and needs of others and connecting with them.",
    intrapessoal: "Ability to reflect on yourself, understand feelings, motivations, and inner world.",
    naturalista: "Sensitivity to nature patterns, environments, living beings, and classification of natural phenomena."
  }
};

const intelligenceKeys = [
  "linguistica",
  "logico_matematica",
  "espacial",
  "musical",
  "corporal_cinestesica",
  "interpessoal",
  "intrapessoal",
  "naturalista"
];

export function InteligenciasIntroScreen({ lang, onStart }: InteligenciasIntroScreenProps) {
  const t = translations[lang] || translations.pt;
  const langKey = lang === 'pt-pt' ? 'pt' : lang;
  const descriptions = intelligenceDescriptions[lang] || intelligenceDescriptions.pt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {["🧠", "📝", "🎵", "🌿"].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            style={{
              top: `${10 + i * 22}%`,
              left: i % 2 === 0 ? '5%' : 'auto',
              right: i % 2 === 1 ? '5%' : 'auto',
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl md:text-4xl font-light text-emerald-800 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-emerald-700/80">
            {t.intro}
          </p>
          <p className="text-base text-emerald-700/70 mt-2">
            {t.intro2}
          </p>
        </motion.div>

        {/* Intelligence Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {intelligenceKeys.map((key, idx) => {
            const intel = INTELLIGENCES[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card className="p-4 bg-white/80 backdrop-blur-sm border-emerald-200/50 hover:border-emerald-400/50 transition-all hover:shadow-md h-full">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{intel.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-emerald-800 mb-1">
                        {intel.name[langKey]}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {descriptions[key as keyof typeof descriptions]}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-xl p-4 mb-8 flex items-start gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            {t.disclaimer}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={onStart}
            size="lg" 
            className="text-lg px-10 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {t.button}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
