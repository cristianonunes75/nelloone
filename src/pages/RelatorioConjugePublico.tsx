import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogoText } from "@/components/LogoText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Loader2, 
  Check, 
  AlertTriangle,
  MessageCircle,
  Shield,
  Target,
  HelpCircle,
  Ban,
  Lock,
  Clock,
} from "lucide-react";

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

const SECTION_TITLES: Record<string, string> = {
  quem_ele_tenta_ser: "Quem ele tenta ser",
  como_ama_em_paz: "Como ele costuma amar quando está em paz",
  como_erra_sob_pressao: "Como ele costuma errar quando está sob pressão",
  o_que_mais_machuca: "O que mais machuca ele",
  como_voce_pode_ajudar: "Como você pode ajudar",
  o_que_nao_deve_aceitar: "O que você não deve aceitar",
  compromissos_de_mudanca: "Compromissos de mudança",
  perguntas_para_conversa: "Perguntas para conversa",
  fechamento: "Fechamento"
};

const RelatorioConjugePublico = () => {
  const { token } = useParams<{ token: string }>();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'expired' | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      if (!token) {
        setError('not_found');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("relatorio_conjuge")
          .select("content, public_token_expires_at, is_public_active")
          .eq("public_token", token)
          .single();

        if (error || !data) {
          setError('not_found');
          setIsLoading(false);
          return;
        }

        // Check if expired
        if (!data.is_public_active || new Date(data.public_token_expires_at) < new Date()) {
          setError('expired');
          setIsLoading(false);
          return;
        }

        setReport(data);
      } catch (err) {
        console.error("Error loading report:", err);
        setError('not_found');
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [token]);

  const renderContent = (contentItem: any) => {
    if (!contentItem) return null;
    
    if (typeof contentItem === 'string') {
      // Split by newlines and render bullet points if lines start with "-"
      const lines = contentItem.split('\n').filter(Boolean);
      const hasBullets = lines.some(line => line.trim().startsWith('-'));
      
      if (hasBullets) {
        return (
          <ul className="space-y-2">
            {lines.map((line, i) => {
              const isBullet = line.trim().startsWith('-');
              const text = isBullet ? line.trim().substring(1).trim() : line.trim();
              return (
                <li key={i} className={isBullet ? "flex items-start gap-2" : ""}>
                  {isBullet && <span className="text-primary mt-1">•</span>}
                  <span className="text-foreground/80">{text}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      return <p className="text-foreground/80 whitespace-pre-line">{contentItem}</p>;
    }
    
    if (Array.isArray(contentItem)) {
      return (
        <ul className="space-y-2">
          {contentItem.map((item, i) => (
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

  // Helper to safely get section data (handles nested structure issues)
  const getSection = (key: string, content: any) => {
    const section = content[key];
    if (!section) return null;
    
    // If it's a string, wrap it in expected structure
    if (typeof section === 'string') {
      return { titulo: SECTION_TITLES[key] || key, conteudo: section };
    }
    
    // If it has titulo/conteudo, use as-is
    if (section.titulo || section.conteudo) {
      return {
        titulo: section.titulo || SECTION_TITLES[key] || key,
        conteudo: section.conteudo
      };
    }
    
    return section;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container px-4 py-4">
            <LogoText className="text-xl" variant="solid" />
          </div>
        </header>
        <main className="container px-4 py-16 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Relatório não encontrado</h1>
          <p className="text-muted-foreground">
            Este link pode estar incorreto ou o relatório foi removido.
          </p>
        </main>
      </div>
    );
  }

  if (error === 'expired') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container px-4 py-4">
            <LogoText className="text-xl" variant="solid" />
          </div>
        </header>
        <main className="container px-4 py-16 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link expirado</h1>
          <p className="text-muted-foreground">
            Este link de acesso ao relatório expirou. Peça ao seu cônjuge para gerar um novo link.
          </p>
        </main>
      </div>
    );
  }

  const content = report?.content || {};

  // Render a standard section card
  const renderSectionCard = (key: string, borderClass?: string, bgClass?: string) => {
    const section = getSection(key, content);
    if (!section) return null;

    return (
      <Card className={`${borderClass || ''} ${bgClass || ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {SECTION_ICONS[key]}
            <CardTitle className="text-base">{section.titulo}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent(section.conteudo)}
        </CardContent>
      </Card>
    );
  };

  // Special handling for o_que_mais_machuca (can be nested)
  const renderOQueMaisMachuca = () => {
    const rootSection = content.o_que_mais_machuca;
    const nestedSection = content.como_erra_sob_pressao?.o_que_mais_machuca;
    const sectionContent = rootSection || nestedSection;
    
    if (!sectionContent) return null;
    
    const section = typeof sectionContent === 'string' 
      ? { titulo: SECTION_TITLES.o_que_mais_machuca, conteudo: sectionContent }
      : sectionContent;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {SECTION_ICONS.o_que_mais_machuca}
            <CardTitle className="text-base">{section.titulo || SECTION_TITLES.o_que_mais_machuca}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent(section.conteudo || sectionContent)}
        </CardContent>
      </Card>
    );
  };

  // Special handling for compromissos_de_mudanca
  const renderCompromissos = () => {
    const section = content.compromissos_de_mudanca;
    if (!section) return null;
    
    // Handle both array and object formats
    const compromissos = section.compromissos || (Array.isArray(section) ? section : null);
    
    return (
      <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {SECTION_ICONS.compromissos_de_mudanca}
            <CardTitle className="text-base">{section.titulo || SECTION_TITLES.compromissos_de_mudanca}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {section.introducao && (
            <p className="text-sm text-muted-foreground mb-3">{section.introducao}</p>
          )}
          {compromissos && Array.isArray(compromissos) && (
            <ul className="space-y-2 mb-4">
              {compromissos.map((item: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{typeof item === 'string' ? item : (item.descricao || JSON.stringify(item))}</span>
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

  // Special handling for perguntas_para_conversa
  const renderPerguntas = () => {
    const section = content.perguntas_para_conversa;
    if (!section) return null;
    
    const perguntas = section.perguntas || (Array.isArray(section) ? section : null);
    
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {SECTION_ICONS.perguntas_para_conversa}
            <CardTitle className="text-base">{section.titulo || SECTION_TITLES.perguntas_para_conversa}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {perguntas && Array.isArray(perguntas) && (
            <ul className="space-y-3">
              {perguntas.map((pergunta: string, i: number) => (
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
    );
  };

  // Special handling for fechamento
  const renderFechamento = () => {
    const section = content.fechamento;
    if (!section) return null;
    
    const conteudo = typeof section === 'string' ? section : section.conteudo;
    const titulo = typeof section === 'string' ? SECTION_TITLES.fechamento : (section.titulo || SECTION_TITLES.fechamento);
    
    return (
      <Card className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/10 dark:to-purple-950/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {SECTION_ICONS.fechamento}
            <CardTitle className="text-base">{titulo}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 italic">{conteudo}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-center">
          <LogoText className="text-xl" variant="solid" />
        </div>
      </header>

      <main className="container px-4 py-8 max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Relatório para o Cônjuge</h1>
          <p className="text-muted-foreground text-sm">
            Material para conversa honesta no casamento
          </p>
        </div>

        <div className="space-y-6">
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

          {/* Standard Sections */}
          {renderSectionCard('quem_ele_tenta_ser')}
          {renderSectionCard('como_ama_em_paz')}
          {renderSectionCard('como_erra_sob_pressao', 'border-amber-200/50 dark:border-amber-800/30')}
          
          {/* Special Sections */}
          {renderOQueMaisMachuca()}
          {renderCompromissos()}
          {renderSectionCard('como_voce_pode_ajudar')}
          {renderSectionCard('o_que_nao_deve_aceitar', 'border-red-200/50 dark:border-red-800/30')}
          {renderPerguntas()}
          {renderFechamento()}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>Powered by <LogoText className="text-xs inline" variant="solid" /></p>
        </div>
      </main>
    </div>
  );
};

export default RelatorioConjugePublico;
