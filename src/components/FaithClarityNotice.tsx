import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaithClarityNoticeProps {
  variant?: "default" | "compact" | "report";
  className?: string;
}

const content = {
  pt: {
    title: "Nota de Clareza e Fé",
    paragraphs: [
      "O Identity é uma jornada de autoconhecimento humano, baseada em ferramentas de psicologia, comportamento e comunicação.",
      'Alguns nomes usados nos perfis e arquétipos (como "Mago", "Sábio", "Criador") são apenas termos simbólicos e didáticos, presentes na literatura de desenvolvimento humano para representar padrões de personalidade.',
      "Eles não devem ser entendidos de forma literal, nem possuem qualquer sentido místico, esotérico ou espiritual.",
      "O objetivo aqui é simples: ajudar você a se conhecer melhor, amadurecer e caminhar com mais clareza e verdade diante de Deus.",
    ],
  },
  "pt-pt": {
    title: "Nota de Clareza e Fé",
    paragraphs: [
      "O Identity é uma jornada de autoconhecimento humano, baseada em ferramentas de psicologia, comportamento e comunicação.",
      'Alguns nomes usados nos perfis e arquétipos (como "Mago", "Sábio", "Criador") são apenas termos simbólicos e didáticos, presentes na literatura de desenvolvimento humano para representar padrões de personalidade.',
      "Não devem ser entendidos de forma literal, nem possuem qualquer sentido místico, esotérico ou espiritual.",
      "O objetivo aqui é simples: ajudá-lo a conhecer-se melhor, amadurecer e caminhar com mais clareza e verdade diante de Deus.",
    ],
  },
  en: {
    title: "Clarity & Faith Notice",
    paragraphs: [
      "Identity is a journey of human self-knowledge, based on psychology, behavior, and communication tools.",
      'Some names used in profiles and archetypes (such as "Magician", "Sage", "Creator") are merely symbolic and didactic terms found in human development literature to represent personality patterns.',
      "They should not be taken literally, nor do they carry any mystical, esoteric, or spiritual meaning.",
      "The goal here is simple: to help you know yourself better, mature, and walk with greater clarity and truth before God.",
    ],
  },
};

export function FaithClarityNotice({ variant = "default", className }: FaithClarityNoticeProps) {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.pt;

  if (variant === "compact") {
    return (
      <p className={cn("text-xs text-muted-foreground/80 text-center leading-relaxed", className)}>
        {t.paragraphs[0]} {t.paragraphs[2]}
      </p>
    );
  }

  if (variant === "report") {
    return (
      <div className={cn("border border-border/50 rounded-lg p-4 bg-muted/30 text-center", className)}>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {language === "en"
            ? "This report uses archetypes as psychological metaphors for easier understanding. They carry no literal or spiritual meaning."
            : "Este relatório utiliza arquétipos como metáforas psicológicas para facilitar compreensão. Não possuem sentido literal ou espiritual."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-border/60 bg-muted/20 p-5 md:p-6",
      className,
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-2.5">
          <h4 className="font-semibold text-sm text-foreground">{t.title}</h4>
          {t.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
