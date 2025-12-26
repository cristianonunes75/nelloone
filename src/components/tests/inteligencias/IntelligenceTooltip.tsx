import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { INTELLIGENCES } from "@/lib/inteligenciasMultiplas";
import { Info } from "lucide-react";

interface IntelligenceTooltipProps {
  intelligenceKey: string;
  lang: 'pt' | 'pt-pt' | 'en';
}

const shortDescriptions = {
  pt: {
    linguistica: "Preferência por aprender e se expressar por palavras.",
    logico_matematica: "Preferência por pensar em padrões, lógica e números.",
    espacial: "Preferência por visualizar, imaginar e perceber formas.",
    musical: "Preferência por ritmo, melodia e padrões sonoros.",
    corporal_cinestesica: "Preferência por aprender pelo corpo e movimento.",
    interpessoal: "Preferência por conectar-se e entender outras pessoas.",
    intrapessoal: "Preferência por reflexão e autoconhecimento.",
    naturalista: "Preferência por padrões da natureza e seres vivos."
  },
  'pt-pt': {
    linguistica: "Preferência por aprender e expressar-se por palavras.",
    logico_matematica: "Preferência por pensar em padrões, lógica e números.",
    espacial: "Preferência por visualizar, imaginar e perceber formas.",
    musical: "Preferência por ritmo, melodia e padrões sonoros.",
    corporal_cinestesica: "Preferência por aprender pelo corpo e movimento.",
    interpessoal: "Preferência por conectar-se e entender outras pessoas.",
    intrapessoal: "Preferência por reflexão e autoconhecimento.",
    naturalista: "Preferência por padrões da natureza e seres vivos."
  },
  en: {
    linguistica: "Preference for learning and expressing through words.",
    logico_matematica: "Preference for thinking in patterns, logic, and numbers.",
    espacial: "Preference for visualizing, imagining, and perceiving shapes.",
    musical: "Preference for rhythm, melody, and sound patterns.",
    corporal_cinestesica: "Preference for learning through body and movement.",
    interpessoal: "Preference for connecting and understanding other people.",
    intrapessoal: "Preference for reflection and self-knowledge.",
    naturalista: "Preference for nature patterns and living beings."
  }
};

export function IntelligenceTooltip({ intelligenceKey, lang }: IntelligenceTooltipProps) {
  const intel = INTELLIGENCES[intelligenceKey];
  if (!intel) return null;

  const langKey = lang === 'pt-pt' ? 'pt' : lang;
  const descriptions = shortDescriptions[lang] || shortDescriptions.pt;
  const description = descriptions[intelligenceKey as keyof typeof descriptions] || "";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button"
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors ml-2"
            aria-label="Informação sobre esta inteligência"
          >
            <Info className="h-3 w-3 text-emerald-600" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[280px] p-3 bg-white/95 backdrop-blur-sm border-emerald-200"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">{intel.emoji}</span>
            <div>
              <p className="font-semibold text-sm text-emerald-800 mb-1">
                {intel.name[langKey]}
              </p>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Mapping from question number to intelligence key
export function getIntelligenceKeyFromQuestionNumber(questionNumber: number): string | null {
  const intelligenceOrder = [
    "linguistica",
    "logico_matematica", 
    "espacial",
    "musical",
    "corporal_cinestesica",
    "interpessoal",
    "intrapessoal",
    "naturalista"
  ];
  
  // 5 questions per intelligence
  const index = Math.floor((questionNumber - 1) / 5);
  return intelligenceOrder[index] || null;
}
