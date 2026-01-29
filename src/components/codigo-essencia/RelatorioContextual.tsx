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
  Mail,
  Baby,
  Users,
  Briefcase,
  UserCog,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { downloadRelatorioContextualPDF } from "@/lib/pdfRelatorioContextual";

// ===========================================
// TYPES
// ===========================================

export type ReportType = 'parceiro' | 'pai_para_filho' | 'filho_para_pai' | 'para_gestor' | 'para_equipe';

interface RelatorioContextualProps {
  reportType: ReportType;
  language: 'pt' | 'pt-pt' | 'en';
  hasSavedCodigo: boolean;
}

interface ReportConfig {
  icon: React.ReactNode;
  color: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  description: Record<string, string>;
  recipientLabel: Record<string, string>;
  recipientPlaceholder: Record<string, string>;
}

// ===========================================
// CONFIGURATIONS
// ===========================================

const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  parceiro: {
    icon: <Heart className="w-5 h-5" />,
    color: "text-pink-500",
    title: {
      pt: "Relatório para Parceiro(a)",
      'pt-pt': "Relatório para Parceiro(a)",
      en: "Partner Report"
    },
    subtitle: {
      pt: "Material para conversa honesta no relacionamento",
      'pt-pt': "Material para conversa honesta no relacionamento",
      en: "Material for honest conversation in the relationship"
    },
    description: {
      pt: "Este relatório é gerado a partir do seu Código da Essência e serve para ajudar seu parceiro(a) a entender você melhor.",
      'pt-pt': "Este relatório é gerado a partir do teu Código da Essência e serve para ajudar o teu parceiro(a) a entender-te melhor.",
      en: "This report is generated from your Essence Code and helps your partner understand you better."
    },
    recipientLabel: {
      pt: "Nome do parceiro(a) (opcional)",
      'pt-pt': "Nome do parceiro(a) (opcional)",
      en: "Partner name (optional)"
    },
    recipientPlaceholder: {
      pt: "Ex: Maria, João...",
      'pt-pt': "Ex: Maria, João...",
      en: "E.g.: Mary, John..."
    }
  },
  pai_para_filho: {
    icon: <Baby className="w-5 h-5" />,
    color: "text-blue-500",
    title: {
      pt: "Relatório para Meu(s) Filho(s)",
      'pt-pt': "Relatório para o(s) Meu(s) Filho(s)",
      en: "Report for My Children"
    },
    subtitle: {
      pt: "Ajude seus filhos a entenderem você",
      'pt-pt': "Ajuda os teus filhos a entenderem-te",
      en: "Help your children understand you"
    },
    description: {
      pt: "Este relatório ajuda seus filhos a entenderem como você ama, como você pode errar, e como construir uma relação mais saudável.",
      'pt-pt': "Este relatório ajuda os teus filhos a entenderem como amas, como podes errar, e como construir uma relação mais saudável.",
      en: "This report helps your children understand how you love, how you might fail, and how to build a healthier relationship."
    },
    recipientLabel: {
      pt: "Nome do filho(a) (opcional)",
      'pt-pt': "Nome do filho(a) (opcional)",
      en: "Child's name (optional)"
    },
    recipientPlaceholder: {
      pt: "Ex: Pedro, Ana...",
      'pt-pt': "Ex: Pedro, Ana...",
      en: "E.g.: Peter, Anna..."
    }
  },
  filho_para_pai: {
    icon: <Users className="w-5 h-5" />,
    color: "text-purple-500",
    title: {
      pt: "Relatório para Meus Pais",
      'pt-pt': "Relatório para os Meus Pais",
      en: "Report for My Parents"
    },
    subtitle: {
      pt: "Ajude seus pais a entenderem quem você está se tornando",
      'pt-pt': "Ajuda os teus pais a entenderem quem estás a tornar-te",
      en: "Help your parents understand who you're becoming"
    },
    description: {
      pt: "Este relatório ajuda seus pais a entenderem como você precisa ser amado agora, como adulto, e como apoiar sem sufocar.",
      'pt-pt': "Este relatório ajuda os teus pais a entenderem como precisas de ser amado agora, como adulto, e como apoiar sem sufocar.",
      en: "This report helps your parents understand how you need to be loved now, as an adult, and how to support without smothering."
    },
    recipientLabel: {
      pt: "Nome dos pais (opcional)",
      'pt-pt': "Nome dos pais (opcional)",
      en: "Parents' names (optional)"
    },
    recipientPlaceholder: {
      pt: "Ex: Mãe e Pai...",
      'pt-pt': "Ex: Mãe e Pai...",
      en: "E.g.: Mom and Dad..."
    }
  },
  para_gestor: {
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-amber-500",
    title: {
      pt: "Manual para Meu Gestor",
      'pt-pt': "Manual para o Meu Gestor",
      en: "Manager's Manual"
    },
    subtitle: {
      pt: "Ajude seu gestor a liderar você melhor",
      'pt-pt': "Ajuda o teu gestor a liderar-te melhor",
      en: "Help your manager lead you better"
    },
    description: {
      pt: "Este manual mostra suas forças, como receber feedback, o que te desmotiva e como extrair seu melhor no trabalho.",
      'pt-pt': "Este manual mostra as tuas forças, como receber feedback, o que te desmotiva e como extrair o teu melhor no trabalho.",
      en: "This manual shows your strengths, how to give you feedback, what demotivates you, and how to bring out your best at work."
    },
    recipientLabel: {
      pt: "Nome do gestor (opcional)",
      'pt-pt': "Nome do gestor (opcional)",
      en: "Manager's name (optional)"
    },
    recipientPlaceholder: {
      pt: "Ex: Carlos, Ana...",
      'pt-pt': "Ex: Carlos, Ana...",
      en: "E.g.: Carlos, Anna..."
    }
  },
  para_equipe: {
    icon: <UserCog className="w-5 h-5" />,
    color: "text-emerald-500",
    title: {
      pt: "Meu Estilo de Liderança",
      'pt-pt': "O Meu Estilo de Liderança",
      en: "My Leadership Style"
    },
    subtitle: {
      pt: "Ajude sua equipe a entender como você lidera",
      'pt-pt': "Ajuda a tua equipa a entender como lideras",
      en: "Help your team understand how you lead"
    },
    description: {
      pt: "Este documento mostra como você lidera quando está bem, como pode errar sob pressão, e como a equipe pode te ajudar.",
      'pt-pt': "Este documento mostra como lideras quando estás bem, como podes errar sob pressão, e como a equipa te pode ajudar.",
      en: "This document shows how you lead when at your best, how you might fail under pressure, and how the team can help you."
    },
    recipientLabel: {
      pt: "Nome da equipe (opcional)",
      'pt-pt': "Nome da equipa (opcional)",
      en: "Team name (optional)"
    },
    recipientPlaceholder: {
      pt: "Ex: Time de Produto...",
      'pt-pt': "Ex: Equipa de Produto...",
      en: "E.g.: Product Team..."
    }
  }
};

const TRANSLATIONS = {
  pt: {
    generateBtn: "Gerar Relatório",
    regenerateBtn: "Regenerar",
    generating: "Gerando relatório...",
    generatingSubtext: "Isso pode levar alguns segundos",
    shareTitle: "Compartilhar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    linkExpires: "Link válido por 30 dias",
    downloadPdf: "Baixar PDF",
    noCode: "Gere seu Código da Essência primeiro",
    noCodeDesc: "Para criar este relatório, você precisa ter gerado seu Código da Essência.",
    success: "Relatório gerado com sucesso!",
    error: "Erro ao gerar relatório",
  },
  'pt-pt': {
    generateBtn: "Gerar Relatório",
    regenerateBtn: "Regenerar",
    generating: "A gerar relatório...",
    generatingSubtext: "Pode demorar segundos",
    shareTitle: "Partilhar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    linkExpires: "Link válido por 30 dias",
    downloadPdf: "Transferir PDF",
    noCode: "Gera o teu Código da Essência primeiro",
    noCodeDesc: "Para criar este relatório, precisas de ter gerado o teu Código da Essência.",
    success: "Relatório gerado com sucesso!",
    error: "Erro ao gerar relatório",
  },
  en: {
    generateBtn: "Generate Report",
    regenerateBtn: "Regenerate",
    generating: "Generating report...",
    generatingSubtext: "This may take a few seconds",
    shareTitle: "Share",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    linkExpires: "Link valid for 30 days",
    downloadPdf: "Download PDF",
    noCode: "Generate your Essence Code first",
    noCodeDesc: "To create this report, you need to have generated your Essence Code.",
    success: "Report generated successfully!",
    error: "Error generating report",
  },
};

// Section icons mapping
const SECTION_ICONS: Record<string, React.ReactNode> = {
  abertura_etica: <Heart className="w-5 h-5 text-primary" />,
  abertura: <Heart className="w-5 h-5 text-primary" />,
  quem_ele_tenta_ser: <Target className="w-5 h-5 text-emerald-500" />,
  quem_estou_me_tornando: <Target className="w-5 h-5 text-emerald-500" />,
  como_eu_amo: <Heart className="w-5 h-5 text-pink-500" />,
  como_ama_em_paz: <Heart className="w-5 h-5 text-pink-500" />,
  como_preciso_ser_amado: <Heart className="w-5 h-5 text-pink-500" />,
  como_erra_sob_pressao: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  como_posso_errar: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  como_erro_sob_pressao: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  o_que_mais_machuca: <Shield className="w-5 h-5 text-blue-500" />,
  o_que_machuca: <Shield className="w-5 h-5 text-blue-500" />,
  o_que_espero: <Target className="w-5 h-5 text-purple-500" />,
  compromissos_de_mudanca: <Check className="w-5 h-5 text-emerald-600" />,
  meus_compromissos: <Check className="w-5 h-5 text-emerald-600" />,
  como_voce_pode_ajudar: <HelpCircle className="w-5 h-5 text-purple-500" />,
  como_apoiar_sem_sufocar: <HelpCircle className="w-5 h-5 text-purple-500" />,
  como_honrar_sem_se_anular: <Shield className="w-5 h-5 text-blue-500" />,
  como_me_ajudar: <HelpCircle className="w-5 h-5 text-purple-500" />,
  o_que_nao_deve_aceitar: <Ban className="w-5 h-5 text-red-500" />,
  o_que_desmotiva: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  minhas_forcas: <Sparkles className="w-5 h-5 text-emerald-500" />,
  como_dar_feedback: <MessageCircle className="w-5 h-5 text-blue-500" />,
  como_extrair_melhor: <Target className="w-5 h-5 text-primary" />,
  como_lidero_bem: <Sparkles className="w-5 h-5 text-emerald-500" />,
  perguntas_para_conversa: <MessageCircle className="w-5 h-5 text-primary" />,
  perguntas_para_1on1: <MessageCircle className="w-5 h-5 text-primary" />,
  perguntas_para_equipe: <MessageCircle className="w-5 h-5 text-primary" />,
  fechamento: <Heart className="w-5 h-5 text-primary" />,
};

// ===========================================
// COMPONENT
// ===========================================

export const RelatorioContextual = ({ reportType, language, hasSavedCodigo }: RelatorioContextualProps) => {
  const { user, profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [recipientName, setRecipientName] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const config = REPORT_CONFIGS[reportType];
  const t = TRANSLATIONS[language];
  const userName = profile?.full_name || (language === 'en' ? "User" : "Usuário");

  // Load existing report
  useEffect(() => {
    const loadReport = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("relatorios_contextuais")
          .select("*")
          .eq("user_id", user.id)
          .eq("report_type", reportType)
          .single();

        if (data && !error) {
          setReport(data);
          if (data.recipient_name) {
            setRecipientName(data.recipient_name);
          }
        }
      } catch (err) {
        console.error("Error loading report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [user?.id, reportType]);

  const handleGenerate = async () => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('nello-relatorio-contextual', {
        body: { 
          userId: user.id, 
          reportType,
          locale: language,
          recipientName: recipientName.trim() || undefined
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
    
    const typeSlug = reportType.replace(/_/g, '-');
    const basePath = language === 'en' ? `/en/report/${typeSlug}` : language === 'pt-pt' ? `/pt-pt/relatorio/${typeSlug}` : `/relatorio/${typeSlug}`;
    const link = `${window.location.origin}${basePath}/${report.public_token}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success(t.linkCopied);
    
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    if (!report?.content) return;
    
    try {
      downloadRelatorioContextualPDF({
        userName,
        recipientName: report.recipient_name || undefined,
        reportType,
        language,
        content: report.content
      });
      toast.success(language === 'en' ? 'PDF downloaded!' : 'PDF baixado!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error(language === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
    }
  };

  // Safe text rendering to prevent React Error #31
  const renderSafeItem = (item: any): React.ReactNode => {
    if (item == null) return null;
    if (typeof item === 'string') return item;
    if (typeof item === 'number' || typeof item === 'boolean') return String(item);
    
    if (typeof item === 'object') {
      const text = item.texto ?? item.conteudo ?? item.acao ?? item.situacao ?? 
                   item.descricao ?? item.resumo ?? item.titulo ?? item.mensagem;
      if (typeof text === 'string' && text.trim().length > 0) return text;
      try { return JSON.stringify(item); } catch { return '[objeto]'; }
    }
    return String(item);
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
              <span className="text-foreground/80">{renderSafeItem(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    // Handle objects that aren't arrays
    if (typeof content === 'object') {
      return <p className="text-foreground/80 whitespace-pre-line">{renderSafeItem(content)}</p>;
    }
    
    return null;
  };

  const renderSection = (sectionKey: string, section: any) => {
    if (!section) return null;
    
    const icon = SECTION_ICONS[sectionKey] || <MessageCircle className="w-5 h-5 text-primary" />;
    const title = section.titulo || section.title || sectionKey;
    
    // Handle different content structures
    let mainContent = section.conteudo || section.content;
    const hasCommitments = section.compromissos || section.commitments;
    const hasQuestions = section.perguntas || section.questions;
    const hasFeedback = section.feedback_positivo || section.feedback_corretivo;
    
    return (
      <Card key={sectionKey}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {section.introducao && (
            <p className="text-sm text-muted-foreground italic">{section.introducao}</p>
          )}
          
          {mainContent && renderContent(mainContent)}
          
          {hasFeedback && (
            <div className="space-y-3">
              {section.feedback_positivo && (
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">
                    {language === 'en' ? 'Positive feedback:' : 'Feedback positivo:'}
                  </p>
                  {renderContent(section.feedback_positivo)}
                </div>
              )}
              {section.feedback_corretivo && (
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    {language === 'en' ? 'Corrective feedback:' : 'Feedback corretivo:'}
                  </p>
                  {renderContent(section.feedback_corretivo)}
                </div>
              )}
            </div>
          )}
          
          {hasCommitments && (
            <ul className="space-y-2">
              {(section.compromissos || section.commitments).map((item: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{renderSafeItem(item)}</span>
                </li>
              ))}
            </ul>
          )}
          
          {hasQuestions && (
            <ul className="space-y-3">
              {(section.perguntas || section.questions).map((pergunta: any, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{renderSafeItem(pergunta)}</span>
                </li>
              ))}
            </ul>
          )}
          
          {section.nota_final && (
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
              {section.nota_final}
            </p>
          )}
        </CardContent>
      </Card>
    );
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
        <div className={`w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className={config.color}>{config.icon}</span>
        </div>
        <h2 className="text-xl font-bold mb-2">{config.title[language]}</h2>
        <p className="text-muted-foreground text-sm mb-6">{config.description[language]}</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-left">{config.recipientLabel[language]}</label>
          <Input 
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder={config.recipientPlaceholder[language]}
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

  // Get all section keys from content
  const sectionKeys = Object.keys(content).filter(key => 
    typeof content[key] === 'object' && content[key] !== null
  );

  return (
    <div className="space-y-6">
      {/* Header with share options */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{config.title[language]}</CardTitle>
                <p className="text-sm text-muted-foreground">{config.subtitle[language]}</p>
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
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                className="gap-1"
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? t.linkCopied : t.copyLink}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="gap-1"
              >
                <FileDown className="w-4 h-4" />
                {t.downloadPdf}
              </Button>
              <span className="text-xs text-muted-foreground">{t.linkExpires}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening text (abertura_etica or abertura) */}
      {(content.abertura_etica || content.abertura?.conteudo) && (
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground/80 italic whitespace-pre-line">
                {content.abertura_etica || content.abertura?.conteudo}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render all sections dynamically */}
      {sectionKeys
        .filter(key => key !== 'abertura_etica' && key !== 'abertura')
        .map(key => renderSection(key, content[key]))}
    </div>
  );
};

export default RelatorioContextual;
