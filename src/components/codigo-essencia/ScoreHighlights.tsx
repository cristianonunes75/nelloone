interface ScoreHighlightsProps {
  highlights: string[];
  rarityNote?: string;
  language?: string;
}

export const ScoreHighlights = ({ highlights, rarityNote, language = "pt" }: ScoreHighlightsProps) => {
  const labels = {
    pt: { title: "Seus Números" },
    "pt-pt": { title: "Os Teus Números" },
    en: { title: "Your Numbers" },
  };
  const t = labels[language as keyof typeof labels] || labels.pt;

  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{t.title}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {highlights.map((h, i) => (
          <span 
            key={i} 
            className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold"
          >
            {h}
          </span>
        ))}
      </div>

      {rarityNote && (
        <p className="text-sm text-primary/80 italic bg-primary/5 rounded-lg px-3 py-2">
          💎 {rarityNote}
        </p>
      )}
    </div>
  );
};
