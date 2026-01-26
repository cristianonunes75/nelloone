import { useState, useEffect } from "react";
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
  Ship,
  Anchor,
  Sparkles,
  FileDown,
  Shield,
  Clock,
  HelpCircle,
  MessageCircle,
  Zap,
  Flame,
  Check
} from "lucide-react";
import { toast } from "sonner";

type LangKey = 'pt' | 'pt-pt' | 'en';

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

        if (!data.is_public_active) {
          setError(t.disabled);
          setIsLoading(false);
          return;
        }

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

  const content = report?.content || {};

  // Render components for each section
  const renderMetaforaCentral = () => {
    const metafora = content.metafora_central;
    if (!metafora) return null;

    return (
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-600">
            <Sparkles className="w-5 h-5" />
            {metafora.titulo || (lang === 'en' ? 'The Meeting of Essences' : 'O Encontro das Essências')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{metafora.descricao}</p>
        </CardContent>
      </Card>
    );
  };

  const renderPapeisIdentificados = () => {
    const papeis = content.papeis_identificados;
    if (!papeis) return null;

    return (
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <Users className="w-5 h-5" />
            {lang === 'en' ? 'Identified Roles' : 'Papéis Identificados'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {papeis.sensor_direcao && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                🧭 {lang === 'en' ? 'Direction Sensor' : 'Sensor de Direção'}
              </h4>
              <p className="font-medium">{papeis.sensor_direcao.nome}</p>
              <p className="text-sm text-muted-foreground mt-1">{papeis.sensor_direcao.justificativa}</p>
            </div>
          )}
          {papeis.condutor_curso && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                ⚓ {lang === 'en' ? 'Course Conductor' : 'Condutor de Curso'}
              </h4>
              <p className="font-medium">{papeis.condutor_curso.nome}</p>
              <p className="text-sm text-muted-foreground mt-1">{papeis.condutor_curso.justificativa}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderZonaHarmonia = () => {
    const zona = content.zona_harmonia;
    if (!zona) return null;

    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <span className="text-xl">🟢</span>
            {zona.titulo || (lang === 'en' ? 'Harmony Zone' : 'Zona de Harmonia')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zona.descricao && (
            <p className="text-muted-foreground">{zona.descricao}</p>
          )}
          {zona.valores_compartilhados && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                {lang === 'en' ? 'Shared Values' : 'Valores Compartilhados'}
              </h4>
              <ul className="space-y-2">
                {zona.valores_compartilhados.map((valor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span>{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {zona.proposito_comum && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                {lang === 'en' ? 'Common Purpose' : 'Propósito Comum'}
              </h4>
              <p>{zona.proposito_comum}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderZonaAjuste = () => {
    const zona = content.zona_ajuste;
    if (!zona) return null;

    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <span className="text-xl">🟡</span>
            {zona.titulo || (lang === 'en' ? 'Adjustment Zone' : 'Zona de Ajuste')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zona.descricao && (
            <p className="text-muted-foreground">{zona.descricao}</p>
          )}
          {zona.diferencas?.map((diff: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
              {/* Legacy format: aspecto + descricao */}
              {diff.aspecto && (
                <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  ⚡ {diff.aspecto}
                </h4>
              )}
              {/* v2.0 format: titulo */}
              {diff.titulo && !diff.aspecto && (
                <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  ⚡ {diff.titulo}
                </h4>
              )}
              {diff.descricao && (
                <p className="text-sm">{diff.descricao}</p>
              )}
              {/* v2.0 format: pessoa_a_faz + pessoa_b_faz */}
              {diff.pessoa_a_faz && (
                <div className="text-sm">
                  <strong className="text-purple-700 dark:text-purple-400">
                    🧭 {lang === 'en' ? 'Person A tends to:' : 'Sensor de Direção:'}
                  </strong>
                  <p className="text-foreground/80 mt-1">{diff.pessoa_a_faz}</p>
                  {diff.traducao_positiva_a && (
                    <p className="text-xs text-muted-foreground italic mt-1">→ {diff.traducao_positiva_a}</p>
                  )}
                </div>
              )}
              {diff.pessoa_b_faz && (
                <div className="text-sm mt-2">
                  <strong className="text-orange-700 dark:text-orange-400">
                    ⚓ {lang === 'en' ? 'Person B tends to:' : 'Condutor de Curso:'}
                  </strong>
                  <p className="text-foreground/80 mt-1">{diff.pessoa_b_faz}</p>
                  {diff.traducao_positiva_b && (
                    <p className="text-xs text-muted-foreground italic mt-1">→ {diff.traducao_positiva_b}</p>
                  )}
                </div>
              )}
              {/* v2.0 format: micro_acordo */}
              {diff.micro_acordo && (
                <div className="mt-3 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                    💡 {lang === 'en' ? 'Micro-agreement:' : 'Micro-acordo:'}
                  </p>
                  <p className="text-sm">{diff.micro_acordo}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderZonaChoque = () => {
    const zona = content.zona_choque;
    if (!zona) return null;

    return (
      <Card className="border-rose-200 bg-gradient-to-br from-rose-50/50 to-red-50/50 dark:from-rose-950/20 dark:to-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-600">
            <span className="text-xl">🔴</span>
            {zona.titulo || (lang === 'en' ? 'Shock Zone' : 'Zona de Choque')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zona.descricao && (
            <p className="text-muted-foreground italic">{zona.descricao}</p>
          )}
          
          {zona.ciclo_sombra && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <h4 className="font-medium text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                {lang === 'en' ? 'The Shadow Cycle' : 'O Ciclo de Sombra'}
              </h4>
              <p className="text-sm">{zona.ciclo_sombra}</p>
            </div>
          )}

          {zona.sensor_sob_estresse && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2">
                🧭 {zona.sensor_sob_estresse.nome} ({lang === 'en' ? 'Under Stress' : 'Sob Estresse'})
              </h4>
              <p className="text-sm mb-2">{zona.sensor_sob_estresse.comportamento}</p>
              {zona.sensor_sob_estresse.impacto_no_outro && (
                <p className="text-xs text-muted-foreground">
                  <strong>{lang === 'en' ? 'Impact:' : 'Impacto:'}</strong> {zona.sensor_sob_estresse.impacto_no_outro}
                </p>
              )}
            </div>
          )}

          {zona.condutor_sob_estresse && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">
                ⚓ {zona.condutor_sob_estresse.nome} ({lang === 'en' ? 'Under Stress' : 'Sob Estresse'})
              </h4>
              <p className="text-sm mb-2">{zona.condutor_sob_estresse.comportamento}</p>
              {zona.condutor_sob_estresse.impacto_no_outro && (
                <p className="text-xs text-muted-foreground">
                  <strong>{lang === 'en' ? 'Impact:' : 'Impacto:'}</strong> {zona.condutor_sob_estresse.impacto_no_outro}
                </p>
              )}
            </div>
          )}

          {zona.gatilhos && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <h4 className="font-medium text-rose-700 dark:text-rose-400 mb-2">
                {lang === 'en' ? 'Triggers' : 'Gatilhos'}
              </h4>
              <ul className="space-y-1">
                {zona.gatilhos.map((gatilho: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-rose-500">!</span>
                    <span>{typeof gatilho === 'string' ? gatilho : gatilho.descricao}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTabelaTraducao = () => {
    const tabela = content.tabela_traducao;
    if (!tabela) return null;

    // Support both v2.0 (traducoes_sensor/traducoes_condutor) and legacy (sensor/condutor) formats
    const sensorItems = tabela.traducoes_sensor?.traducoes || tabela.sensor || [];
    const condutorItems = tabela.traducoes_condutor?.traducoes || tabela.condutor || [];
    
    // Get titles from v2.0 format or use defaults
    const sensorTitle = tabela.traducoes_sensor?.titulo || (lang === 'en' ? 'When the Direction Sensor...' : 'Quando o Sensor de Direção...');
    const condutorTitle = tabela.traducoes_condutor?.titulo || (lang === 'en' ? 'When the Course Conductor...' : 'Quando o Condutor de Curso...');

    // If no data in either format, don't render
    if (sensorItems.length === 0 && condutorItems.length === 0) return null;

    return (
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <MessageCircle className="w-5 h-5" />
            {tabela.titulo || (lang === 'en' ? 'Translation Table' : 'Tabela de Tradução do Casal')}
          </CardTitle>
          {tabela.descricao && (
            <p className="text-sm text-muted-foreground italic">{tabela.descricao}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {sensorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-400">
                🧭 {sensorTitle}
              </h4>
              {sensorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm">
                  <span className="font-medium">{item.comportamento}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-purple-700 dark:text-purple-400">{item.significado || item.significa}</span>
                </div>
              ))}
            </div>
          )}

          {condutorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700 dark:text-orange-400">
                ⚓ {condutorTitle}
              </h4>
              {condutorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm">
                  <span className="font-medium">{item.comportamento}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-orange-700 dark:text-orange-400">{item.significado || item.significa}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderProtocoloPaz = () => {
    const protocolo = content.protocolo_paz;
    if (!protocolo) return null;

    // Support both v2.0 (tempo_sensor/tempo_condutor) and legacy (para_sensor/para_condutor) formats
    const tempoDuplo = protocolo.tempo_duplo;
    const tempoSensorText = tempoDuplo?.tempo_sensor || tempoDuplo?.para_sensor || '';
    const tempoCondutorText = tempoDuplo?.tempo_condutor || tempoDuplo?.para_condutor || '';

    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Shield className="w-5 h-5" />
            {protocolo.titulo || (lang === 'en' ? 'Peace Protocol' : 'Protocolo de Paz Unificado')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tempoDuplo && (tempoSensorText || tempoCondutorText) && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {tempoDuplo.titulo || '1. Tempo Duplo'}
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {tempoSensorText && (
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                      🧭 {lang === 'en' ? 'Direction Sensor' : 'Sensor de Direção'}
                    </p>
                    <p className="text-sm">{tempoSensorText}</p>
                  </div>
                )}
                {tempoCondutorText && (
                  <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                      ⚓ {lang === 'en' ? 'Course Conductor' : 'Condutor de Curso'}
                    </p>
                    <p className="text-sm">{tempoCondutorText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {protocolo.pergunta_recalibracao && protocolo.pergunta_recalibracao.pergunta && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                {protocolo.pergunta_recalibracao.titulo || '2. Pergunta de Recalibração'}
              </h4>
              <p className="text-sm italic font-medium text-center py-2 bg-emerald-500/10 rounded-lg px-4">
                "{protocolo.pergunta_recalibracao.pergunta}"
              </p>
            </div>
          )}

          {protocolo.proibicao_inferencia && protocolo.proibicao_inferencia.regras?.length > 0 && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <h4 className="font-semibold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {protocolo.proibicao_inferencia.titulo || '3. Proibição de Inferência'}
              </h4>
              <ul className="space-y-2">
                {protocolo.proibicao_inferencia.regras.map((regra: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-rose-500">✕</span>
                    <span>{regra}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {protocolo.regras?.map((regra: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                  {regra.numero || i + 1}
                </span>
                <h4 className="font-semibold">{regra.regra}</h4>
              </div>
              {regra.porque && (
                <p className="text-sm text-muted-foreground pl-9">
                  {lang === 'en' ? 'Why:' : 'Por quê:'} {regra.porque}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderAcaoPratica = () => {
    const acao = content.acao_pratica_24h;
    if (!acao) return null;

    // Support v2.0 format with passo_1, passo_2, passo_3
    const passos = [acao.passo_1, acao.passo_2, acao.passo_3].filter(Boolean);

    return (
      <Card className="border-emerald-300 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/30 dark:to-teal-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Zap className="w-5 h-5" />
            {acao.titulo || (lang === 'en' ? '24-Hour Practical Action' : 'Ação Prática Imediata')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {acao.descricao && (
            <p className="text-sm text-muted-foreground italic">{acao.descricao}</p>
          )}
          
          {/* v2.0 format: 3 passos */}
          {passos.length > 0 && (
            <div className="space-y-3">
              {passos.map((passo: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm">{passo}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Legacy format: single descricao action */}
          {passos.length === 0 && acao.acao && (
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">{acao.acao}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFechamento = () => {
    const fechamento = content.fechamento;
    if (!fechamento) return null;

    const titulo = typeof fechamento === 'object' ? fechamento.titulo : null;
    const mensagem = typeof fechamento === 'object' ? fechamento.mensagem : fechamento;

    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-pink-500/5">
        <CardContent className="pt-6 text-center space-y-3">
          {titulo && (
            <h3 className="font-semibold text-lg">{titulo}</h3>
          )}
          <p className="text-foreground/80 whitespace-pre-line font-medium leading-relaxed">{mensagem}</p>
        </CardContent>
      </Card>
    );
  };

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

      {/* Content - ALL SECTIONS */}
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 1. Metáfora Central / Encontro das Essências */}
        {renderMetaforaCentral()}
        
        {/* 2. Papéis Identificados (Sensor + Condutor) */}
        {renderPapeisIdentificados()}
        
        {/* 3. Zona de Harmonia (Verde) */}
        {renderZonaHarmonia()}
        
        {/* 4. Zona de Ajuste (Amarelo) */}
        {renderZonaAjuste()}
        
        {/* 5. Zona de Choque (Vermelho) */}
        {renderZonaChoque()}
        
        {/* 6. Tabela de Tradução */}
        {renderTabelaTraducao()}
        
        {/* 7. Protocolo de Paz */}
        {renderProtocoloPaz()}
        
        {/* 8. Ação Prática 24h */}
        {renderAcaoPratica()}
        
        {/* 9. Fechamento */}
        {renderFechamento()}

        {/* Disclaimer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>{t.disclaimer}</p>
          <p className="mt-2">{t.footer}</p>
        </div>
      </div>
    </div>
  );
}
