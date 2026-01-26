import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  AlertTriangle, 
  Users,
  Loader2,
  ExternalLink,
  Ship,
  Anchor,
  Sparkles,
  FileDown
} from "lucide-react";
import { toast } from "sonner";

type LangKey = 'pt' | 'pt-pt' | 'en';

// Normalize Identity v1.0 content to expected display format
const normalizeContent = (content: any): any => {
  if (!content) return {};
  
  const normalized = { ...content };
  
  // Map zona_harmonia/zona_sinergia/zona_ajuste/zona_choque to semaforo_relacional
  if (!normalized.semaforo_relacional && (normalized.zona_harmonia || normalized.zona_sinergia || normalized.zona_ajuste || normalized.zona_choque)) {
    const harmonia = normalized.zona_harmonia || normalized.zona_sinergia;
    normalized.semaforo_relacional = {
      titulo: "Semáforo Relacional",
      verde: harmonia ? {
        titulo: harmonia.titulo || "Zona de Harmonia",
        descricao: harmonia.descricao,
        pontos: harmonia.valores_compartilhados || harmonia.sinergias || harmonia.pontos || [],
        proposito: harmonia.proposito_comum
      } : null,
      amarelo: normalized.zona_ajuste ? {
        titulo: normalized.zona_ajuste.titulo || "Zona de Ajuste",
        descricao: normalized.zona_ajuste.descricao,
        pontos: normalized.zona_ajuste.diferencas?.map((d: any) => `${d.aspecto}: ${d.descricao}`) || normalized.zona_ajuste.pontos || []
      } : null,
      vermelho: normalized.zona_choque ? {
        titulo: normalized.zona_choque.titulo || "Zona de Choque",
        descricao: normalized.zona_choque.descricao,
        pontos: normalized.zona_choque.gatilhos?.map((g: any) => typeof g === 'string' ? g : g.descricao) || normalized.zona_choque.pontos || []
      } : null
    };
  }
  
  // Map metafora_central to encontro_essencias
  if (!normalized.encontro_essencias && normalized.metafora_central) {
    normalized.encontro_essencias = {
      titulo: "O Encontro das Essências",
      metafora: normalized.metafora_central.titulo,
      descricao: normalized.metafora_central.descricao
    };
  }
  
  return normalized;
};

const TRANSLATIONS = {
  pt: {
    loading: "Carregando...",
    error: "Erro ao carregar",
    notFound: "Relatório não encontrado",
    disabled: "Este link foi desativado pelo proprietário",
    expired: "Este link expirou",
    title: "Código do Casal",
    subtitle: "Relatório de Compatibilidade",
    downloadPdf: "Baixar PDF",
    viewFull: "Ver versão completa",
    sections: {
      semaforo_relacional: "Semáforo Relacional",
      encontro_essencias: "O Encontro das Essências",
      santo_bate: "Onde o Santo Bate",
      bicho_pega: "Onde o Bicho Pega",
      protocolo_paz: "Protocolo de Paz"
    },
    trafficLight: {
      verde: "Sinergia Natural",
      amarelo: "Atenção e Ajuste",
      vermelho: "Zona de Choque"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "Gerado com NELLO ONE"
  },
  'pt-pt': {
    loading: "A carregar...",
    error: "Erro ao carregar",
    notFound: "Relatório não encontrado",
    disabled: "Este link foi desativado pelo proprietário",
    expired: "Este link expirou",
    title: "Código do Casal",
    subtitle: "Relatório de Compatibilidade",
    downloadPdf: "Transferir PDF",
    viewFull: "Ver versão completa",
    sections: {
      semaforo_relacional: "Semáforo Relacional",
      encontro_essencias: "O Encontro das Essências",
      santo_bate: "Onde o Santo Bate",
      bicho_pega: "Onde o Bicho Pega",
      protocolo_paz: "Protocolo de Paz"
    },
    trafficLight: {
      verde: "Sinergia Natural",
      amarelo: "Atenção e Ajuste",
      vermelho: "Zona de Choque"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional.",
    footer: "Gerado com NELLO ONE"
  },
  en: {
    loading: "Loading...",
    error: "Error loading",
    notFound: "Report not found",
    disabled: "This link has been disabled by the owner",
    expired: "This link has expired",
    title: "Couple Code",
    subtitle: "Compatibility Report",
    downloadPdf: "Download PDF",
    viewFull: "View full version",
    sections: {
      semaforo_relacional: "Relational Traffic Light",
      encontro_essencias: "The Meeting of Essences",
      santo_bate: "Where You Connect",
      bicho_pega: "Where Friction Happens",
      protocolo_paz: "Peace Protocol"
    },
    trafficLight: {
      verde: "Natural Synergy",
      amarelo: "Attention and Adjustment",
      vermelho: "Shock Zone"
    },
    disclaimer: "This report is a symbolic tool for self-knowledge. It does not replace therapy or professional counseling.",
    footer: "Generated with NELLO ONE"
  }
};

export default function CruzamentoPublico() {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const pathLang = window.location.pathname.startsWith('/en') ? 'en' 
    : window.location.pathname.startsWith('/pt-pt') ? 'pt-pt' : 'pt';
  const lang: LangKey = (pathLang || language || 'pt') as LangKey;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.pt;

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) {
        setError(t.notFound);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('codigo_cruzamentos')
          .select('id, content, raw_content, is_public_active, public_expires_at, relationship_type, user_a_id, user_b_id')
          .eq('public_token', token)
          .single();

        if (fetchError || !data) {
          console.error('Fetch error:', fetchError);
          setError(t.notFound);
          setIsLoading(false);
          return;
        }

        // Check if active
        if (!data.is_public_active) {
          setError(t.disabled);
          setIsLoading(false);
          return;
        }

        // Check if expired
        if (data.public_expires_at && new Date(data.public_expires_at) < new Date()) {
          setError(t.expired);
          setIsLoading(false);
          return;
        }

        setReport(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching crossing:', err);
        setError(t.error);
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [token, t]);

  const handleDownloadPDF = async () => {
    if (!report) return;
    setIsGeneratingPdf(true);
    try {
      const { generateCodigoCasalPDF } = await import('@/lib/pdfCodigoCasal');
      generateCodigoCasalPDF(
        report.content || {}, 
        report.relationship_type || 'spouse',
        report.id,
        { language: lang }
      );
      toast.success(lang === 'en' ? 'PDF downloaded!' : 'PDF baixado!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error(lang === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{error}</h2>
            <p className="text-muted-foreground">
              {lang === 'en' 
                ? 'The report may have been removed or the link is incorrect.'
                : 'O relatório pode ter sido removido ou o link está incorreto.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalize content to handle Identity v1.0 format
  const rawContent = report?.content || {};
  const content = normalizeContent(rawContent);
  const semaforo = content.semaforo_relacional;
  const encontro = content.encontro_essencias || content.metafora_central;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-50/30 dark:to-pink-950/10">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-primary-foreground/80">{t.subtitle}</p>
          
          <Button
            variant="secondary"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="mt-6"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            {t.downloadPdf}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Boat Metaphor */}
        {content.metafora_barco && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Ship className="w-5 h-5" />
                {lang === 'en' ? 'The Boat Metaphor' : 'A Metáfora do Barco'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">{content.metafora_barco}</p>
            </CardContent>
          </Card>
        )}

        {/* Meeting of Essences */}
        {encontro && (
          <Card className="border-pink-200 bg-pink-50/50 dark:bg-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-600">
                <Sparkles className="w-5 h-5" />
                {encontro.titulo || t.sections.encontro_essencias}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {encontro.metafora && (
                <p className="text-center text-lg font-medium text-pink-600">
                  ✨ {encontro.metafora} ✨
                </p>
              )}
              {encontro.descricao && (
                <p className="text-muted-foreground">{encontro.descricao}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Traffic Light */}
        {semaforo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {semaforo.titulo || t.sections.semaforo_relacional}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Green Zone */}
              {semaforo.verde && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                    🟢 {semaforo.verde.titulo || t.trafficLight.verde}
                  </h4>
                  {semaforo.verde.descricao && (
                    <p className="text-sm text-muted-foreground mb-2">{semaforo.verde.descricao}</p>
                  )}
                  {semaforo.verde.pontos && (
                    <ul className="space-y-1 text-sm">
                      {semaforo.verde.pontos.map((point: string, i: number) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Yellow Zone */}
              {semaforo.amarelo && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                  <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                    🟡 {semaforo.amarelo.titulo || t.trafficLight.amarelo}
                  </h4>
                  {semaforo.amarelo.descricao && (
                    <p className="text-sm text-muted-foreground mb-2">{semaforo.amarelo.descricao}</p>
                  )}
                  {semaforo.amarelo.pontos && (
                    <ul className="space-y-1 text-sm">
                      {semaforo.amarelo.pontos.map((point: string, i: number) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Red Zone */}
              {semaforo.vermelho && (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200">
                  <h4 className="font-semibold text-rose-600 mb-2 flex items-center gap-2">
                    🔴 {semaforo.vermelho.titulo || t.trafficLight.vermelho}
                  </h4>
                  {semaforo.vermelho.descricao && (
                    <p className="text-sm text-muted-foreground mb-2">{semaforo.vermelho.descricao}</p>
                  )}
                  {semaforo.vermelho.pontos && (
                    <ul className="space-y-1 text-sm">
                      {semaforo.vermelho.pontos.map((point: string, i: number) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Where You Connect */}
        {content.santo_bate && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Heart className="w-5 h-5" />
                {content.santo_bate.titulo || t.sections.santo_bate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.santo_bate.descricao && (
                <p className="text-muted-foreground mb-4">{content.santo_bate.descricao}</p>
              )}
              {content.santo_bate.pontos && (
                <ul className="space-y-2">
                  {content.santo_bate.pontos.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Where Friction Happens */}
        {content.bicho_pega && (
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                {content.bicho_pega.titulo || t.sections.bicho_pega}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.bicho_pega.descricao && (
                <p className="text-muted-foreground mb-4">{content.bicho_pega.descricao}</p>
              )}
              {content.bicho_pega.pontos && (
                <ul className="space-y-2">
                  {content.bicho_pega.pontos.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500">!</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Peace Protocol */}
        {content.protocolo_paz && (
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Anchor className="w-5 h-5" />
                {content.protocolo_paz.titulo || t.sections.protocolo_paz}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.protocolo_paz.descricao && (
                <p className="text-muted-foreground mb-4">{content.protocolo_paz.descricao}</p>
              )}
              {content.protocolo_paz.regras && (
                <ul className="space-y-3">
                  {content.protocolo_paz.regras.map((regra: any, i: number) => (
                    <li key={i} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-medium">{regra.regra || regra}</p>
                      {regra.porque && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {lang === 'en' ? 'Why: ' : 'Por quê: '}{regra.porque}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>{t.disclaimer}</p>
          <p className="mt-2">{t.footer}</p>
        </div>
      </div>
    </div>
  );
}
