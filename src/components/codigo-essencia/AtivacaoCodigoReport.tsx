import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Eye, 
  AlertTriangle, 
  Target, 
  CheckCircle2, 
  MessageSquare, 
  Shield, 
  Calendar,
  Quote,
  Heart,
  Share2
} from "lucide-react";

export interface AtivacaoReport {
  leitura_conexao: {
    titulo: string;
    coerencia: string;
    conflito: string;
    conclusao: string;
  };
  padrao_sabotagem: {
    nome_padrao: string;
    como_se_forma: string;
    como_manifesta_hoje: string;
    porque_repete: string;
  };
  posicionamento_contra_si: {
    como_tenta_se_vender: string;
    conflito_com_essencia: string;
    custo: string;
  };
  ativacao_pratica: {
    ajustes_atitude: string[];
    ajuste_linguagem: string;
    limite_necessario: string;
    decisao_7_dias: {
      acao: string;
      porque: string;
    };
  };
  declaracao_ativacao: string;
  fechamento: string;
}

interface AtivacaoCodigoReportProps {
  report: AtivacaoReport;
  userName?: string;
  language?: string;
}

const labels = {
  pt: {
    title: "Relatório de Ativação",
    subtitle: "do Código da Essência",
    section1: "Leitura de Conexão",
    coerencia: "Onde há coerência",
    conflito: "Onde há conflito",
    section2: "Padrão Central de Sabotagem",
    comoForma: "Como se forma",
    comoManifesta: "Como se manifesta hoje",
    porqueRepete: "Por que se repete",
    section3: "Como Você se Posiciona Contra Si",
    comoVende: "Como você tenta se vender",
    conflitoEssencia: "O conflito com sua essência",
    custo: "O custo que você paga",
    section4: "Ativação Prática",
    ajustesAtitude: "3 Ajustes de Atitude",
    ajusteLinguagem: "Ajuste de Linguagem",
    limiteNecessario: "Limite Necessário",
    decisao7Dias: "Decisão para os Próximos 7 Dias",
    porque: "Por quê",
    section5: "Sua Declaração de Ativação",
    section6: "Fechamento",
    share: "Compartilhar"
  },
  "pt-pt": {
    title: "Relatório de Ativação",
    subtitle: "do Código da Essência",
    section1: "Leitura de Conexão",
    coerencia: "Onde há coerência",
    conflito: "Onde há conflito",
    section2: "Padrão Central de Sabotagem",
    comoForma: "Como se forma",
    comoManifesta: "Como se manifesta hoje",
    porqueRepete: "Por que se repete",
    section3: "Como se Posiciona Contra Si",
    comoVende: "Como tenta vender-se",
    conflitoEssencia: "O conflito com a sua essência",
    custo: "O custo que paga",
    section4: "Ativação Prática",
    ajustesAtitude: "3 Ajustes de Atitude",
    ajusteLinguagem: "Ajuste de Linguagem",
    limiteNecessario: "Limite Necessário",
    decisao7Dias: "Decisão para os Próximos 7 Dias",
    porque: "Porquê",
    section5: "A Sua Declaração de Ativação",
    section6: "Fechamento",
    share: "Partilhar"
  },
  en: {
    title: "Activation Report",
    subtitle: "of the Essence Code",
    section1: "Connection Reading",
    coerencia: "Where there is coherence",
    conflito: "Where there is conflict",
    section2: "Central Self-Sabotage Pattern",
    comoForma: "How it forms",
    comoManifesta: "How it manifests today",
    porqueRepete: "Why it repeats",
    section3: "How You Position Against Yourself",
    comoVende: "How you try to sell yourself",
    conflitoEssencia: "The conflict with your essence",
    custo: "The cost you pay",
    section4: "Practical Activation",
    ajustesAtitude: "3 Attitude Adjustments",
    ajusteLinguagem: "Language Adjustment",
    limiteNecessario: "Necessary Limit",
    decisao7Dias: "Decision for the Next 7 Days",
    porque: "Why",
    section5: "Your Activation Statement",
    section6: "Closing",
    share: "Share"
  }
};

export function AtivacaoCodigoReport({ report, userName, language = "pt" }: AtivacaoCodigoReportProps) {
  const t = labels[language as keyof typeof labels] || labels.pt;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.title} - ${userName || "NELLO ONE"}`,
          text: report.declaracao_ativacao
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 overflow-hidden">
        <CardContent className="pt-8 pb-8 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-1">{t.title}</h1>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            {userName && <p className="text-amber-600 font-medium mt-2">{userName}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Leitura de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            {t.section1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">{t.coerencia}</h4>
            <p className="text-muted-foreground leading-relaxed">{report.leitura_conexao.coerencia}</p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">{t.conflito}</h4>
            <p className="text-muted-foreground leading-relaxed">{report.leitura_conexao.conflito}</p>
          </div>
          <p className="text-foreground leading-relaxed font-medium">{report.leitura_conexao.conclusao}</p>
        </CardContent>
      </Card>

      {/* Section 2: Padrão de Sabotagem */}
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            {t.section2}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-red-600">{report.padrao_sabotagem.nome_padrao}</p>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{t.comoForma}</h4>
              <p className="leading-relaxed">{report.padrao_sabotagem.como_se_forma}</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{t.comoManifesta}</h4>
              <p className="leading-relaxed">{report.padrao_sabotagem.como_manifesta_hoje}</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{t.porqueRepete}</h4>
              <p className="leading-relaxed">{report.padrao_sabotagem.porque_repete}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Posicionamento Contra Si */}
      <Card className="border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            {t.section3}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-purple-600">{t.comoVende}</h4>
            <p className="text-muted-foreground leading-relaxed">{report.posicionamento_contra_si.como_tenta_se_vender}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-purple-600">{t.conflitoEssencia}</h4>
            <p className="text-muted-foreground leading-relaxed">{report.posicionamento_contra_si.conflito_com_essencia}</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-1">{t.custo}</h4>
            <p className="leading-relaxed">{report.posicionamento_contra_si.custo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Ativação Prática */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            {t.section4}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ajustes de Atitude */}
          <div className="space-y-3">
            <h4 className="font-semibold text-emerald-600">{t.ajustesAtitude}</h4>
            <div className="space-y-2">
              {report.ativacao_pratica.ajustes_atitude.map((ajuste, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-background/80 rounded-lg p-3 border border-emerald-500/20">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed">{ajuste}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ajuste de Linguagem */}
          <div className="bg-background/80 rounded-lg p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-600">{t.ajusteLinguagem}</h4>
            </div>
            <p className="leading-relaxed">{report.ativacao_pratica.ajuste_linguagem}</p>
          </div>

          {/* Limite Necessário */}
          <div className="bg-background/80 rounded-lg p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-600">{t.limiteNecessario}</h4>
            </div>
            <p className="leading-relaxed">{report.ativacao_pratica.limite_necessario}</p>
          </div>

          {/* Decisão 7 Dias */}
          <div className="bg-emerald-500/15 rounded-xl p-5 border-2 border-emerald-500/40">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <h4 className="font-bold text-emerald-600 text-lg">{t.decisao7Dias}</h4>
            </div>
            <p className="font-semibold text-lg mb-2">✅ {report.ativacao_pratica.decisao_7_dias.acao}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{t.porque}:</span> {report.ativacao_pratica.decisao_7_dias.porque}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Declaração de Ativação */}
      <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <Quote className="w-5 h-5 text-white" />
            </div>
            {t.section5}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-xl md:text-2xl font-bold text-center py-6 px-4 italic">
            "{report.declaracao_ativacao}"
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 6: Fechamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            {t.section6}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{report.fechamento}</p>
        </CardContent>
      </Card>

      {/* Share Button */}
      {navigator.share && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            {t.share}
          </Button>
        </div>
      )}
    </div>
  );
}
