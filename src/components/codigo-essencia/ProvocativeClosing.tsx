import { MessageCircle } from "lucide-react";

interface ProvocativeClosingProps {
  /** Nova estrutura: mensagem única reflexiva (preferida) */
  finalMessage?: string;
  /** Legado: campos estruturados (serão ignorados se finalMessage existir) */
  whoYouAre?: string;
  riskOfNotLiving?: string;
  invitation?: string;
  paragraphs?: string[];
  language?: string;
}

export const ProvocativeClosing = ({ 
  finalMessage,
  whoYouAre, 
  riskOfNotLiving, 
  invitation, 
  paragraphs,
  language = 'pt' 
}: ProvocativeClosingProps) => {
  const labels = {
    pt: { title: 'Mensagem Final' },
    'pt-pt': { title: 'Mensagem Final' },
    en: { title: 'Final Message' },
  };

  const t = labels[language as keyof typeof labels] || labels.pt;

  // Nova estrutura preferida: mensagem única reflexiva (estilo Código do Casal)
  if (finalMessage) {
    return (
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-400">
          <MessageCircle className="w-4 h-4" />
          {t.title}
        </h3>
        <p className="text-sm leading-relaxed text-foreground/90">
          {finalMessage}
        </p>
      </div>
    );
  }

  // Fallback legado: estrutura antiga com who_you_are, risk_of_not_living, invitation
  const hasLegacyStructure = whoYouAre || riskOfNotLiving || invitation;
  
  if (!hasLegacyStructure && (!paragraphs || paragraphs.length === 0)) return null;

  const legacyLabels = {
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

  const tLegacy = legacyLabels[language as keyof typeof legacyLabels] || legacyLabels.pt;

  if (hasLegacyStructure) {
    return (
      <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-rose-500" />
          {tLegacy.title}
        </h3>
        
        {whoYouAre && (
          <div className="border-l-2 border-emerald-500 pl-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{tLegacy.who}</p>
            <p className="text-sm leading-relaxed">{whoYouAre}</p>
          </div>
        )}
        
        {riskOfNotLiving && (
          <div className="border-l-2 border-amber-500 pl-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
              {tLegacy.risk}
            </p>
            <p className="text-sm leading-relaxed">{riskOfNotLiving}</p>
          </div>
        )}
        
        {invitation && (
          <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">
              {tLegacy.invite}
            </p>
            <p className="text-sm font-medium leading-relaxed">{invitation}</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback to old paragraphs structure
  return (
    <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl p-4">
      <h3 className="font-bold text-sm mb-2">{tLegacy.title}</h3>
      {paragraphs?.slice(0, 2).map((p: string, i: number) => (
        <p key={i} className="text-sm leading-relaxed text-muted-foreground mb-2 last:mb-0">{p}</p>
      ))}
    </div>
  );
};
