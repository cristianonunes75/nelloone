import { MessageCircle, AlertTriangle, ArrowRight } from "lucide-react";

interface ProvocativeClosingProps {
  whoYouAre?: string;
  riskOfNotLiving?: string;
  invitation?: string;
  paragraphs?: string[];
  language?: string;
}

export const ProvocativeClosing = ({ 
  whoYouAre, 
  riskOfNotLiving, 
  invitation, 
  paragraphs,
  language = 'pt' 
}: ProvocativeClosingProps) => {
  // If we have the new structure
  const hasNewStructure = whoYouAre || riskOfNotLiving || invitation;
  
  // Fallback to old paragraphs structure
  if (!hasNewStructure && (!paragraphs || paragraphs.length === 0)) return null;

  const labels = {
    pt: { 
      title: 'Fechamento', 
      who: 'Quem você é',
      risk: 'O risco de não viver isso',
      invite: 'O convite'
    },
    'pt-pt': { 
      title: 'Fechamento', 
      who: 'Quem tu és',
      risk: 'O risco de não viveres isto',
      invite: 'O convite'
    },
    en: { 
      title: 'Closing', 
      who: 'Who you are',
      risk: 'The risk of not living this',
      invite: 'The invitation'
    },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  if (hasNewStructure) {
    return (
      <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-rose-500" />
          {t.title}
        </h3>
        
        {whoYouAre && (
          <div className="border-l-2 border-emerald-500 pl-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{t.who}</p>
            <p className="text-sm leading-relaxed">{whoYouAre}</p>
          </div>
        )}
        
        {riskOfNotLiving && (
          <div className="border-l-2 border-amber-500 pl-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t.risk}
            </p>
            <p className="text-sm leading-relaxed">{riskOfNotLiving}</p>
          </div>
        )}
        
        {invitation && (
          <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              {t.invite}
            </p>
            <p className="text-sm font-medium leading-relaxed">{invitation}</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback to old structure
  return (
    <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl p-4">
      <h3 className="font-bold text-sm mb-2">{t.title}</h3>
      {paragraphs?.slice(0, 2).map((p: string, i: number) => (
        <p key={i} className="text-sm leading-relaxed text-muted-foreground mb-2 last:mb-0">{p}</p>
      ))}
    </div>
  );
};
