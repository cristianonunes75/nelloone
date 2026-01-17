import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Activity, 
  Brain, 
  Briefcase, 
  Wallet, 
  Sparkles, 
  Users,
  AlertCircle
} from "lucide-react";

export interface ConvitesObservacao {
  abertura: string;
  corpo_movimento: {
    leitura: string;
    convite: string;
  };
  mente_energia: {
    leitura: string;
    convite: string;
  };
  profissional_criativo: {
    leitura: string;
    convite: string;
  };
  dinheiro_sustentacao: {
    leitura: string;
    convite: string;
  };
  espiritualidade_sentido: {
    leitura: string;
    convite: string;
  };
  relacional_apoio: {
    leitura: string;
    convite: string;
  };
  fechamento: string;
  disclaimer: string;
}

interface ObservationInvitationsSectionProps {
  convites: ConvitesObservacao;
  language?: string;
}

const labels = {
  pt: {
    title: "Convites de Observação",
    subtitle: "Alinhamento com a Essência",
    corpoMovimento: "Corpo e Movimento",
    menteEnergia: "Mente e Energia",
    profissionalCriativo: "Profissional e Criativo",
    dinheiroSustentacao: "Dinheiro e Sustentação",
    espiritualidadeSentido: "Espiritualidade e Sentido",
    relacionalApoio: "Relacional e Apoio",
    convite: "Convite reflexivo",
    principioFinal: "Princípio Final",
    principioTexto: "Quando a vida é vivida em coerência com a essência, o esforço deixa de ser violência e passa a ser construção."
  },
  "pt-pt": {
    title: "Convites de Observação",
    subtitle: "Alinhamento com a Essência",
    corpoMovimento: "Corpo e Movimento",
    menteEnergia: "Mente e Energia",
    profissionalCriativo: "Profissional e Criativo",
    dinheiroSustentacao: "Dinheiro e Sustentação",
    espiritualidadeSentido: "Espiritualidade e Sentido",
    relacionalApoio: "Relacional e Apoio",
    convite: "Convite reflexivo",
    principioFinal: "Princípio Final",
    principioTexto: "Quando a vida é vivida em coerência com a essência, o esforço deixa de ser violência e passa a ser construção."
  },
  en: {
    title: "Observation Invitations",
    subtitle: "Alignment with Essence",
    corpoMovimento: "Body and Movement",
    menteEnergia: "Mind and Energy",
    profissionalCriativo: "Professional and Creative",
    dinheiroSustentacao: "Money and Sustenance",
    espiritualidadeSentido: "Spirituality and Meaning",
    relacionalApoio: "Relational and Support",
    convite: "Reflective invitation",
    principioFinal: "Final Principle",
    principioTexto: "When life is lived in coherence with essence, effort stops being violence and becomes construction."
  }
};

const areas = [
  { key: 'corpo_movimento', icon: Activity, color: 'rose' },
  { key: 'mente_energia', icon: Brain, color: 'violet' },
  { key: 'profissional_criativo', icon: Briefcase, color: 'blue' },
  { key: 'dinheiro_sustentacao', icon: Wallet, color: 'emerald' },
  { key: 'espiritualidade_sentido', icon: Sparkles, color: 'amber' },
  { key: 'relacional_apoio', icon: Users, color: 'cyan' }
] as const;

const labelKeyMap = {
  corpo_movimento: 'corpoMovimento',
  mente_energia: 'menteEnergia',
  profissional_criativo: 'profissionalCriativo',
  dinheiro_sustentacao: 'dinheiroSustentacao',
  espiritualidade_sentido: 'espiritualidadeSentido',
  relacional_apoio: 'relacionalApoio'
} as const;

export function ObservationInvitationsSection({ convites, language = "pt" }: ObservationInvitationsSectionProps) {
  const t = labels[language as keyof typeof labels] || labels.pt;

  if (!convites) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 overflow-hidden">
        <CardContent className="pt-8 pb-8 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{t.title}</h2>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
          </div>
        </CardContent>
      </Card>

      {/* Opening Text */}
      {convites.abertura && (
        <Card className="bg-gradient-to-br from-slate-500/5 to-slate-500/10 border-slate-500/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed italic text-center">
              {convites.abertura}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Life Areas */}
      <div className="space-y-4">
        {areas.map(({ key, icon: Icon, color }) => {
          const area = convites[key];
          if (!area) return null;

          const labelKey = labelKeyMap[key];
          const areaLabel = t[labelKey as keyof typeof t] as string;

          return (
            <Card key={key} className={`border-${color}-500/30 bg-gradient-to-br from-${color}-500/5 to-transparent`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-500`} />
                  </div>
                  {areaLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-foreground leading-relaxed">{area.leitura}</p>
                <div className={`bg-${color}-500/10 border border-${color}-500/20 rounded-lg p-3`}>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{t.convite}:</p>
                  <p className="text-sm leading-relaxed italic">{area.convite}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Closing */}
      {convites.fechamento && (
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border-indigo-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium leading-relaxed">
              {convites.fechamento}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      {convites.disclaimer && (
        <Card className="border-slate-500/30 bg-slate-500/5">
          <CardContent className="pt-4 pb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {convites.disclaimer}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Final Principle */}
      <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2">
            {t.principioFinal}
          </p>
          <p className="text-lg font-medium leading-relaxed italic">
            {t.principioTexto}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
