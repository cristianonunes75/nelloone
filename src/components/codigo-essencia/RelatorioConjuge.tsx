import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw,
  Link,
  AlertTriangle,
  MessageCircle,
  Shield,
  Target,
  HelpCircle,
  Ban,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface RelatorioConjugeProps {
  language: 'pt' | 'pt-pt' | 'en';
  hasSavedCodigo: boolean;
}

const TRANSLATIONS = {
  pt: {
    title: "Relatório para o Cônjuge",
    subtitle: "Material para conversa honesta no casamento",
    description: "Este relatório é gerado a partir do seu Código da Essência e serve para ajudar seu cônjuge a entender você melhor.",
    generateBtn: "Gerar Relatório",
    regenerateBtn: "Regenerar",
    generating: "Gerando relatório...",
    generatingSubtext: "Isso pode levar alguns segundos",
    spouseNameLabel: "Nome do cônjuge (opcional)",
    spouseNamePlaceholder: "Ex: Maria, João...",
    shareTitle: "Compartilhar com o cônjuge",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    linkExpires: "Link válido por 30 dias",
    downloadPdf: "Baixar PDF",
    noCode: "Gere seu Código da Essência primeiro",
    noCodeDesc: "Para criar o Relatório para o Cônjuge, você precisa ter gerado seu Código da Essência.",
    success: "Relatório gerado com sucesso!",
    error: "Erro ao gerar relatório",
    sections: {
      abertura: "Abertura",
      quemTentaSer: "Quem ele está tentando ser",
      comoAma: "Como ama quando está em paz",
      comoErra: "Como erra sob pressão",
      oQueMachuca: "O que mais machuca nele",
      compromissos: "Compromissos de mudança",
      comoAjudar: "Como você pode ajudar",
      naoAceitar: "O que não deve aceitar",
      perguntas: "Perguntas para a conversa",
      fechamento: "Fechamento",
    }
  },
  'pt-pt': {
    title: "Relatório para o Cônjuge",
    subtitle: "Material para conversa honesta no casamento",
    description: "Este relatório é gerado a partir do teu Código da Essência e serve para ajudar o teu cônjuge a entender-te melhor.",
    generateBtn: "Gerar Relatório",
    regenerateBtn: "Regenerar",
    generating: "A gerar relatório...",
    generatingSubtext: "Pode demorar segundos",
    spouseNameLabel: "Nome do cônjuge (opcional)",
    spouseNamePlaceholder: "Ex: Maria, João...",
    shareTitle: "Partilhar com o cônjuge",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    linkExpires: "Link válido por 30 dias",
    downloadPdf: "Transferir PDF",
    noCode: "Gera o teu Código da Essência primeiro",
    noCodeDesc: "Para criar o Relatório para o Cônjuge, precisas de ter gerado o teu Código da Essência.",
    success: "Relatório gerado com sucesso!",
    error: "Erro ao gerar relatório",
    sections: {
      abertura: "Abertura",
      quemTentaSer: "Quem ele está a tentar ser",
      comoAma: "Como ama quando está em paz",
      comoErra: "Como erra sob pressão",
      oQueMachuca: "O que mais o magoa",
      compromissos: "Compromissos de mudança",
      comoAjudar: "Como podes ajudar",
      naoAceitar: "O que não deves aceitar",
      perguntas: "Perguntas para a conversa",
      fechamento: "Fechamento",
    }
  },
  en: {
    title: "Spouse Report",
    subtitle: "Material for honest conversation in marriage",
    description: "This report is generated from your Essence Code and helps your spouse understand you better.",
    generateBtn: "Generate Report",
    regenerateBtn: "Regenerate",
    generating: "Generating report...",
    generatingSubtext: "This may take a few seconds",
    spouseNameLabel: "Spouse name (optional)",
    spouseNamePlaceholder: "Ex: Mary, John...",
    shareTitle: "Share with spouse",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    linkExpires: "Link valid for 30 days",
    downloadPdf: "Download PDF",
    noCode: "Generate your Essence Code first",
    noCodeDesc: "To create the Spouse Report, you need to have generated your Essence Code.",
    success: "Report generated successfully!",
    error: "Error generating report",
    sections: {
      abertura: "Opening",
      quemTentaSer: "Who they're trying to be",
      comoAma: "How they love when at peace",
      comoErra: "How they make mistakes under pressure",
      oQueMachuca: "What hurts them most",
      compromissos: "Change commitments",
      comoAjudar: "How you can help",
      naoAceitar: "What you shouldn't accept",
      perguntas: "Questions for conversation",
      fechamento: "Closing",
    }
  },
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  abertura_etica: <Heart className="w-5 h-5 text-primary" />,
  quem_ele_tenta_ser: <Target className="w-5 h-5 text-emerald-500" />,
  como_ama_em_paz: <Heart className="w-5 h-5 text-pink-500" />,
  como_erra_sob_pressao: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  o_que_mais_machuca: <Shield className="w-5 h-5 text-blue-500" />,
  compromissos_de_mudanca: <Check className="w-5 h-5 text-emerald-600" />,
  como_voce_pode_ajudar: <HelpCircle className="w-5 h-5 text-purple-500" />,
  o_que_nao_deve_aceitar: <Ban className="w-5 h-5 text-red-500" />,
  perguntas_para_conversa: <MessageCircle className="w-5 h-5 text-primary" />,
  fechamento: <Heart className="w-5 h-5 text-primary" />,
};

export const RelatorioConjuge = ({ language, hasSavedCodigo }: RelatorioConjugeProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [spouseName, setSpouseName] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = TRANSLATIONS[language];

  // Load existing report
  useEffect(() => {
    const loadReport = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("relatorio_conjuge")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          setReport(data);
        }
      } catch (err) {
        console.error("Error loading report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('miguel-relatorio-conjuge', {
        body: { 
          userId: user.id, 
          locale: language,
          spouseName: spouseName.trim() || undefined
        }
      });

      if (error) throw error;
      
      if (data?.success && data?.report) {
        setReport(data.report);
        toast.success(t.success);
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("Error generating report:", err);
      toast.error(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!report?.public_token) return;
    
    const link = `${window.location.origin}/relatorio-conjuge/${report.public_token}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success(t.linkCopied);
    
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const renderContent = (content: any) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return <p className="text-foreground/80 whitespace-pre-line">{content}</p>;
    }
    
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-foreground/80">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasSavedCodigo) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{t.noCode}</h3>
        <p className="text-muted-foreground text-sm">{t.noCodeDesc}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground text-sm mb-6">{t.description}</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-left">{t.spouseNameLabel}</label>
          <Input 
            value={spouseName}
            onChange={(e) => setSpouseName(e.target.value)}
            placeholder={t.spouseNamePlaceholder}
            className="mb-4"
          />
        </div>
        
        <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.generating}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {t.generateBtn}
            </>
          )}
        </Button>
        {isGenerating && (
          <p className="text-xs text-muted-foreground mt-2">{t.generatingSubtext}</p>
        )}
      </div>
    );
  }

  const content = report.content || {};

  return (
    <div className="space-y-6">
      {/* Header with share options */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200/50 dark:border-pink-800/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setReport(null)}
              className="gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              {t.regenerateBtn}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background/80 rounded-lg p-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Link className="w-4 h-4" />
              {t.shareTitle}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                className="gap-1"
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? t.linkCopied : t.copyLink}
              </Button>
              <span className="text-xs text-muted-foreground">{t.linkExpires}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening */}
      {content.abertura_etica && (
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground/80 italic whitespace-pre-line">{content.abertura_etica}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {content.quem_ele_tenta_ser && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.quem_ele_tenta_ser}
              <CardTitle className="text-base">{content.quem_ele_tenta_ser.titulo || t.sections.quemTentaSer}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.quem_ele_tenta_ser.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.como_ama_em_paz && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.como_ama_em_paz}
              <CardTitle className="text-base">{content.como_ama_em_paz.titulo || t.sections.comoAma}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.como_ama_em_paz.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.como_erra_sob_pressao && (
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.como_erra_sob_pressao}
              <CardTitle className="text-base">{content.como_erra_sob_pressao.titulo || t.sections.comoErra}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.como_erra_sob_pressao.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.o_que_mais_machuca && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.o_que_mais_machuca}
              <CardTitle className="text-base">{content.o_que_mais_machuca.titulo || t.sections.oQueMachuca}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.o_que_mais_machuca.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.compromissos_de_mudanca && (
        <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.compromissos_de_mudanca}
              <CardTitle className="text-base">{content.compromissos_de_mudanca.titulo || t.sections.compromissos}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {content.compromissos_de_mudanca.introducao && (
              <p className="text-sm text-muted-foreground mb-3">{content.compromissos_de_mudanca.introducao}</p>
            )}
            {content.compromissos_de_mudanca.compromissos && (
              <ul className="space-y-2 mb-4">
                {content.compromissos_de_mudanca.compromissos.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {content.compromissos_de_mudanca.nota_final && (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                {content.compromissos_de_mudanca.nota_final}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {content.como_voce_pode_ajudar && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.como_voce_pode_ajudar}
              <CardTitle className="text-base">{content.como_voce_pode_ajudar.titulo || t.sections.comoAjudar}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.como_voce_pode_ajudar.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.o_que_nao_deve_aceitar && (
        <Card className="border-red-200/50 dark:border-red-800/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.o_que_nao_deve_aceitar}
              <CardTitle className="text-base">{content.o_que_nao_deve_aceitar.titulo || t.sections.naoAceitar}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content.o_que_nao_deve_aceitar.conteudo)}
          </CardContent>
        </Card>
      )}

      {content.perguntas_para_conversa && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.perguntas_para_conversa}
              <CardTitle className="text-base">{content.perguntas_para_conversa.titulo || t.sections.perguntas}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {content.perguntas_para_conversa.perguntas && (
              <ul className="space-y-3">
                {content.perguntas_para_conversa.perguntas.map((pergunta: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 bg-background/60 rounded-lg p-3">
                    <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-foreground/80">{pergunta}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {content.fechamento && (
        <Card className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/10 dark:to-purple-950/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {SECTION_ICONS.fechamento}
              <CardTitle className="text-base">{content.fechamento.titulo || t.sections.fechamento}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 italic">{content.fechamento.conteudo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
