import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaithFAQSectionProps {
  className?: string;
}

const getFAQData = (lang: string) => {
  const isEn = lang === "en";
  const isPtPt = lang === "pt-pt";

  return {
    title: isEn
      ? "Frequently Asked Questions — Identity & Faith"
      : "Perguntas Frequentes — Identity e Fé",
    items: [
      {
        question: isEn
          ? "Does this have anything esoteric or occult?"
          : "Isso tem algo de esotérico ou ocultista?",
        answer: isEn
          ? "No. Identity is a journey of self-knowledge based on psychology and behavior. There is no alternative spiritual practice, mystical or esoteric element."
          : "Não. O Identity é uma jornada de autoconhecimento baseada em psicologia e comportamento. Não há qualquer prática espiritual alternativa, mística ou esotérica.",
      },
      {
        question: isEn
          ? 'Why are there names like "Magician" or "Archetypes"?'
          : 'Por que existem nomes como "Mago" ou "Arquétipos"?',
        answer: isEn
          ? "These names are didactic metaphors used in personality studies. They help represent human patterns and carry no literal or spiritual meaning."
          : "Esses nomes são metáforas didáticas usadas em estudos de personalidade. Eles ajudam a representar padrões humanos, não têm sentido literal nem espiritual.",
      },
      {
        question: isEn
          ? "Does this replace spiritual direction or pastoral guidance?"
          : isPtPt
          ? "Isto substitui direção espiritual ou acompanhamento pastoral?"
          : "Isso substitui direção espiritual ou acompanhamento pastoral?",
        answer: isEn
          ? "No. Identity is a human tool for clarity and reflection. Spiritual direction and sacramental life remain irreplaceable."
          : isPtPt
          ? "Não. O Identity é uma ferramenta humana de clareza e reflexão. Direção espiritual e vida sacramental permanecem insubstituíveis."
          : "Não. O Identity é uma ferramenta humana de clareza e reflexão. Direção espiritual e vida sacramental permanecem insubstituíveis.",
      },
      {
        question: isEn
          ? "What is the real purpose of the journey?"
          : "Qual é o propósito real da jornada?",
        answer: isEn
          ? "To help each person see their identity, patterns, strengths, and practical growth paths more clearly."
          : isPtPt
          ? "Ajudar a pessoa a enxergar com mais clareza a sua identidade, padrões, forças e caminhos práticos de crescimento."
          : "Ajudar a pessoa a enxergar com mais clareza sua identidade, padrões, forças e caminhos práticos de crescimento.",
      },
      {
        question: isEn
          ? "Is this compatible with a Christian worldview?"
          : isPtPt
          ? "Isto é compatível com uma visão cristã?"
          : "Isso é compatível com uma visão cristã?",
        answer: isEn
          ? "Yes. Self-knowledge, when lived with humility and truth, is a path of inner maturity and can help us walk with greater awareness before God."
          : isPtPt
          ? "Sim. O autoconhecimento, quando vivido com humildade e verdade, é um caminho de amadurecimento interior e pode ajudar a caminhar com mais consciência diante de Deus."
          : "Sim. O autoconhecimento, quando vivido com humildade e verdade, é um caminho de amadurecimento interior e pode ajudar a caminhar com mais clareza e consciência diante de Deus.",
      },
    ],
  };
};

export function FaithFAQSection({ className }: FaithFAQSectionProps) {
  const { language } = useLanguage();
  const data = getFAQData(language);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{data.title}</h3>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {data.items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faith-faq-${index}`}
            className="border border-border/50 rounded-xl px-5 bg-background shadow-sm"
          >
            <AccordionTrigger className="py-4 text-left hover:no-underline">
              <span className="font-medium text-foreground text-sm pr-4">
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
