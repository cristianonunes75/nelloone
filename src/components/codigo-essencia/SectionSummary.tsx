import { Lightbulb } from "lucide-react";

interface SectionSummaryProps {
  summary?: string;
  language?: string;
}

export const SectionSummary = ({ summary, language = 'pt' }: SectionSummaryProps) => {
  if (!summary) return null;

  const label = language === 'en' ? 'In summary:' : 'Em resumo:';

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3 flex items-start gap-2">
      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <span className="text-xs font-semibold text-primary">{label}</span>
        <p className="text-sm text-foreground/90 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};
