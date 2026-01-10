import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Heart, Baby, Users, Briefcase, AlertCircle } from "lucide-react";
import { LogoText } from "@/components/LogoText";

type ReportType = 'parceiro' | 'pai_para_filho' | 'filho_para_pai' | 'para_gestor' | 'para_equipe';

const REPORT_CONFIGS: Record<ReportType, {
  title: { pt: string; 'pt-pt': string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  parceiro: {
    title: { pt: "Relatório para Parceiro(a)", 'pt-pt': "Relatório para Parceiro(a)", en: "Partner Report" },
    icon: Heart,
    color: "text-rose-500"
  },
  pai_para_filho: {
    title: { pt: "Relatório para Meu(s) Filho(s)", 'pt-pt': "Relatório para o(s) Meu(s) Filho(s)", en: "Report for My Children" },
    icon: Baby,
    color: "text-blue-500"
  },
  filho_para_pai: {
    title: { pt: "Relatório para Meus Pais", 'pt-pt': "Relatório para os Meus Pais", en: "Report for My Parents" },
    icon: Users,
    color: "text-purple-500"
  },
  para_gestor: {
    title: { pt: "Manual para Meu Gestor", 'pt-pt': "Manual para o Meu Gestor", en: "Manager's Manual" },
    icon: Briefcase,
    color: "text-emerald-500"
  },
  para_equipe: {
    title: { pt: "Meu Estilo de Liderança", 'pt-pt': "O Meu Estilo de Liderança", en: "My Leadership Style" },
    icon: Users,
    color: "text-amber-500"
  }
};

const SECTION_LABELS: Record<string, { pt: string; 'pt-pt': string; en: string }> = {
  abertura: { pt: "Abertura", 'pt-pt': "Abertura", en: "Opening" },
  quem_tento_ser: { pt: "Quem estou tentando ser", 'pt-pt': "Quem estou a tentar ser", en: "Who I'm trying to be" },
  como_amo: { pt: "Como amo quando estou em paz", 'pt-pt': "Como amo quando estou em paz", en: "How I love when at peace" },
  como_erro: { pt: "Como erro sob pressão", 'pt-pt': "Como erro sob pressão", en: "How I fail under pressure" },
  compromissos: { pt: "Compromissos de mudança", 'pt-pt': "Compromissos de mudança", en: "Change commitments" },
  como_ajudar: { pt: "Como você pode me ajudar", 'pt-pt': "Como podes ajudar-me", en: "How you can help me" },
  nao_aceitar: { pt: "O que não deve aceitar de mim", 'pt-pt': "O que não deves aceitar de mim", en: "What not to accept from me" },
  perguntas: { pt: "Perguntas para conversa", 'pt-pt': "Perguntas para conversa", en: "Questions for conversation" },
  como_amo_voce: { pt: "Como amo você", 'pt-pt': "Como te amo", en: "How I love you" },
  como_posso_errar: { pt: "Como posso errar com você", 'pt-pt': "Como posso errar contigo", en: "How I might fail you" },
  o_que_espero: { pt: "O que espero de você", 'pt-pt': "O que espero de ti", en: "What I expect from you" },
  como_honrar: { pt: "Como honrar seus pais sem se anular", 'pt-pt': "Como honrar os teus pais sem te anulares", en: "How to honor your parents without losing yourself" },
  quem_estou_me_tornando: { pt: "Quem estou me tornando", 'pt-pt': "Quem estou a tornar-me", en: "Who I'm becoming" },
  como_preciso_ser_amado: { pt: "Como preciso ser amado agora", 'pt-pt': "Como preciso de ser amado agora", en: "How I need to be loved now" },
  o_que_machuca: { pt: "O que mais me machuca", 'pt-pt': "O que mais me magoa", en: "What hurts me most" },
  como_apoiar: { pt: "Como podem me apoiar", 'pt-pt': "Como podem apoiar-me", en: "How you can support me" },
  minhas_forcas: { pt: "Minhas forças no trabalho", 'pt-pt': "As minhas forças no trabalho", en: "My strengths at work" },
  como_dar_feedback: { pt: "Como me dar feedback", 'pt-pt': "Como me dar feedback", en: "How to give me feedback" },
  o_que_desmotiva: { pt: "O que me desmotiva", 'pt-pt': "O que me desmotiva", en: "What demotivates me" },
  como_extrair_melhor: { pt: "Como extrair meu melhor", 'pt-pt': "Como extrair o meu melhor", en: "How to get the best from me" },
  como_lidero: { pt: "Como lidero quando estou bem", 'pt-pt': "Como lidero quando estou bem", en: "How I lead when at my best" },
  como_erro_sob_pressao: { pt: "Como posso errar sob pressão", 'pt-pt': "Como posso errar sob pressão", en: "How I might fail under pressure" },
  como_me_ajudar: { pt: "Como podem me ajudar a liderar", 'pt-pt': "Como podem ajudar-me a liderar", en: "How you can help me lead" },
};

type LangKey = 'pt' | 'pt-pt' | 'en';

const RelatorioContextualPublico = () => {
  const { tipo, token } = useParams<{ tipo: string; token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string>("");

  // Detect language from URL or default to pt
  const pathLang = window.location.pathname.startsWith('/en') ? 'en' 
    : window.location.pathname.startsWith('/pt-pt') ? 'pt-pt' : 'pt';
  const lang: LangKey = pathLang as LangKey;

  // Map URL tipo to report_type
  const reportType = tipo?.replace(/-/g, '_') as ReportType;
  const config = REPORT_CONFIGS[reportType];

  useEffect(() => {
    const fetchReport = async () => {
      if (!token || !reportType || !config) {
        setError(lang === 'en' ? 'Invalid report link' : 'Link inválido');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch report by public token
        const { data, error: fetchError } = await supabase
          .from('relatorios_contextuais')
          .select('content, raw_content, user_id, is_public_active, public_token_expires_at')
          .eq('public_token', token)
          .eq('report_type', reportType)
          .single();

        if (fetchError || !data) {
          setError(lang === 'en' ? 'Report not found' : 'Relatório não encontrado');
          setIsLoading(false);
          return;
        }

        // Check if active and not expired
        if (!data.is_public_active) {
          setError(lang === 'en' ? 'This link has been disabled' : 'Este link foi desativado');
          setIsLoading(false);
          return;
        }

        if (data.public_token_expires_at && new Date(data.public_token_expires_at) < new Date()) {
          setError(lang === 'en' ? 'This link has expired' : 'Este link expirou');
          setIsLoading(false);
          return;
        }

        // Fetch author name
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user_id)
          .single();

        if (profileData?.full_name) {
          setAuthorName(profileData.full_name.split(' ')[0]);
        }

        setReport(data.content);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(lang === 'en' ? 'Error loading report' : 'Erro ao carregar relatório');
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [token, reportType, config, lang]);

  const renderContent = (content: string | string[] | undefined) => {
    if (!content) return null;
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">{error || 'Relatório não encontrado'}</h1>
        <p className="text-muted-foreground text-center mb-6">
          {lang === 'en' 
            ? 'The report you are looking for is not available.'
            : 'O relatório que você procura não está disponível.'}
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'en' ? 'Back to home' : 'Voltar ao início'}
        </Button>
      </div>
    );
  }

  const Icon = config.icon;
  const title = config.title[lang];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <LogoText className="h-8" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span>{authorName && `${lang === 'en' ? 'From' : 'De'} ${authorName}`}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Title Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full bg-card flex items-center justify-center mb-4 ${config.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {authorName && (
              <p className="text-muted-foreground">
                {lang === 'en' ? `Written by ${authorName}` : `Escrito por ${authorName}`}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Report Sections */}
        {report && Object.entries(report).map(([key, value]) => {
          if (!value || (typeof value === 'string' && !value.trim())) return null;
          
          const label = SECTION_LABELS[key]?.[lang] || key;
          
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {renderContent(value as string | string[])}
              </CardContent>
            </Card>
          );
        })}

        {/* Footer */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4">
            {lang === 'en' 
              ? 'Generated with Nello Essence Code'
              : 'Gerado com o Código da Essência Nello'}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            {lang === 'en' ? 'Discover your Essence Code' : 'Descubra seu Código da Essência'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RelatorioContextualPublico;
