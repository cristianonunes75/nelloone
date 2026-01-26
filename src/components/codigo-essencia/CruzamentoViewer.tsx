import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Heart, 
  AlertTriangle, 
  Target, 
  Check, 
  HelpCircle,
  MessageCircle,
  Users,
  Copy,
  Zap,
  Shield,
  Lightbulb,
  HandHeart,
  Clock,
  ExternalLink,
  Sparkles,
  Flame,
  Scale,
  FileDown,
  Ship,
  Anchor
} from "lucide-react";
import { toast } from "sonner";
import { SynergyRadarChart } from "./SynergyRadarChart";
import { CouplePaywall } from "./CouplePaywall";

interface CruzamentoViewerProps {
  crossing: {
    id: string;
    content: any;
    relationship_type: string;
    public_token: string;
    is_public_active: boolean;
    isPurchased?: boolean;
  };
  language: 'pt' | 'pt-pt' | 'en';
  onBack: () => void;
  onPurchase?: () => void;
}

const TRANSLATIONS = {
  pt: {
    back: "Voltar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    download: "Baixar PDF",
    relationshipLabels: {
      spouse: "Código do Casal",
      parent_child: "Código Familiar",
      siblings: "Código Fraternal",
      friends: "Código de Amizade"
    },
    sections: {
      semaforo_relacional: "Semáforo Relacional",
      encontro_essencias: "O Encontro das Essências",
      potencializacao: "Onde Vocês se Potencializam",
      tabela_traducao: "Tabela de Tradução do Casal",
      manual_conjuge_a: "Manual do Cônjuge",
      manual_conjuge_b: "Manual do Cônjuge",
      alertas_pressao: "Alertas de Pressão",
      desafio_conexao: "Desafio de Conexão 24h",
      quando_buscar_ajuda: "Quando Procurar Ajuda",
      cta_ativacao: "Próximo Passo",
      santo_bate: "Onde o Santo Bate",
      bicho_pega: "Onde o Bicho Pega",
      protocolo_paz: "Protocolo de Paz Unificado",
      grafico_sobreposicao: "Gráfico de Sobreposição",
      // Legacy sections for backwards compatibility
      perfil_conjunto: "Vocês como casal",
      dinamica_familiar: "A dinâmica entre vocês",
      dinamica_fraternal: "A relação entre vocês",
      harmonias: "Onde vocês se encontram",
      forcas_da_relacao: "Forças da relação",
      complementaridades: "Onde vocês se complementam",
      tensoes: "Onde podem existir atritos",
      pontos_de_atencao: "Pontos de atenção",
      atritos_tipicos: "Atritos típicos",
      desafios_tipicos: "Desafios típicos",
      compromissos_usuario_a: "Compromissos",
      compromissos_usuario_b: "Compromissos",
      como_o_pai_pode_apoiar: "Como apoiar melhor",
      como_o_filho_pode_comunicar: "Como comunicar melhor",
      como_melhorar: "Como melhorar a relação",
      perguntas_para_casal: "Perguntas para conversarem",
      perguntas_para_conversa: "Perguntas para conversa",
      perguntas: "Perguntas para refletir"
    },
    trafficLight: {
      verde: "Sinergia Natural",
      amarelo: "Atenção e Ajuste",
      vermelho: "Zona de Choque"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Você sente",
      truthBehind: "A Verdade por trás"
    },
    manual: {
      orientations: "Orientações",
      disarmWords: "Palavras que desarmam"
    },
    peaceProtocol: {
      rule: "Regra",
      why: "Por quê"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automática",
      riskSituation: "Situação de risco"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional."
  },
  'pt-pt': {
    back: "Voltar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    download: "Transferir PDF",
    relationshipLabels: {
      spouse: "Código do Casal",
      parent_child: "Código Familiar",
      siblings: "Código Fraternal",
      friends: "Código de Amizade"
    },
    sections: {
      semaforo_relacional: "Semáforo Relacional",
      encontro_essencias: "O Encontro das Essências",
      potencializacao: "Onde Vocês se Potencializam",
      tabela_traducao: "Tabela de Tradução do Casal",
      manual_conjuge_a: "Manual do Cônjuge",
      manual_conjuge_b: "Manual do Cônjuge",
      alertas_pressao: "Alertas de Pressão",
      desafio_conexao: "Desafio de Conexão 24h",
      quando_buscar_ajuda: "Quando Procurar Ajuda",
      cta_ativacao: "Próximo Passo",
      santo_bate: "Onde o Santo Bate",
      bicho_pega: "Onde o Bicho Pega",
      protocolo_paz: "Protocolo de Paz Unificado",
      grafico_sobreposicao: "Gráfico de Sobreposição",
      perfil_conjunto: "Vocês como casal",
      dinamica_familiar: "A dinâmica entre vocês",
      dinamica_fraternal: "A relação entre vocês",
      harmonias: "Onde vocês se encontram",
      forcas_da_relacao: "Forças da relação",
      complementaridades: "Onde vocês se complementam",
      tensoes: "Onde podem existir atritos",
      pontos_de_atencao: "Pontos de atenção",
      atritos_tipicos: "Atritos típicos",
      desafios_tipicos: "Desafios típicos",
      compromissos_usuario_a: "Compromissos",
      compromissos_usuario_b: "Compromissos",
      como_o_pai_pode_apoiar: "Como apoiar melhor",
      como_o_filho_pode_comunicar: "Como comunicar melhor",
      como_melhorar: "Como melhorar a relação",
      perguntas_para_casal: "Perguntas para conversarem",
      perguntas_para_conversa: "Perguntas para conversa",
      perguntas: "Perguntas para refletir"
    },
    trafficLight: {
      verde: "Sinergia Natural",
      amarelo: "Atenção e Ajuste",
      vermelho: "Zona de Choque"
    },
    translationTable: {
      whenDoes: "Quando faz/diz",
      youFeel: "Você sente",
      truthBehind: "A Verdade por trás"
    },
    manual: {
      orientations: "Orientações",
      disarmWords: "Palavras que desarmam"
    },
    peaceProtocol: {
      rule: "Regra",
      why: "Por quê"
    },
    pressureAlerts: {
      behavior: "Comportamento",
      autoDefense: "Defesa automática",
      riskSituation: "Situação de risco"
    },
    disclaimer: "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional."
  },
  en: {
    back: "Back",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    download: "Download PDF",
    relationshipLabels: {
      spouse: "Couple's Code",
      parent_child: "Family Code",
      siblings: "Sibling Code",
      friends: "Friendship Code"
    },
    sections: {
      semaforo_relacional: "Relational Traffic Light",
      encontro_essencias: "The Meeting of Essences",
      potencializacao: "Where You Empower Each Other",
      tabela_traducao: "Couple Translation Table",
      manual_conjuge_a: "Spouse Manual",
      manual_conjuge_b: "Spouse Manual",
      alertas_pressao: "Pressure Alerts",
      desafio_conexao: "24h Connection Challenge",
      quando_buscar_ajuda: "When to Seek Help",
      cta_ativacao: "Next Step",
      santo_bate: "Where You Click",
      bicho_pega: "Where You Clash",
      protocolo_paz: "Unified Peace Protocol",
      grafico_sobreposicao: "Overlap Chart",
      perfil_conjunto: "You as a couple",
      dinamica_familiar: "The dynamic between you",
      dinamica_fraternal: "Your relationship",
      harmonias: "Where you meet",
      forcas_da_relacao: "Relationship strengths",
      complementaridades: "Where you complement each other",
      tensoes: "Where friction may exist",
      pontos_de_atencao: "Points of attention",
      atritos_tipicos: "Typical friction points",
      desafios_tipicos: "Typical challenges",
      compromissos_usuario_a: "Commitments",
      compromissos_usuario_b: "Commitments",
      como_o_pai_pode_apoiar: "How to better support",
      como_o_filho_pode_comunicar: "How to better communicate",
      como_melhorar: "How to improve",
      perguntas_para_casal: "Questions to discuss",
      perguntas_para_conversa: "Questions for conversation",
      perguntas: "Questions to reflect on"
    },
    trafficLight: {
      verde: "Natural Synergy",
      amarelo: "Attention & Adjustment",
      vermelho: "Shock Zone"
    },
    translationTable: {
      whenDoes: "When does/says",
      youFeel: "You feel",
      truthBehind: "The Truth behind"
    },
    manual: {
      orientations: "Guidance",
      disarmWords: "Words that disarm"
    },
    peaceProtocol: {
      rule: "Rule",
      why: "Why"
    },
    pressureAlerts: {
      behavior: "Behavior",
      autoDefense: "Auto defense",
      riskSituation: "Risk situation"
    },
    disclaimer: "This report is a symbolic tool for self-knowledge. It does not replace therapy or professional counseling."
  }
};

export const CruzamentoViewer = ({ crossing, language, onBack, onPurchase }: CruzamentoViewerProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [liveCrossing, setLiveCrossing] = useState(crossing);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Keep local copy updated when parent passes a new crossing
  useEffect(() => {
    setLiveCrossing(crossing);
  }, [crossing]);

  const content = useMemo(() => {
    const c = (liveCrossing as any)?.content;
    return c && typeof c === "object" ? c : {};
  }, [liveCrossing]);

  const hasReportContent = useMemo(() => {
    // Any known key indicates we have a renderable report
    const keys = Object.keys(content || {});
    if (keys.length === 0) return false;
    const knownKeys = [
      "metafora_barco",
      "zona_harmonia",
      "zona_ajuste",
      "zona_choque",
      "tabela_traducao",
      "protocolo_paz",
      "semaforo_relacional",
      "encontro_essencias",
      "potencializacao",
    ];
    return knownKeys.some((k) => (content as any)?.[k] != null);
  }, [content]);

  const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

  const isPurchased = liveCrossing.isPurchased !== false; // Default to true for backwards compatibility

  const refreshCrossing = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("codigo_cruzamentos")
        .select("*")
        .eq("id", liveCrossing.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setLiveCrossing((prev) => ({ ...prev, ...(data as any) }));
      }
    } catch (e) {
      console.error("Error refreshing crossing:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // After regeneration, content can be temporarily empty while the backend updates.
  // Auto-refresh a few times to avoid blank screens.
  useEffect(() => {
    if (hasReportContent) return;

    let cancelled = false;
    let attempts = 0;

    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      await refreshCrossing();
      if (cancelled) return;
      if (attempts < 5 && !hasReportContent) {
        window.setTimeout(tick, 1200);
      }
    };

    // Small delay gives time for the regeneration request to finish updating the row.
    const id = window.setTimeout(tick, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveCrossing.id, hasReportContent]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/cruzamento/${liveCrossing.public_token}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success(t.linkCopied);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const { generateCodigoCasalPDF } = await import('@/lib/pdfCodigoCasal');
      
      generateCodigoCasalPDF(
        content,
        liveCrossing.relationship_type,
        liveCrossing.id,
        { language }
      );
      
      toast.success(language === 'en' ? 'PDF downloaded!' : 'PDF baixado!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(language === 'en' ? 'Error generating PDF' : 'Erro ao gerar PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ============== TRAFFIC LIGHT SECTION ==============
  const renderTrafficLight = () => {
    const semaforo = content.semaforo_relacional;
    if (!semaforo) return null;

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">{semaforo.titulo || t.sections.semaforo_relacional}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Green */}
          {semaforo.verde && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟢</span>
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">{semaforo.verde.titulo || t.trafficLight.verde}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{semaforo.verde.descricao}</p>
              <ul className="space-y-1">
                {semaforo.verde.pontos?.map((ponto: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Yellow */}
          {semaforo.amarelo && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🟡</span>
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">{semaforo.amarelo.titulo || t.trafficLight.amarelo}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{semaforo.amarelo.descricao}</p>
              <ul className="space-y-1">
                {semaforo.amarelo.pontos?.map((ponto: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red */}
          {semaforo.vermelho && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔴</span>
                <h4 className="font-semibold text-red-700 dark:text-red-400">{semaforo.vermelho.titulo || t.trafficLight.vermelho}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{semaforo.vermelho.descricao}</p>
              <ul className="space-y-1">
                {semaforo.vermelho.pontos?.map((ponto: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 mt-0.5 text-red-500" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== SYNERGY RADAR CHART ==============
  const renderSynergyRadarChart = () => {
    const dados = content.dados_grafico;
    if (!dados?.usuario_a || !dados?.usuario_b) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">{t.sections.grafico_sobreposicao}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <SynergyRadarChart
            profileA={{
              name: dados.usuario_a.nome,
              disc: dados.usuario_a.disc
            }}
            profileB={{
              name: dados.usuario_b.nome,
              disc: dados.usuario_b.disc
            }}
            language={language}
          />
        </CardContent>
      </Card>
    );
  };

  // ============== ONDE O SANTO BATE ==============
  const renderSantoBate = () => {
    const santo = content.santo_bate;
    if (!santo) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">{santo.titulo || t.sections.santo_bate}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {santo.descricao && (
            <p className="text-sm text-muted-foreground">{santo.descricao}</p>
          )}
          {santo.areas?.map((area: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">✨ {area.titulo}</h4>
              <p className="text-sm text-foreground/80">{area.descricao}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== ONDE O BICHO PEGA ==============
  const renderBichoPega = () => {
    const bicho = content.bicho_pega;
    if (!bicho) return null;

    return (
      <Card className="border-amber-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">{bicho.titulo || t.sections.bicho_pega}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {bicho.descricao && (
            <p className="text-sm text-muted-foreground">{bicho.descricao}</p>
          )}
          {bicho.atritios?.map((atrito: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400">⚡ {atrito.titulo}</h4>
              <p className="text-sm text-foreground/80">{atrito.descricao}</p>
              {atrito.como_lidar && (
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">💡 Como lidar: </span>
                    {atrito.como_lidar}
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== PROTOCOLO DE PAZ UNIFICADO ==============
  const renderProtocoloPaz = () => {
    const protocolo = content.protocolo_paz;
    if (!protocolo) return null;

    return (
      <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">{protocolo.titulo || t.sections.protocolo_paz}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {protocolo.descricao && (
            <p className="text-sm text-muted-foreground italic">{protocolo.descricao}</p>
          )}
          {protocolo.regras?.map((regra: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                  {regra.numero || i + 1}
                </span>
                <h4 className="font-semibold text-foreground">{regra.regra}</h4>
              </div>
              {regra.porque && (
                <p className="text-sm text-muted-foreground pl-9">{t.peaceProtocol.why}: {regra.porque}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== MEETING OF ESSENCES ==============
  const renderMeetingOfEssences = () => {
    const encontro = content.encontro_essencias;
    if (!encontro) return null;

    return (
      <Card className="bg-gradient-to-br from-primary/5 via-pink-500/5 to-purple-500/5 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base">{encontro.titulo || t.sections.encontro_essencias}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {encontro.metafora && (
            <div className="text-center py-4 border-b border-primary/10">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
                ✨ {encontro.metafora} ✨
              </p>
            </div>
          )}
          <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{encontro.descricao}</p>
        </CardContent>
      </Card>
    );
  };

  // ============== POTENTIALIZATION ==============
  const renderPotentialization = () => {
    const pot = content.potencializacao;
    if (!pot) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">{pot.titulo || t.sections.potencializacao}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/80 whitespace-pre-line">{pot.descricao}</p>
          {pot.forcas && (
            <ul className="space-y-2 mt-4">
              {asArray<string>(pot.forcas).map((forca: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-1 text-pink-500" />
                  <span className="text-foreground/80">{forca}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== TRANSLATION TABLE ==============
  const renderTranslationTable = () => {
    const tabela = content.tabela_traducao;
    if (!tabela) return null;

    const renderTranslations = (translations: any[], title: string) => {
      if (!translations?.length) return null;
      
      return (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
          {translations.map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-[100px]">{t.translationTable.whenDoes}:</span>
                <span className="text-sm">{item.quando_faz || item.quando_diz}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 min-w-[100px]">{t.translationTable.youFeel}:</span>
                <span className="text-sm">{item.voce_sente || item.outro_ouve || item.filho_ouve || item.pai_ouve}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-primary min-w-[100px]">{t.translationTable.truthBehind}:</span>
                <span className="text-sm font-medium">{item.verdade_por_tras || item.intencao_real}</span>
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">{tabela.titulo || t.sections.tabela_traducao}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {tabela.descricao && (
            <p className="text-sm text-muted-foreground italic">{tabela.descricao}</p>
          )}
          {renderTranslations(tabela.traducoes_usuario_a, tabela.traducoes_usuario_a?.[0]?.quando_diz?.split(' ')?.[2] || 'Pessoa A')}
          {renderTranslations(tabela.traducoes_usuario_b, tabela.traducoes_usuario_b?.[0]?.quando_diz?.split(' ')?.[2] || 'Pessoa B')}
          {renderTranslations(tabela.traducoes_pai, 'Pai/Mãe')}
          {renderTranslations(tabela.traducoes_filho, 'Filho(a)')}
          {renderTranslations(tabela.traducoes_a, 'Irmão(ã) A')}
          {renderTranslations(tabela.traducoes_b, 'Irmão(ã) B')}
        </CardContent>
      </Card>
    );
  };

  // ============== SPOUSE MANUAL ==============
  const renderSpouseManual = (manual: any, key: string) => {
    if (!manual) return null;

    return (
      <Card key={key}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HandHeart className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-base">{manual.titulo || t.sections[key as keyof typeof t.sections]}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {manual.orientacoes && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t.manual.orientations}</h4>
              <ul className="space-y-2">
                {asArray<string>(manual.orientacoes).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 text-purple-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {manual.palavras_desarmam && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">{t.manual.disarmWords}</h4>
              <div className="flex flex-wrap gap-2">
                {asArray<string>(manual.palavras_desarmam).map((palavra: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/20 rounded-full text-sm text-emerald-700 dark:text-emerald-300">
                    "{palavra}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PRESSURE ALERTS ==============
  const renderPressureAlerts = () => {
    const alertas = content.alertas_pressao;
    if (!alertas) return null;

    return (
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">{alertas.titulo || t.sections.alertas_pressao}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertas.descricao && (
            <p className="text-sm text-muted-foreground">{alertas.descricao}</p>
          )}
          {alertas.gatilhos?.map((gatilho: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 min-w-[120px]">{t.pressureAlerts.behavior}:</span>
                <span className="text-sm">{gatilho.comportamento}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-red-600 dark:text-red-400 min-w-[120px]">{t.pressureAlerts.autoDefense}:</span>
                <span className="text-sm">{gatilho.defesa_automatica}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-[120px]">{t.pressureAlerts.riskSituation}:</span>
                <span className="text-sm">{gatilho.situacao_risco}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== CONNECTION CHALLENGE ==============
  const renderConnectionChallenge = () => {
    const desafio = content.desafio_conexao || content.desafio_conexao_familiar;
    if (!desafio) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">{desafio.titulo || t.sections.desafio_conexao}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {desafio.descricao && (
            <p className="text-sm text-muted-foreground mb-3">{desafio.descricao}</p>
          )}
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">{desafio.acao}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============== WHEN TO SEEK HELP ==============
  const renderSeekHelp = () => {
    const ajuda = content.quando_buscar_ajuda;
    if (!ajuda) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">{ajuda.titulo || t.sections.quando_buscar_ajuda}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {ajuda.descricao && (
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{ajuda.descricao}</p>
          )}
          <ul className="space-y-2">
            {ajuda.sugestoes?.map((sugestao: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ExternalLink className="w-4 h-4 mt-0.5 text-blue-500" />
                <span>{sugestao}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  // ============== LEGACY SECTION RENDERER ==============
  const renderLegacySection = (key: string, data: any) => {
    if (!data) return null;
    
    // Skip new format sections (they have dedicated renderers)
    const newFormatKeys = [
      'semaforo_relacional', 'encontro_essencias', 'potencializacao', 
      'tabela_traducao', 'manual_conjuge_a', 'manual_conjuge_b',
      'alertas_pressao', 'desafio_conexao', 'quando_buscar_ajuda',
      'cta_ativacao', 'abertura', 'fechamento', 'desafio_conexao_familiar',
      'tabela_traducao_familiar', 'tabela_traducao_fraternal',
      'dados_grafico', 'santo_bate', 'bicho_pega', 'protocolo_paz',
      // Identity v1.0 new fields
      'metafora_barco', 'zona_harmonia', 'zona_ajuste', 'zona_choque',
      'acao_pratica_24h'
    ];
    
    if (newFormatKeys.includes(key)) return null;
    
    const title = data.titulo || t.sections[key as keyof typeof t.sections] || key;
    
    const contentField = data.resumo || data.conteudo || data.pontos || data.compromissos || 
                        data.sugestoes || data.perguntas || data.situacoes;
    
    if (!contentField) return null;

    const renderContent = (content: any) => {
      if (typeof content === 'string') {
        return <p className="text-foreground/80 whitespace-pre-line">{content}</p>;
      }
      if (Array.isArray(content)) {
        return (
          <ul className="space-y-2">
            {content.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        );
      }
      return null;
    };
    
    return (
      <Card key={key}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent(contentField)}
        </CardContent>
      </Card>
    );
  };

  // ============== CTA ACTIVATION ==============
  const renderCtaActivation = () => {
    const cta = content.cta_ativacao;
    if (!cta) return null;

    return (
      <Card className="bg-gradient-to-br from-primary/10 to-pink-500/10 border-primary/30">
        <CardContent className="pt-6 text-center">
          <h3 className="font-semibold mb-2">{cta.titulo || t.sections.cta_ativacao}</h3>
          <p className="text-sm text-muted-foreground">{cta.descricao}</p>
        </CardContent>
      </Card>
    );
  };

  // ============== BOAT METAPHOR INTRO (Identity v1.0) ==============
  const renderBoatMetaphor = () => {
    // First check if we have AI-generated metafora_barco
    const metaforaBarco = content.metafora_barco;
    if (metaforaBarco) {
      return (
        <Card className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Ship className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  {metaforaBarco.titulo || (language === 'en' ? 'The Boat Metaphor' : 'A Metáfora do Barco')}
                </h3>
                <p className="text-foreground/80 italic">{metaforaBarco.texto}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Fallback to hardcoded metaphor
    const metaphorText = {
      pt: {
        title: "A Metáfora do Barco",
        text: "O relacionamento não é um porto seguro — é um barco em mar aberto. Vocês são os navegadores. Este relatório é o mapa e a bússola que vão ajudá-los a ajustar as velas quando a tempestade vier."
      },
      'pt-pt': {
        title: "A Metáfora do Barco",
        text: "O relacionamento não é um porto seguro — é um barco em mar aberto. Vocês são os navegadores. Este relatório é o mapa e a bússola que vos vão ajudar a ajustar as velas quando a tempestade vier."
      },
      en: {
        title: "The Boat Metaphor",
        text: "A relationship isn't a safe harbor — it's a boat on open water. You are the navigators. This report is the map and compass that will help you adjust the sails when the storm comes."
      }
    };

    const m = metaphorText[language];

    return (
      <Card className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Ship className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">{m.title}</h3>
              <p className="text-foreground/80 italic">{m.text}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============== ZONA HARMONIA (Identity v1.0) ==============
  const renderZonaHarmonia = () => {
    const zona = content.zona_harmonia;
    if (!zona) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🟢</span>
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-400">
              {zona.titulo || (language === 'en' ? 'Harmony Zone' : 'Zona de Harmonia')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {zona.descricao && (
            <p className="text-sm text-muted-foreground">{zona.descricao}</p>
          )}
          {zona.valores_compartilhados && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2 text-sm">
                {language === 'en' ? 'Shared Values' : 'Valores Compartilhados'}
              </h4>
              <ul className="space-y-1">
                {asArray<string>(zona.valores_compartilhados).map((valor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span>{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {zona.proposito_comum && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-1 text-sm">
                {language === 'en' ? 'Common Purpose' : 'Propósito Comum'}
              </h4>
              <p className="text-sm">{zona.proposito_comum}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== ZONA AJUSTE (Identity v1.0) ==============
  const renderZonaAjuste = () => {
    const zona = content.zona_ajuste;
    if (!zona) return null;

    return (
      <Card className="border-amber-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🟡</span>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              {zona.titulo || (language === 'en' ? 'Adjustment Zone' : 'Zona de Ajuste')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {zona.descricao && (
            <p className="text-sm text-muted-foreground">{zona.descricao}</p>
          )}
          {zona.diferencas?.map((diff: any, i: number) => (
            <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1 text-sm">
                ⚡ {diff.aspecto}
              </h4>
              <p className="text-sm">{diff.descricao}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== ZONA CHOQUE (Identity v1.0) ==============
  const renderZonaChoque = () => {
    const zona = content.zona_choque;
    if (!zona) return null;

    return (
      <Card className="border-red-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔴</span>
            <CardTitle className="text-base text-red-700 dark:text-red-400">
              {zona.titulo || (language === 'en' ? 'Shock Zone (Under Pressure)' : 'Zona de Choque (Sob Pressão)')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {zona.descricao && (
            <p className="text-sm text-muted-foreground italic">{zona.descricao}</p>
          )}
          
          {/* Shadow Cycle */}
          {zona.ciclo_sombra && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4" />
                {language === 'en' ? 'The Shadow Cycle' : 'O Ciclo de Sombra'}
              </h4>
              <p className="text-sm">{zona.ciclo_sombra}</p>
            </div>
          )}

          {/* Sensor under stress */}
          {zona.sensor_sob_estresse && (
            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2 text-sm">
                🧭 {zona.sensor_sob_estresse?.nome || (language === 'en' ? 'Direction Sensor' : 'Sensor de Direção')}
                {" "}({language === 'en' ? 'Direction Sensor' : 'Sensor de Direção'})
              </h4>
              {zona.sensor_sob_estresse?.comportamento && (
                <p className="text-sm mb-2">{zona.sensor_sob_estresse.comportamento}</p>
              )}
              {zona.sensor_sob_estresse?.impacto_no_outro && (
                <p className="text-xs text-muted-foreground">
                  <strong>{language === 'en' ? 'Impact:' : 'Impacto:'}</strong> {zona.sensor_sob_estresse.impacto_no_outro}
                </p>
              )}
            </div>
          )}

          {/* Conductor under stress */}
          {zona.condutor_sob_estresse && (
            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2 text-sm">
                ⚓ {zona.condutor_sob_estresse?.nome || (language === 'en' ? 'Course Conductor' : 'Condutor de Curso')}
                {" "}({language === 'en' ? 'Course Conductor' : 'Condutor de Curso'})
              </h4>
              {zona.condutor_sob_estresse?.comportamento && (
                <p className="text-sm mb-2">{zona.condutor_sob_estresse.comportamento}</p>
              )}
              {zona.condutor_sob_estresse?.impacto_no_outro && (
                <p className="text-xs text-muted-foreground">
                  <strong>{language === 'en' ? 'Impact:' : 'Impacto:'}</strong> {zona.condutor_sob_estresse.impacto_no_outro}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== TABELA TRADUÇÃO (Identity v1.0) ==============
  const renderTabelaTraducaoV2 = () => {
    const tabela = content.tabela_traducao;
    if (!tabela) return null;

     const sensorItems = asArray<any>((tabela as any)?.sensor);
     const condutorItems = asArray<any>((tabela as any)?.condutor);

    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border-indigo-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-base">
              {tabela.titulo || (language === 'en' ? 'Couple Translation Table' : 'Tabela de Tradução do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sensor translations */}
          {sensorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-400 text-sm flex items-center gap-2">
                🧭 {language === 'en' ? 'When the DIRECTION SENSOR...' : 'Quando o SENSOR DE DIREÇÃO...'}
              </h4>
              {sensorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 text-sm">
                  <span className="font-medium">{item.comportamento}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-purple-700 dark:text-purple-400">{item.significa}</span>
                </div>
              ))}
            </div>
          )}

          {/* Conductor translations */}
          {condutorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700 dark:text-orange-400 text-sm flex items-center gap-2">
                ⚓ {language === 'en' ? 'When the COURSE CONDUCTOR...' : 'Quando o CONDUTOR DE CURSO...'}
              </h4>
              {condutorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-sm">
                  <span className="font-medium">{item.comportamento}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-orange-700 dark:text-orange-400">{item.significa}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROTOCOLO PAZ (Identity v1.0 Enhanced) ==============
  const renderProtocoloPazV2 = () => {
    const protocolo = content.protocolo_paz;
    if (!protocolo) return null;

    const tempoDuplo = (protocolo as any)?.tempo_duplo;
    const perguntaRecalibracao = (protocolo as any)?.pergunta_recalibracao;
    const proibicaoInferencia = (protocolo as any)?.proibicao_inferencia;
    const proibicaoRegras = asArray<string>(proibicaoInferencia?.regras);
    const legacyRegras = asArray<any>((protocolo as any)?.regras);

    return (
      <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">{protocolo.titulo || t.sections.protocolo_paz}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tempo Duplo */}
          {tempoDuplo && (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {tempoDuplo?.titulo || '1. Tempo Duplo'}
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm">{tempoDuplo?.para_sensor || ''}</p>
                </div>
                <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm">{tempoDuplo?.para_condutor || ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pergunta de Recalibração */}
          {perguntaRecalibracao && (
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                {perguntaRecalibracao?.titulo || '2. Pergunta de Recalibração'}
              </h4>
              <p className="text-sm italic font-medium text-center py-2">
                "{perguntaRecalibracao?.pergunta || ''}"
              </p>
            </div>
          )}

          {/* Proibição de Inferência */}
          {proibicaoInferencia && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {proibicaoInferencia?.titulo || '3. Proibição de Inferência'}
              </h4>
              <ul className="space-y-2">
                {proibicaoRegras.map((regra: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">✕</span>
                    <span>{regra}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legacy rules format */}
          {legacyRegras.map((regra: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                  {regra.numero || i + 1}
                </span>
                <h4 className="font-semibold text-foreground">{regra.regra}</h4>
              </div>
              {regra.porque && (
                <p className="text-sm text-muted-foreground pl-9">{t.peaceProtocol.why}: {regra.porque}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== AÇÃO PRÁTICA 24H (Identity v1.0) ==============
  const renderAcaoPratica = () => {
    const acao = content.acao_pratica_24h;
    if (!acao) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">
              {acao.titulo || (language === 'en' ? '24-Hour Practical Action' : 'Ação Prática Imediata')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">{acao.descricao}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============== FECHAMENTO V2 (Identity v1.0) ==============
  const renderFechamentoV2 = () => {
    const fechamento = content.fechamento;
    if (!fechamento) return null;

    // Handle both string format and object format
    const titulo = typeof fechamento === 'object' ? fechamento.titulo : null;
    const mensagem = typeof fechamento === 'object' ? fechamento.mensagem : fechamento;

    return (
      <Card className="bg-gradient-to-br from-primary/5 to-pink-500/5 border-primary/20">
        <CardContent className="pt-6 text-center space-y-3">
          {titulo && (
            <h3 className="font-semibold text-lg">{titulo}</h3>
          )}
          <p className="text-foreground/80 whitespace-pre-line font-medium leading-relaxed">{mensagem}</p>
        </CardContent>
      </Card>
    );
  };

  // If not purchased, show paywall
  if (!isPurchased && onPurchase) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
        </div>

        {/* Title Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-pink-500/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">
              {t.relationshipLabels[liveCrossing.relationship_type as keyof typeof t.relationshipLabels] || t.relationshipLabels.spouse}
            </h2>
          </CardContent>
        </Card>

        {/* Preview content with blur */}
        <div className="relative">
          {/* Traffic Light Preview (visible) */}
          {renderTrafficLight()}
          
          {/* Blurred premium content */}
          <div className="relative mt-6">
            <div className="blur-sm pointer-events-none opacity-60 space-y-4">
              {renderSynergyRadarChart()}
              {renderMeetingOfEssences()}
            </div>
            
            {/* Paywall overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CouplePaywall 
                language={language}
                onPurchase={onPurchase}
                isPurchased={false}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center px-4">
          {t.disclaimer}
        </p>
      </div>
    );
  }

  // When report is being regenerated, avoid rendering sections that may assume structure.
  if (!hasReportContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshCrossing} disabled={isRefreshing}>
            {isRefreshing ? "..." : language === "en" ? "Refresh" : "Recarregar"}
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">
              {language === "en" ? "Generating your updated report…" : "A gerar o relatório atualizado…"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "This can take a few seconds after regeneration. We'll keep trying to load it."
                : "Isto pode demorar alguns segundos após a regeneração. Vamos tentar carregar automaticamente."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1">
            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {linkCopied ? t.linkCopied : t.copyLink}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadPDF} 
            disabled={isGeneratingPdf}
            className="gap-1"
          >
            <FileDown className="w-4 h-4" />
            {isGeneratingPdf ? '...' : t.download}
          </Button>
        </div>
      </div>

      {/* Report content for PDF */}
      <div ref={reportRef}>
        {/* Title Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-pink-500/5 border-primary/20 mb-6">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">
              {t.relationshipLabels[liveCrossing.relationship_type as keyof typeof t.relationshipLabels] || t.relationshipLabels.spouse}
            </h2>
          </CardContent>
        </Card>

        {/* Boat Metaphor Introduction */}
        {renderBoatMetaphor()}

        {/* Opening (legacy) */}
        {content.abertura && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-foreground/80 italic whitespace-pre-line">{content.abertura}</p>
            </CardContent>
          </Card>
        )}

        {/* NEW FORMAT SECTIONS - Identity v1.0 */}
        <div className="space-y-6 mt-6">
          {/* New Identity v1.0 sections */}
          {renderZonaHarmonia()}
          {renderZonaAjuste()}
          {renderZonaChoque()}
          {renderTabelaTraducaoV2()}
          {renderProtocoloPazV2()}
          {renderAcaoPratica()}
          
          {/* Legacy sections for backwards compatibility */}
          {renderTrafficLight()}
          {renderSynergyRadarChart()}
          {renderMeetingOfEssences()}
          {renderSantoBate()}
          {renderBichoPega()}
          {renderPotentialization()}
          {renderTranslationTable()}
          {renderProtocoloPaz()}
          {renderSpouseManual(content.manual_conjuge_a, 'manual_conjuge_a')}
          {renderSpouseManual(content.manual_conjuge_b, 'manual_conjuge_b')}
          {renderPressureAlerts()}
          {renderConnectionChallenge()}
          {renderSeekHelp()}
        </div>

        {/* LEGACY SECTIONS (for backwards compatibility) */}
        <div className="space-y-6 mt-6">
          {Object.entries(content).map(([key, value]) => renderLegacySection(key, value))}
        </div>

        {/* Closing - Use new v2 renderer that handles both formats */}
        <div className="mt-6">
          {renderFechamentoV2()}
        </div>

        {/* CTA Activation */}
        <div className="mt-6">
          {renderCtaActivation()}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center px-4">
        {t.disclaimer}
      </p>
    </div>
  );
};
