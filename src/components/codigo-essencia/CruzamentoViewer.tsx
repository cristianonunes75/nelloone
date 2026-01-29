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
import {
  generateFullPeaceProtocol,
  generateTranslationTable,
  generateCrisisCommunicationTable,
  type CoupleProfiles
} from "@/lib/coupleSynergyLogic";

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

  // Extract couple profiles for synergy logic
  const coupleProfiles = useMemo((): CoupleProfiles | null => {
    const dados = content?.dados_grafico;
    if (!dados?.usuario_a?.disc || !dados?.usuario_b?.disc) return null;
    
    return {
      personA: {
        name: dados.usuario_a.nome || 'Pessoa A',
        disc: {
          D: dados.usuario_a.disc.D || 50,
          I: dados.usuario_a.disc.I || 50,
          S: dados.usuario_a.disc.S || 50,
          C: dados.usuario_a.disc.C || 50,
        },
        enneagram: dados.usuario_a.eneagrama?.toString()
      },
      personB: {
        name: dados.usuario_b.nome || 'Pessoa B',
        disc: {
          D: dados.usuario_b.disc.D || 50,
          I: dados.usuario_b.disc.I || 50,
          S: dados.usuario_b.disc.S || 50,
          C: dados.usuario_b.disc.C || 50,
        },
        enneagram: dados.usuario_b.eneagrama?.toString()
      }
    };
  }, [content]);

  // Generate dynamic content based on synergy logic when backend data is missing
  const dynamicPeaceProtocol = useMemo(() => {
    if (!coupleProfiles) return null;
    return generateFullPeaceProtocol(coupleProfiles, language);
  }, [coupleProfiles, language]);

  const dynamicTranslationTable = useMemo(() => {
    if (!coupleProfiles) return null;
    return generateTranslationTable(coupleProfiles, language);
  }, [coupleProfiles, language]);

  const hasReportContent = useMemo(() => {
    // Any known key indicates we have a renderable report.
    // Also accept legacy formats to avoid getting stuck in the “A gerar…” gate.
    const keys = Object.keys(content || {});
    if (keys.length === 0) return false;

    const knownKeys = [
      // Identity v1.0
      "metafora_barco",
      "zona_harmonia",
      "zona_ajuste",
      "zona_choque",
      "tabela_traducao",
      "protocolo_paz",
      "acao_pratica_24h",

      // Current UI sections
      "semaforo_relacional",
      "encontro_essencias",
      "potencializacao",
      "dados_grafico",
      "santo_bate",
      "bicho_pega",

      // Legacy
      "perfil_conjunto",
      "harmonias",
      "forcas_da_relacao",
      "complementaridades",
      "tensoes",
      "pontos_de_atencao",
      "como_melhorar",
      "perguntas",
      "fechamento",
      "abertura",
    ];

    if (knownKeys.some((k) => (content as any)?.[k] != null)) return true;

    // Last-resort heuristic: if any object has a recognizable content field.
    return Object.values(content as any).some((v: any) => {
      if (!v || typeof v !== "object") return false;
      return (
        typeof v.titulo === "string" ||
        typeof v.resumo === "string" ||
        typeof v.conteudo === "string" ||
        Array.isArray(v.pontos) ||
        Array.isArray(v.perguntas)
      );
    });
  }, [content]);

  const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

  // React can't render plain objects as children. Some backend fields may come as
  // structured objects like { acao, situacao, origem }. This helper normalizes
  // those cases into safe, readable text.
  const renderSafeText = (value: any) => {
    if (value == null) return null;
    if (typeof value === "string" || typeof value === "number") return String(value);

    if (typeof value === "object") {
      const text =
        value.texto ??
        value.conteudo ??
        value.resumo ??
        value.titulo ??
        value.mensagem ??
        value.acao ??
        value.situacao;

      const origin = value.origem ?? value.origem_insight;

      if (typeof text === "string" && text.trim().length > 0) {
        return (
          <span>
            {text}
            {typeof origin === "string" && origin.trim().length > 0 && (
              <span className="block text-xs text-muted-foreground mt-1">{origin}</span>
            )}
          </span>
        );
      }

      try {
        return (
          <span className="text-xs text-muted-foreground font-mono break-words">
            {JSON.stringify(value)}
          </span>
        );
      } catch {
        return <span className="text-xs text-muted-foreground">[objeto]</span>;
      }
    }

    return String(value);
  };

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
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {renderSafeText(semaforo.verde?.titulo) || t.trafficLight.verde}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{renderSafeText(semaforo.verde?.descricao)}</p>
              <ul className="space-y-1">
                {asArray<any>(semaforo.verde?.pontos).map((ponto: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span>{renderSafeText(ponto)}</span>
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
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">
                  {renderSafeText(semaforo.amarelo?.titulo) || t.trafficLight.amarelo}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{renderSafeText(semaforo.amarelo?.descricao)}</p>
              <ul className="space-y-1">
                {asArray<any>(semaforo.amarelo?.pontos).map((ponto: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500" />
                    <span>{renderSafeText(ponto)}</span>
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
                <h4 className="font-semibold text-red-700 dark:text-red-400">
                  {renderSafeText(semaforo.vermelho?.titulo) || t.trafficLight.vermelho}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{renderSafeText(semaforo.vermelho?.descricao)}</p>
              <ul className="space-y-1">
                {asArray<any>(semaforo.vermelho?.pontos).map((ponto: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 mt-0.5 text-red-500" />
                    <span>{renderSafeText(ponto)}</span>
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
            <p className="text-sm text-muted-foreground">{renderSafeText(santo.descricao)}</p>
          )}
          {santo.areas?.map((area: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">✨ {renderSafeText(area.titulo)}</h4>
              <p className="text-sm text-foreground/80">{renderSafeText(area.descricao)}</p>
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
            <p className="text-sm text-muted-foreground">{renderSafeText(bicho.descricao)}</p>
          )}
          {bicho.atritios?.map((atrito: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400">⚡ {renderSafeText(atrito.titulo)}</h4>
              <p className="text-sm text-foreground/80">{renderSafeText(atrito.descricao)}</p>
              {atrito.como_lidar && (
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">💡 Como lidar: </span>
                    {renderSafeText(atrito.como_lidar)}
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

    // If this is the v2.0 structure, let renderProtocoloPazV2 handle it.
    // Avoid rendering a legacy card that can appear empty.
    const looksLikeV2 =
      !!(protocolo as any)?.tempo_duplo ||
      !!(protocolo as any)?.pergunta_recalibracao ||
      !!(protocolo as any)?.proibicao_inferencia;
    if (looksLikeV2) return null;

    // If there are no rules, don't render an empty card.
    const regras = Array.isArray((protocolo as any)?.regras) ? (protocolo as any).regras : [];
    const hasAnyRule = regras.some((r: any) => r && (r.regra || r.porque));
    if (!hasAnyRule) return null;

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
            <p className="text-sm text-muted-foreground italic">{renderSafeText(protocolo.descricao)}</p>
          )}
          {protocolo.regras?.map((regra: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                  {regra.numero || i + 1}
                </span>
                <h4 className="font-semibold text-foreground">{renderSafeText(regra.regra)}</h4>
              </div>
              {regra.porque && (
                <p className="text-sm text-muted-foreground pl-9">{t.peaceProtocol.why}: {renderSafeText(regra.porque)}</p>
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
                ✨ {renderSafeText(encontro.metafora)} ✨
              </p>
            </div>
          )}
          <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{renderSafeText(encontro.descricao)}</p>
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
          <p className="text-foreground/80 whitespace-pre-line">{renderSafeText(pot.descricao)}</p>
          {pot.forcas && (
            <ul className="space-y-2 mt-4">
              {asArray<string>(pot.forcas).map((forca: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-1 text-pink-500" />
                  <span className="text-foreground/80">{renderSafeText(forca)}</span>
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

    // If this is the v2.0 structure, let renderTabelaTraducaoV2 handle it.
    // Avoid rendering a legacy card that can appear empty.
    const looksLikeV2 =
      !!(tabela as any)?.traducoes_sensor ||
      !!(tabela as any)?.traducoes_condutor;
    if (looksLikeV2) return null;

    // Legacy cards can show up with only title/description if arrays are missing.
    // Only render when at least one translation group has items.
    const groups = [
      (tabela as any)?.traducoes_usuario_a,
      (tabela as any)?.traducoes_usuario_b,
      (tabela as any)?.traducoes_pai,
      (tabela as any)?.traducoes_filho,
      (tabela as any)?.traducoes_a,
      (tabela as any)?.traducoes_b,
    ].filter((g) => Array.isArray(g) && g.length > 0);
    if (groups.length === 0) return null;

    const renderTranslations = (translations: any[], title: string) => {
      if (!translations?.length) return null;
      
      return (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
          {translations.map((item: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-[100px]">{t.translationTable.whenDoes}:</span>
                <span className="text-sm">{renderSafeText(item.quando_faz ?? item.quando_diz)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 min-w-[100px]">{t.translationTable.youFeel}:</span>
                <span className="text-sm">
                  {renderSafeText(item.voce_sente ?? item.outro_ouve ?? item.filho_ouve ?? item.pai_ouve)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-primary min-w-[100px]">{t.translationTable.truthBehind}:</span>
                <span className="text-sm font-medium">{renderSafeText(item.verdade_por_tras ?? item.intencao_real)}</span>
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
          {renderTranslations(
            tabela.traducoes_usuario_a,
            typeof tabela.traducoes_usuario_a?.[0]?.quando_diz === 'string'
              ? tabela.traducoes_usuario_a?.[0]?.quando_diz?.split(' ')?.[2] || 'Pessoa A'
              : 'Pessoa A'
          )}
          {renderTranslations(
            tabela.traducoes_usuario_b,
            typeof tabela.traducoes_usuario_b?.[0]?.quando_diz === 'string'
              ? tabela.traducoes_usuario_b?.[0]?.quando_diz?.split(' ')?.[2] || 'Pessoa B'
              : 'Pessoa B'
          )}
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
                {asArray<any>(manual.orientacoes).map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 text-purple-500" />
                    <span className="text-sm">{renderSafeText(item)}</span>
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
                    "{renderSafeText(palavra)}"
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
            <p className="text-sm text-muted-foreground">{renderSafeText(alertas.descricao)}</p>
          )}
          {alertas.gatilhos?.map((gatilho: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 min-w-[120px]">{t.pressureAlerts.behavior}:</span>
                <span className="text-sm">{renderSafeText(gatilho.comportamento)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-red-600 dark:text-red-400 min-w-[120px]">{t.pressureAlerts.autoDefense}:</span>
                <span className="text-sm">{renderSafeText(gatilho.defesa_automatica)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-[120px]">{t.pressureAlerts.riskSituation}:</span>
                <span className="text-sm">{renderSafeText(gatilho.situacao_risco)}</span>
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
            <p className="text-sm text-muted-foreground mb-3">{renderSafeText(desafio.descricao)}</p>
          )}
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">{renderSafeText(desafio.acao)}</p>
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
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{renderSafeText(ajuda.descricao)}</p>
          )}
          <ul className="space-y-2">
            {ajuda.sugestoes?.map((sugestao: any, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ExternalLink className="w-4 h-4 mt-0.5 text-blue-500" />
                <span>{renderSafeText(sugestao)}</span>
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
      // Original format keys
      'semaforo_relacional', 'encontro_essencias', 'potencializacao', 
      'tabela_traducao', 'manual_conjuge_a', 'manual_conjuge_b',
      'alertas_pressao', 'desafio_conexao', 'quando_buscar_ajuda',
      'cta_ativacao', 'abertura', 'fechamento', 'desafio_conexao_familiar',
      'tabela_traducao_familiar', 'tabela_traducao_fraternal',
      'dados_grafico', 'santo_bate', 'bicho_pega', 'protocolo_paz',
      'metafora_barco', 'zona_harmonia', 'zona_ajuste', 'zona_choque',
      'acao_pratica_24h',
      
      // NEW v1.0 keys (Prompt Único Oficial)
      'visao_geral', 'papeis_naturais', 'forcas_centrais', 'amor_no_casal',
      'tensoes_naturais', 'protocolo_lideranca', 'traducao_dia_a_dia',
      'sintese_executiva', 'cenarios_vida_real',
      
      // Metadata keys
      '_identity_version', '_role_assignment',
      
      // 7 Pillars keys
      'ritmos_biologicos', 'sinergia_talentos', 'mito_casal',
      'plano_abastecimento', 'processamento_decisao',
      
      // v2.2 Livro de Bordo keys
      'reflexoes_praticas', 'frases_ponte', 'alertas_dia_a_dia',
      'rituais_casal', 'metafora_central', 'papeis_identificados',
      'tabela_traducao_v2', 'protocolo_paz_v2'
    ];
    
    if (newFormatKeys.includes(key)) return null;
    
    const title = data.titulo || t.sections[key as keyof typeof t.sections] || key;
    
    const contentField = data.resumo || data.conteudo || data.pontos || data.compromissos || 
                        data.sugestoes || data.perguntas || data.situacoes;
    
    if (!contentField) return null;

    const renderContent = (content: any) => {
      if (typeof content === 'string') {
        return <p className="text-foreground/80 whitespace-pre-line">{renderSafeText(content)}</p>;
      }
      if (Array.isArray(content)) {
        const renderListItem = (item: any) => {
          if (typeof item === 'string' || typeof item === 'number') {
            return <span className="text-foreground/80">{String(item)}</span>;
          }

          // Defensive: legacy arrays sometimes contain objects; React can't render objects as children.
          if (item && typeof item === 'object') {
            const text =
              item.texto ??
              item.conteudo ??
              item.resumo ??
              item.titulo ??
              item.mensagem ??
              item.acao ??
              item.situacao;

            const origin = item.origem ?? item.origem_insight;

            if (typeof text === 'string' && text.trim().length > 0) {
              return (
                <span className="text-foreground/80">
                  {text}
                  {typeof origin === 'string' && origin.trim().length > 0 && (
                    <span className="block text-xs text-muted-foreground mt-1">{origin}</span>
                  )}
                </span>
              );
            }

            // Last resort: stringify (keeps UI alive and prevents crash)
            try {
              return (
                <span className="text-xs text-muted-foreground font-mono break-words">
                  {JSON.stringify(item)}
                </span>
              );
            } catch {
              return <span className="text-xs text-muted-foreground">[objeto]</span>;
            }
          }

          if (item == null) return null;
          return <span className="text-foreground/80">{String(item)}</span>;
        };

        return (
          <ul className="space-y-2">
            {content.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {renderListItem(item)}
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

  // ============== 7 PILLARS: TEMPERAMENTS (Ritmos Biológicos) ==============
  const render7PillarsTemperaments = () => {
    const ritmos = content.ritmos_biologicos;
    if (!ritmos) return null;

    const tempA = ritmos.temperamento_a;
    const tempB = ritmos.temperamento_b;

    return (
      <Card className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-base">
              {ritmos.titulo || (language === 'en' ? 'Biological Rhythms' : 'Protocolo de Ritmo do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {tempA && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(tempA.nome)}</p>
                <p className="text-lg font-medium text-orange-700 dark:text-orange-400">
                  {renderSafeText(tempA.temperamento_primario)}
                  {tempA.temperamento_secundario && ` / ${renderSafeText(tempA.temperamento_secundario)}`}
                </p>
                {tempA.caracteristicas && (
                  <p className="text-sm text-muted-foreground mt-2">{renderSafeText(tempA.caracteristicas)}</p>
                )}
              </div>
            )}
            {tempB && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(tempB.nome)}</p>
                <p className="text-lg font-medium text-amber-700 dark:text-amber-400">
                  {renderSafeText(tempB.temperamento_primario)}
                  {tempB.temperamento_secundario && ` / ${renderSafeText(tempB.temperamento_secundario)}`}
                </p>
                {tempB.caracteristicas && (
                  <p className="text-sm text-muted-foreground mt-2">{renderSafeText(tempB.caracteristicas)}</p>
                )}
              </div>
            )}
          </div>
          {ritmos.sinergia && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{renderSafeText(ritmos.sinergia)}</p>
            </div>
          )}
          {ritmos.ajuste_pratico && (
            <p className="text-sm text-muted-foreground italic">{renderSafeText(ritmos.ajuste_pratico)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== 7 PILLARS: INTELLIGENCES (Sinergia de Talentos) ==============
  const render7PillarsIntelligences = () => {
    const talentos = content.sinergia_talentos;
    if (!talentos) return null;

    return (
      <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">
              {talentos.titulo || (language === 'en' ? 'Talent Synergy' : 'Sinergia de Talentos')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {talentos.talentos_a && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="font-semibold text-sm mb-2">{renderSafeText(talentos.talentos_a.nome)}</p>
                <div className="flex flex-wrap gap-1">
                  {asArray<string>(talentos.talentos_a.top_3).map((talent: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-700 dark:text-blue-300">
                      {renderSafeText(talent)}
                    </span>
                  ))}
                </div>
                {talentos.talentos_a.contribuicao && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(talentos.talentos_a.contribuicao)}</p>
                )}
              </div>
            )}
            {talentos.talentos_b && (
              <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="font-semibold text-sm mb-2">{renderSafeText(talentos.talentos_b.nome)}</p>
                <div className="flex flex-wrap gap-1">
                  {asArray<string>(talentos.talentos_b.top_3).map((talent: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-700 dark:text-indigo-300">
                      {renderSafeText(talent)}
                    </span>
                  ))}
                </div>
                {talentos.talentos_b.contribuicao && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(talentos.talentos_b.contribuicao)}</p>
                )}
              </div>
            )}
          </div>
          {talentos.complementaridade && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{renderSafeText(talentos.complementaridade)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== 7 PILLARS: ARCHETYPES (Dinâmica de Papéis) ==============
  const render7PillarsArchetypes = () => {
    const arquetipos = content.dinamica_arquetipos || content.dinamica_papeis;
    if (!arquetipos) return null;

    const archA = arquetipos.arquetipo_a;
    const archB = arquetipos.arquetipo_b;

    return (
      <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-base">
              {arquetipos.titulo || (language === 'en' ? 'The Couple\'s Myth' : 'O Mito do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {archA && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(archA.nome)}</p>
                <p className="text-lg font-medium text-purple-700 dark:text-purple-400">
                  {renderSafeText(archA.primario || archA.arquetipos)}
                  {archA.secundario && ` / ${renderSafeText(archA.secundario)}`}
                </p>
                {archA.papel_no_casal && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(archA.papel_no_casal)}</p>
                )}
              </div>
            )}
            {archB && (
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(archB.nome)}</p>
                <p className="text-lg font-medium text-pink-700 dark:text-pink-400">
                  {renderSafeText(archB.primario || archB.arquetipos)}
                  {archB.secundario && ` / ${renderSafeText(archB.secundario)}`}
                </p>
                {archB.papel_no_casal && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(archB.papel_no_casal)}</p>
                )}
              </div>
            )}
          </div>
          {arquetipos.mito_conjunto && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{renderSafeText(arquetipos.mito_conjunto)}</p>
            </div>
          )}
          {arquetipos.dinamica_luz_sombra && (
            <p className="text-sm text-muted-foreground italic">{renderSafeText(arquetipos.dinamica_luz_sombra)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== 7 PILLARS: CONNECTION STYLES (Linguagens de Conexão) ==============
  const render7PillarsConnectionStyles = () => {
    const linguagens = content.linguagens_conexao;
    if (!linguagens) return null;

    return (
      <Card className="bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-pink-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base">
              {linguagens.titulo || (language === 'en' ? 'Emotional Supply Plan' : 'Plano de Abastecimento Emocional')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {linguagens.linguagem_a && (
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(linguagens.linguagem_a.nome)}</p>
                <p className="text-lg font-medium text-pink-700 dark:text-pink-400">
                  {renderSafeText(linguagens.linguagem_a.estilo_primario)}
                  {linguagens.linguagem_a.estilo_secundario && ` / ${renderSafeText(linguagens.linguagem_a.estilo_secundario)}`}
                </p>
                {linguagens.linguagem_a.como_se_sente_amado && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(linguagens.linguagem_a.como_se_sente_amado)}</p>
                )}
              </div>
            )}
            {linguagens.linguagem_b && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(linguagens.linguagem_b.nome)}</p>
                <p className="text-lg font-medium text-rose-700 dark:text-rose-400">
                  {renderSafeText(linguagens.linguagem_b.estilo_primario)}
                  {linguagens.linguagem_b.estilo_secundario && ` / ${renderSafeText(linguagens.linguagem_b.estilo_secundario)}`}
                </p>
                {linguagens.linguagem_b.como_se_sente_amado && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(linguagens.linguagem_b.como_se_sente_amado)}</p>
                )}
              </div>
            )}
          </div>
          {linguagens.micro_acordos && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                {language === 'en' ? 'Micro Agreements' : 'Micro Acordos'}
              </h4>
              <ul className="space-y-1">
                {asArray<string>(linguagens.micro_acordos).map((acordo: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500" />
                    <span>{renderSafeText(acordo)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== 7 PILLARS: NELLO 16 (Processamento de Decisão) ==============
  const render7PillarsNello16 = () => {
    const decisao = content.processamento_decisao;
    if (!decisao) return null;

    return (
      <Card className="bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border-teal-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-500" />
            <CardTitle className="text-base">
              {decisao.titulo || (language === 'en' ? 'Decision Processing' : 'Processamento de Decisão')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {decisao.tipo_a && (
              <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(decisao.tipo_a.nome)}</p>
                {decisao.tipo_a.tipo_nello16 && (
                  <p className="text-xl font-bold text-teal-700 dark:text-teal-400 tracking-wider">
                    {renderSafeText(decisao.tipo_a.tipo_nello16)}
                  </p>
                )}
                {decisao.tipo_a.como_decide && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(decisao.tipo_a.como_decide)}</p>
                )}
              </div>
            )}
            {decisao.tipo_b && (
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="font-semibold text-sm mb-1">{renderSafeText(decisao.tipo_b.nome)}</p>
                {decisao.tipo_b.tipo_nello16 && (
                  <p className="text-xl font-bold text-cyan-700 dark:text-cyan-400 tracking-wider">
                    {renderSafeText(decisao.tipo_b.tipo_nello16)}
                  </p>
                )}
                {decisao.tipo_b.como_decide && (
                  <p className="text-xs text-muted-foreground mt-2">{renderSafeText(decisao.tipo_b.como_decide)}</p>
                )}
              </div>
            )}
          </div>
          {decisao.tensao_potencial && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-700 dark:text-amber-400">⚠️ {renderSafeText(decisao.tensao_potencial)}</p>
            </div>
          )}
          {decisao.sinergia && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">✨ {renderSafeText(decisao.sinergia)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: VISÃO GERAL DO CASAL ==============
  const renderVisaoGeral = () => {
    const visao = content.visao_geral;
    if (!visao) return null;

    return (
      <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">
              {visao.titulo || (language === 'en' ? 'Couple Overview' : 'Visão Geral do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {visao.metafora && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400 italic">
                ✨ {renderSafeText(visao.metafora)} ✨
              </p>
            </div>
          )}
          {visao.descricao && (
            <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{renderSafeText(visao.descricao)}</p>
          )}
          {visao.funcionamento_sistema && (
            <p className="text-sm text-muted-foreground">{renderSafeText(visao.funcionamento_sistema)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: PAPÉIS NATURAIS DO CASAL ==============
  const renderPapeisNaturais = () => {
    // Support multiple key formats:
    // - v1.0: papeis_naturais { sensor, condutor }
    // - internal: _role_assignment { sensor, conductor }
    // - some payloads: only dados_grafico.usuario_a/b.papel (sensor|condutor)
    const papeis = content.papeis_naturais || content._role_assignment;

    const roleFromChart = (() => {
      const chart = content?.dados_grafico;
      const a = chart?.usuario_a;
      const b = chart?.usuario_b;
      if (!a || !b) return null;

      const pickName = (u: any) => u?.nome ?? u?.name;
      const roleA = a?.papel;
      const roleB = b?.papel;
      const out: { sensor?: { nome?: string }; condutor?: { nome?: string } } = {};

      if (roleA === 'sensor') out.sensor = { nome: pickName(a) };
      if (roleA === 'condutor') out.condutor = { nome: pickName(a) };
      if (roleB === 'sensor') out.sensor = { nome: pickName(b) };
      if (roleB === 'condutor') out.condutor = { nome: pickName(b) };

      // If chart uses different labels, bail out
      if (!out.sensor && !out.condutor) return null;
      return out;
    })();

    const sensor = papeis?.sensor || roleFromChart?.sensor;
    const condutor = papeis?.condutor || papeis?.conductor || roleFromChart?.condutor;

    // Render only if we have at least one role to show
    if (!sensor && !condutor) return null;

    return (
      <Card className="bg-gradient-to-br from-purple-500/5 to-orange-500/5 border-purple-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-base">
              {renderSafeText(papeis.titulo) || (language === 'en' ? 'Natural Roles' : 'Papéis Naturais no Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sensor */}
            {sensor && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🧭</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">
                    {language === 'en' ? 'Direction Sensor' : 'Sensor de Direção'}
                  </span>
                </div>
                <p className="font-medium">{renderSafeText(sensor?.nome || sensor?.name)}</p>
                {(sensor?.justificativa || sensor?.score !== undefined) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {renderSafeText(sensor?.justificativa) ||
                     (sensor?.score !== undefined ? `Pontuação: ${sensor?.score}` : '')}
                  </p>
                )}
              </div>
            )}
            {/* Condutor / Construtor */}
            {condutor && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚓</span>
                  <span className="font-semibold text-orange-700 dark:text-orange-400">
                    {language === 'en' ? 'Builder/Executor' : 'Construtor / Executor'}
                  </span>
                </div>
                <p className="font-medium">
                  {renderSafeText(condutor?.nome || condutor?.name)}
                </p>
                {(condutor?.justificativa || condutor?.score !== undefined) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {renderSafeText(condutor?.justificativa) ||
                     (condutor?.score !== undefined ? `Pontuação: ${condutor?.score}` : '')}
                  </p>
                )}
              </div>
            )}
          </div>
          {papeis?.dinamica_alternancia && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground italic">{renderSafeText(papeis.dinamica_alternancia)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: FORÇAS CENTRAIS DA UNIÃO ==============
  const renderForcasCentrais = () => {
    const forcas = content.forcas_centrais;
    if (!forcas) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">
              {forcas.titulo || (language === 'en' ? 'Core Strengths' : 'Forças Centrais da União')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {forcas.forcas_emocionais && (
            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-2 flex items-center gap-2">
                ❤️ {language === 'en' ? 'Emotional' : 'Emocionais'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(forcas.forcas_emocionais)}</p>
            </div>
          )}
          {forcas.forcas_praticas && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                🛠️ {language === 'en' ? 'Practical' : 'Práticas'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(forcas.forcas_praticas)}</p>
            </div>
          )}
          {forcas.visao_proposito && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                🎯 {language === 'en' ? 'Vision & Purpose' : 'Visão e Propósito'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(forcas.visao_proposito)}</p>
            </div>
          )}
          {forcas.valores_espiritualidade && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                ✨ {language === 'en' ? 'Values & Spirituality' : 'Valores e Espiritualidade'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(forcas.valores_espiritualidade)}</p>
            </div>
          )}
          {forcas.como_aparecem_dia_a_dia && (
            <p className="text-sm text-muted-foreground italic mt-2">{renderSafeText(forcas.como_aparecem_dia_a_dia)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: O AMOR NO CASAL ==============
  const renderAmorNoCasal = () => {
    const amor = content.amor_no_casal;
    if (!amor) return null;

    return (
      <Card className="bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-red-500/5 border-pink-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base">
              {amor.titulo || (language === 'en' ? '❤️ Love in the Couple' : '❤️ O Amor no Casal')}
            </CardTitle>
          </div>
          {amor.mensagem_chave && (
            <p className="text-sm font-medium text-pink-700 dark:text-pink-400 italic mt-1">
              "{renderSafeText(amor.mensagem_chave)}"
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Como expressa amor */}
          <div className="grid gap-4 md:grid-cols-2">
            {amor.como_expressa_amor_a && (
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <p className="font-semibold text-sm mb-2">{renderSafeText(amor.como_expressa_amor_a.nome)}</p>
                <p className="text-xs text-muted-foreground mb-1">{language === 'en' ? 'Expresses love through:' : 'Expressa amor através de:'}</p>
                <p className="text-sm text-foreground/80">{renderSafeText(amor.como_expressa_amor_a.forma_expressao)}</p>
              </div>
            )}
            {amor.como_expressa_amor_b && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="font-semibold text-sm mb-2">{renderSafeText(amor.como_expressa_amor_b.nome)}</p>
                <p className="text-xs text-muted-foreground mb-1">{language === 'en' ? 'Expresses love through:' : 'Expressa amor através de:'}</p>
                <p className="text-sm text-foreground/80">{renderSafeText(amor.como_expressa_amor_b.forma_expressao)}</p>
              </div>
            )}
          </div>

          {/* Como se sente amado */}
          {(amor.como_se_sente_amado_a || amor.como_se_sente_amado_b) && (
            <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
              <h4 className="font-semibold text-sm">{language === 'en' ? 'How Each Feels Loved' : 'Como Cada Um Se Sente Amado'}</h4>
              {amor.como_se_sente_amado_a && (
                <p className="text-sm text-foreground/80">💜 {renderSafeText(amor.como_se_sente_amado_a)}</p>
              )}
              {amor.como_se_sente_amado_b && (
                <p className="text-sm text-foreground/80">🧡 {renderSafeText(amor.como_se_sente_amado_b)}</p>
              )}
            </div>
          )}

          {/* Onde o amor se perde */}
          {amor.onde_amor_se_perde && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-2">
                ⚠️ {language === 'en' ? 'Where Love Gets Lost' : 'Onde o Amor se Perde'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(amor.onde_amor_se_perde)}</p>
            </div>
          )}

          {/* Como reativar */}
          {amor.como_reativar && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                💡 {language === 'en' ? 'How to Reactivate Love' : 'Como Reativar o Amor'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(amor.como_reativar)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: TENSÕES NATURAIS ==============
  const renderTensoesNaturais = () => {
    // Support multiple key formats
    const tensoes = content.tensoes_naturais || content.tensoes;
    if (!tensoes) return null;

    // Get tensoes array from different possible formats
    const tensoesArray = tensoes.tensoes || [];
    const tensoesNote = tensoes.nota;

    return (
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              {renderSafeText(tensoes.titulo) || (language === 'en' ? 'Natural Tensions' : 'Tensões Naturais do Casal')}
            </CardTitle>
          </div>
          {tensoesNote && (
            <p className="text-xs text-muted-foreground italic mt-1">💡 {renderSafeText(tensoesNote)}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Old format support */}
          {tensoes.onde_surgem && (
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-2">
                {language === 'en' ? 'Where Tensions Arise' : 'Onde Surgem os Atritos'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(tensoes.onde_surgem)}</p>
            </div>
          )}
          {tensoes.porque_surgem && (
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold text-sm mb-2">
                {language === 'en' ? 'Why They Happen' : 'Por Que Surgem'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(tensoes.porque_surgem)}</p>
            </div>
          )}
          {tensoes.o_que_cada_um_sente && (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">
                {language === 'en' ? 'What Each One Feels' : 'O Que Cada Um Sente'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(tensoes.o_que_cada_um_sente)}</p>
            </div>
          )}
          
          {/* New v2.0 format - tensoes array */}
          {Array.isArray(tensoesArray) && tensoesArray.length > 0 && tensoesArray.map((tensao: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {renderSafeText(tensao.area)}
              </h4>
              
              {tensao.onde_surge && (
                <div className="text-sm">
                  <strong className="text-foreground/70">{language === 'en' ? 'Where it arises:' : 'Onde surge:'}</strong>
                  <p className="text-foreground/80 mt-1">{renderSafeText(tensao.onde_surge)}</p>
                </div>
              )}
              
              {tensao.por_que_surge && (
                <div className="text-sm">
                  <strong className="text-foreground/70">{language === 'en' ? 'Why it happens:' : 'Por que surge:'}</strong>
                  <p className="text-foreground/80 mt-1">{renderSafeText(tensao.por_que_surge)}</p>
                </div>
              )}
              
              <div className="grid gap-3 md:grid-cols-2">
                {tensao.o_que_a_sente && (
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                      {language === 'en' ? 'Person A feels:' : 'O que Pessoa A sente:'}
                    </p>
                    <p className="text-xs text-foreground/80">{renderSafeText(tensao.o_que_a_sente)}</p>
                  </div>
                )}
                {tensao.o_que_b_sente && (
                  <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                      {language === 'en' ? 'Person B feels:' : 'O que Pessoa B sente:'}
                    </p>
                    <p className="text-xs text-foreground/80">{renderSafeText(tensao.o_que_b_sente)}</p>
                  </div>
                )}
              </div>
              
              {tensao.exemplo_situacao && (
                <div className="p-3 rounded bg-muted/50 border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    💡 {language === 'en' ? 'Example Situation:' : 'Exemplo de Situação:'}
                  </p>
                  <p className="text-xs text-foreground/80 italic">{renderSafeText(tensao.exemplo_situacao)}</p>
                </div>
              )}
              
              {tensao.origem && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  📊 {renderSafeText(tensao.origem)}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: ZONA DE AJUSTE ==============
  const renderZonaDeAjusteV1 = () => {
    // Support both key formats: zona_de_ajuste (v1.0) and zona_ajuste (v2.0)
    const zona = content.zona_de_ajuste || content.zona_ajuste;
    if (!zona) return null;

    // Get fields from both v1.0 and v2.0 formats
    const pontoPrincipal = zona.principal_ponto || zona.ponto_principal;
    const riscoSeNaoMudar = zona.risco_se_nao_mudar || zona.risco_se_nao_ajustar;
    const ajusteSimples = zona.ajuste_simples || zona.ajuste_proposto;
    const microAcordos = zona.micro_acordos;
    const origemInsight = zona.origem_insight;

    return (
      <Card className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-amber-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🟡</span>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              {renderSafeText(zona.titulo) || (language === 'en' ? 'Couple Adjustment Zone' : 'Zona de Ajuste do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pontoPrincipal && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-2">
                🎯 {language === 'en' ? 'Main Adjustment Point' : 'Principal Ponto de Ajuste'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(pontoPrincipal)}</p>
            </div>
          )}
          {riscoSeNaoMudar && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-semibold text-sm text-red-700 dark:text-red-400 mb-2">
                ⚠️ {language === 'en' ? 'Risk if Nothing Changes' : 'Risco se Nada Mudar'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(riscoSeNaoMudar)}</p>
            </div>
          )}
          {ajusteSimples && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                ✅ {language === 'en' ? 'Proposed Adjustment' : 'Ajuste Proposto'}
              </h4>
              <p className="text-sm text-foreground/80">{renderSafeText(ajusteSimples)}</p>
            </div>
          )}
          {microAcordos && Array.isArray(microAcordos) && microAcordos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-indigo-700 dark:text-indigo-400">
                🤝 {language === 'en' ? 'Micro-Agreements' : 'Micro-Acordos'}
              </h4>
              {microAcordos.map((acordo: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                  <p className="font-medium text-sm">{renderSafeText(acordo.titulo)}</p>
                  {acordo.descricao && (
                    <p className="text-sm text-foreground/80">{renderSafeText(acordo.descricao)}</p>
                  )}
                  {acordo.como_praticar && (
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                        💡 {language === 'en' ? 'How to Practice' : 'Como Praticar'}
                      </p>
                      <p className="text-xs text-foreground/70">{renderSafeText(acordo.como_praticar)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {origemInsight && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                📊 {renderSafeText(origemInsight)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: PROTOCOLO DE LIDERANÇA ==============
  const renderProtocoloLideranca = () => {
    // Support multiple key formats
    const protocolo = content.protocolo_lideranca || content.protocolo_de_lideranca;
    if (!protocolo) return null;

    // Old format support
    const regrasOld = [
      { icon: '🎯', label: language === 'en' ? 'Strategy & Long-term' : 'Estratégia e Longo Prazo', value: protocolo.estrategia_longo_prazo },
      { icon: '⚡', label: language === 'en' ? 'Execution & Crisis' : 'Execução e Crise Prática', value: protocolo.execucao_crise },
      { icon: '💭', label: language === 'en' ? 'Emotional Conflict' : 'Conflito Emocional', value: protocolo.conflito_emocional },
      { icon: '🧭', label: language === 'en' ? 'Sensor Role' : 'Papel do Sensor', value: protocolo.sensor_organiza },
      { icon: '⚓', label: language === 'en' ? 'Conductor Role' : 'Papel do Condutor', value: protocolo.condutor_sustenta },
    ].filter(r => r.value);

    // New format - decisoes_estrategicas, execucao_imediata, conflitos_emocionais
    const hasNewFormat = protocolo.decisoes_estrategicas || protocolo.execucao_imediata || protocolo.conflitos_emocionais;

    const renderProtocoloSection = (section: any, icon: string, title: string, colorClass: string) => {
      if (!section) return null;
      return (
        <div className={`p-4 rounded-lg ${colorClass} space-y-2`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{icon}</span>
            <h4 className="font-semibold text-sm">{title}</h4>
          </div>
          {section.responsavel && (
            <p className="text-sm">
              <strong className="text-foreground/70">{language === 'en' ? 'Lead by:' : 'Responsável:'}</strong>{' '}
              <span className="font-medium">{renderSafeText(section.responsavel)}</span>
            </p>
          )}
          {section.regra && (
            <p className="text-sm text-foreground/80">{renderSafeText(section.regra)}</p>
          )}
          {section.rituais && Array.isArray(section.rituais) && section.rituais.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                🕯️ {language === 'en' ? 'Rituals:' : 'Rituais:'}
              </p>
              {section.rituais.map((ritual: string, i: number) => (
                <p key={i} className="text-xs text-foreground/70 pl-4 border-l-2 border-current/20">{renderSafeText(ritual)}</p>
              ))}
            </div>
          )}
          {section.origem && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground mt-2">
              📊 {renderSafeText(section.origem)}
            </span>
          )}
        </div>
      );
    };

    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border-indigo-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-base text-indigo-700 dark:text-indigo-400">
              {renderSafeText(protocolo.titulo) || (language === 'en' ? 'Couple Leadership Protocol' : 'Protocolo de Liderança do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New v2.0 format */}
          {hasNewFormat && (
            <>
              {renderProtocoloSection(
                protocolo.decisoes_estrategicas, 
                '🎯', 
                language === 'en' ? 'Strategic Decisions' : 'Decisões Estratégicas',
                'bg-purple-500/10 border border-purple-500/20'
              )}
              {renderProtocoloSection(
                protocolo.execucao_imediata, 
                '⚡', 
                language === 'en' ? 'Immediate Execution' : 'Execução Imediata',
                'bg-orange-500/10 border border-orange-500/20'
              )}
              {renderProtocoloSection(
                protocolo.conflitos_emocionais, 
                '💭', 
                language === 'en' ? 'Emotional Conflicts' : 'Conflitos Emocionais',
                'bg-pink-500/10 border border-pink-500/20'
              )}
            </>
          )}
          
          {/* Old format support */}
          {regrasOld.length > 0 && regrasOld.map((regra, i) => (
            <div key={i} className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <span className="text-lg">{regra.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-indigo-700 dark:text-indigo-400">{renderSafeText(regra.label)}</p>
                  <p className="text-sm text-foreground/80">{renderSafeText(regra.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: TRADUÇÃO DIA A DIA ==============
  const renderTraducaoDiaADia = () => {
    const traducao = content.traducao_dia_a_dia;
    if (!traducao) return null;

    const orientacoes = asArray<string>(traducao.orientacoes);

    return (
      <Card className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">
              {traducao.titulo || (language === 'en' ? 'Day-to-Day Translation' : 'Tradução para o Dia a Dia')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {orientacoes.length > 0 ? (
            orientacoes.map((orientacao: string, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground/90">{renderSafeText(orientacao)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-foreground/80">{renderSafeText(typeof traducao === 'string' ? traducao : traducao.descricao)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROMPT ÚNICO v1.0: SÍNTESE EXECUTIVA ==============
  const renderSinteseExecutiva = () => {
    const sintese = content.sintese_executiva;
    if (!sintese) return null;

    return (
      <Card className="bg-gradient-to-br from-primary/10 via-pink-500/10 to-purple-500/10 border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">
              {sintese.titulo || (language === 'en' ? 'Executive Summary' : 'Síntese Executiva do Casal')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {sintese.tipo_casal && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Couple Type' : 'Tipo de Casal'}</p>
                <p className="font-semibold text-foreground">{renderSafeText(sintese.tipo_casal)}</p>
              </div>
            )}
            {sintese.forma_amar && (
              <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Way of Loving' : 'Forma de Amar'}</p>
                <p className="font-semibold text-foreground">{renderSafeText(sintese.forma_amar)}</p>
              </div>
            )}
            {sintese.forca_principal && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Main Strength' : 'Força Principal'}</p>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">{renderSafeText(sintese.forca_principal)}</p>
              </div>
            )}
            {sintese.risco_principal && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-muted-foreground">{language === 'en' ? 'Main Risk' : 'Risco Principal'}</p>
                <p className="font-semibold text-amber-700 dark:text-amber-400">{renderSafeText(sintese.risco_principal)}</p>
              </div>
            )}
          </div>
          {sintese.antidoto_pratico && (
            <div className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-muted-foreground mb-1">{language === 'en' ? 'Practical Antidote' : 'Antídoto Prático'}</p>
              <p className="font-medium text-indigo-700 dark:text-indigo-400">{renderSafeText(sintese.antidoto_pratico)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== HELPER: BADGE DE ORIGEM (Rastreabilidade) ==============
  const renderOrigemBadge = (origem: string | undefined) => {
    if (!origem) return null;
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground mt-1">
        📊 {origem}
      </span>
    );
  };

  // ============== CENÁRIOS DA VIDA REAL (Carreira, Finanças, Saúde, Espiritualidade) ==============
  const renderCenariosVidaReal = () => {
    const cenarios = content.cenarios_vida_real;
    if (!cenarios) return null;

    const renderCenario = (cenario: any, icon: string, colorClass: string) => {
      if (!cenario) return null;
      
      return (
        <div className={`p-4 rounded-lg ${colorClass} border space-y-3`}>
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <span>{icon}</span>
            {renderSafeText(cenario.titulo)}
          </h4>
          
          {cenario.como_funciona && (
            <p className="text-sm text-foreground/80">{renderSafeText(cenario.como_funciona)}</p>
          )}
          
          <div className="grid gap-3 md:grid-cols-2">
            {cenario.papel_sensor && (
              <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                  🧭 Papel do Sensor
                </p>
                <p className="text-sm text-foreground/80">{renderSafeText(cenario.papel_sensor)}</p>
              </div>
            )}
            {cenario.papel_condutor && (
              <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                  ⚓ Papel do Condutor
                </p>
                <p className="text-sm text-foreground/80">{renderSafeText(cenario.papel_condutor)}</p>
              </div>
            )}
          </div>
          
          {cenario.origem_insight && (
            <div className="mt-2">
              {renderOrigemBadge(cenario.origem_insight)}
            </div>
          )}
          
          {cenario.exemplo_pratico && (
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                💡 {language === 'en' ? 'Practical Example' : 'Exemplo Prático'}
              </p>
              <p className="text-sm text-foreground/80 italic">{renderSafeText(cenario.exemplo_pratico)}</p>
            </div>
          )}
        </div>
      );
    };

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">
              {cenarios.titulo || (language === 'en' ? 'Navigating Life Together' : 'Navegando a Vida Juntos')}
            </CardTitle>
          </div>
          {cenarios.descricao && (
            <p className="text-sm text-muted-foreground mt-1">{cenarios.descricao}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCenario(cenarios.carreira, '💼', 'bg-blue-500/5 border-blue-500/20')}
          {renderCenario(cenarios.financas, '💰', 'bg-emerald-500/5 border-emerald-500/20')}
          {renderCenario(cenarios.saude, '🏥', 'bg-pink-500/5 border-pink-500/20')}
          {renderCenario(cenarios.espiritualidade, '🙏', 'bg-purple-500/5 border-purple-500/20')}
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
          <h3 className="font-semibold mb-2">{renderSafeText(cta.titulo) || t.sections.cta_ativacao}</h3>
          <p className="text-sm text-muted-foreground">{renderSafeText(cta.descricao)}</p>
        </CardContent>
      </Card>
    );
  };

  // ============== BOAT METAPHOR INTRO (Identity v2.0) ==============
  const renderBoatMetaphor = () => {
    // Support both metafora_barco (legacy) and metafora_central (v2.0)
    const metaforaBarco = content.metafora_barco || content.metafora_central;
    const papeis = content.papeis_identificados;
    
    if (metaforaBarco) {
      return (
        <Card className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Ship className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  {renderSafeText(metaforaBarco.titulo) || (language === 'en' ? 'The Boat Metaphor' : 'A Metáfora do Barco')}
                </h3>
                <p className="text-foreground/80 italic">{renderSafeText(metaforaBarco.texto ?? metaforaBarco.descricao)}</p>
              </div>
            </div>
            
            {/* Roles identification - papeis_identificados */}
            {papeis && (
              <div className="grid gap-3 md:grid-cols-2 mt-4 pt-4 border-t border-blue-500/20">
                {papeis.sensor_direcao && (
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🧭</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-400 text-sm">
                        {language === 'en' ? 'Direction Sensor' : 'Sensor de Direção'}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{renderSafeText(papeis.sensor_direcao.nome)}</p>
                    {papeis.sensor_direcao.justificativa && (
                      <p className="text-xs text-muted-foreground mt-1">{renderSafeText(papeis.sensor_direcao.justificativa)}</p>
                    )}
                  </div>
                )}
                {papeis.condutor_curso && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">⚓</span>
                      <span className="font-semibold text-orange-700 dark:text-orange-400 text-sm">
                        {language === 'en' ? 'Course Conductor' : 'Condutor de Curso'}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{renderSafeText(papeis.condutor_curso.nome)}</p>
                    {papeis.condutor_curso.justificativa && (
                      <p className="text-xs text-muted-foreground mt-1">{renderSafeText(papeis.condutor_curso.justificativa)}</p>
                    )}
                  </div>
                )}
              </div>
            )}
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
            <p className="text-sm text-muted-foreground">{renderSafeText(zona.descricao)}</p>
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
                    <span>{renderSafeText(valor)}</span>
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
              <p className="text-sm">{renderSafeText(zona.proposito_comum)}</p>
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
            <p className="text-sm text-muted-foreground">{renderSafeText(zona.descricao)}</p>
          )}
          {asArray<any>(zona.diferencas).map((diff: any, i: number) => (
            <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
              {/* Support for both old (aspecto/descricao) and new (pessoa_a_faz/pessoa_b_faz/micro_acordo) formats */}
              {diff.aspecto && (
                <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1 text-sm">
                  ⚡ {renderSafeText(diff.aspecto)}
                </h4>
              )}
              {diff.descricao && (
                <p className="text-sm">{renderSafeText(diff.descricao)}</p>
              )}
              {/* New Identity v2.0 format */}
              {diff.pessoa_a_faz && (
                <div className="text-sm">
                  <strong className="text-amber-700 dark:text-amber-400">
                    {language === 'en' ? 'Person A tends to:' : 'Pessoa A tende a:'}
                  </strong>
                  <p className="text-foreground/80 mt-1">{renderSafeText(diff.pessoa_a_faz)}</p>
                </div>
              )}
              {diff.pessoa_b_faz && (
                <div className="text-sm">
                  <strong className="text-amber-700 dark:text-amber-400">
                    {language === 'en' ? 'Person B tends to:' : 'Pessoa B tende a:'}
                  </strong>
                  <p className="text-foreground/80 mt-1">{renderSafeText(diff.pessoa_b_faz)}</p>
                </div>
              )}
              {diff.micro_acordo && (
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <strong className="text-xs text-emerald-700 dark:text-emerald-400">
                    💡 {language === 'en' ? 'Micro-agreement:' : 'Micro-acordo:'}
                  </strong>
                  <p className="text-sm text-foreground/80 mt-1">{renderSafeText(diff.micro_acordo)}</p>
                </div>
              )}
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
            <p className="text-sm text-muted-foreground italic">{renderSafeText(zona.descricao)}</p>
          )}
          
          {/* Shadow Cycle */}
          {zona.ciclo_sombra && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 space-y-3">
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4" />
                {language === 'en' ? 'The Shadow Cycle' : 'O Ciclo de Sombra'}
              </h4>
              {/* Handle object format with gatilho, reacao_sensor, etc. */}
              {typeof zona.ciclo_sombra === 'string' ? (
                <p className="text-sm">{renderSafeText(zona.ciclo_sombra)}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {zona.ciclo_sombra?.gatilho && (
                    <p><strong>{language === 'en' ? 'Trigger:' : 'Gatilho:'}</strong> {renderSafeText(zona.ciclo_sombra.gatilho)}</p>
                  )}
                  {zona.ciclo_sombra?.reacao_sensor && (
                    <p><strong>{language === 'en' ? 'Sensor reaction:' : 'Reação do Sensor:'}</strong> {renderSafeText(zona.ciclo_sombra.reacao_sensor)}</p>
                  )}
                  {zona.ciclo_sombra?.interpretacao_condutor && (
                    <p><strong>{language === 'en' ? 'Conductor interpretation:' : 'Interpretação do Condutor:'}</strong> {renderSafeText(zona.ciclo_sombra.interpretacao_condutor)}</p>
                  )}
                  {zona.ciclo_sombra?.reacao_condutor && (
                    <p><strong>{language === 'en' ? 'Conductor reaction:' : 'Reação do Condutor:'}</strong> {renderSafeText(zona.ciclo_sombra.reacao_condutor)}</p>
                  )}
                  {zona.ciclo_sombra?.interpretacao_sensor && (
                    <p><strong>{language === 'en' ? 'Sensor interpretation:' : 'Interpretação do Sensor:'}</strong> {renderSafeText(zona.ciclo_sombra.interpretacao_sensor)}</p>
                  )}
                  {zona.ciclo_sombra?.retroalimentacao && (
                    <p className="text-muted-foreground italic">{renderSafeText(zona.ciclo_sombra.retroalimentacao)}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sensor under stress - supports both sensor_sob_estresse and bloco_sensor keys */}
          {(zona.sensor_sob_estresse || zona.bloco_sensor) && (() => {
            const sensor = zona.sensor_sob_estresse || zona.bloco_sensor;
            return (
              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2 text-sm">
                  🧭 {sensor?.nome || (language === 'en' ? 'Direction Sensor' : 'Sensor de Direção')}
                  {" "}({language === 'en' ? 'Direction Sensor' : 'Sensor de Direção'})
                </h4>
                {(sensor?.comportamento || sensor?.como_reage_sob_estresse) && (
                  <p className="text-sm mb-2">{renderSafeText(sensor.comportamento || sensor.como_reage_sob_estresse)}</p>
                )}
                {(sensor?.impacto_no_outro || sensor?.como_impacta_outro) && (
                  <p className="text-xs text-muted-foreground">
                    <strong>{language === 'en' ? 'Impact:' : 'Impacto:'}</strong> {renderSafeText(sensor.impacto_no_outro || sensor.como_impacta_outro)}
                  </p>
                )}
                {sensor?.o_que_precisa_do_outro && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>{language === 'en' ? 'Needs:' : 'Precisa:'}</strong> {renderSafeText(sensor.o_que_precisa_do_outro)}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Conductor under stress - supports both condutor_sob_estresse and bloco_condutor keys */}
          {(zona.condutor_sob_estresse || zona.bloco_condutor) && (() => {
            const condutor = zona.condutor_sob_estresse || zona.bloco_condutor;
            return (
              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2 text-sm">
                  ⚓ {condutor?.nome || (language === 'en' ? 'Course Conductor' : 'Condutor de Curso')}
                  {" "}({language === 'en' ? 'Course Conductor' : 'Condutor de Curso'})
                </h4>
                {(condutor?.comportamento || condutor?.como_reage_sob_estresse) && (
                  <p className="text-sm mb-2">{renderSafeText(condutor.comportamento || condutor.como_reage_sob_estresse)}</p>
                )}
                {(condutor?.impacto_no_outro || condutor?.como_impacta_outro) && (
                  <p className="text-xs text-muted-foreground">
                    <strong>{language === 'en' ? 'Impact:' : 'Impacto:'}</strong> {renderSafeText(condutor.impacto_no_outro || condutor.como_impacta_outro)}
                  </p>
                )}
                {condutor?.o_que_precisa_do_outro && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>{language === 'en' ? 'Needs:' : 'Precisa:'}</strong> {renderSafeText(condutor.o_que_precisa_do_outro)}
                  </p>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    );
  };

  // ============== TABELA TRADUÇÃO (Identity v2.0 with Dynamic Fallback) ==============
  const renderTabelaTraducaoV2 = () => {
    const tabela = content.tabela_traducao;
    
    // Support both v2.0 (traducoes_sensor/traducoes_condutor) and legacy (sensor/condutor) formats
    const traducoesSensor = tabela?.traducoes_sensor;
    const traducoesCondutor = tabela?.traducoes_condutor;
    
    // Extract translations array - handles nested structure with .traducoes
    let sensorItems = asArray<any>(traducoesSensor?.traducoes || (tabela as any)?.sensor);
    let condutorItems = asArray<any>(traducoesCondutor?.traducoes || (tabela as any)?.condutor);
    
    // Use dynamic translation table if backend data is empty
    if (sensorItems.length === 0 && condutorItems.length === 0 && dynamicTranslationTable) {
      sensorItems = dynamicTranslationTable.sensor;
      condutorItems = dynamicTranslationTable.condutor;
    }
    
    // If still no data, don't render
    if (sensorItems.length === 0 && condutorItems.length === 0) return null;
    
    // Get header titles from data
    const sensorTitle = traducoesSensor?.titulo || (language === 'en' ? 'When the DIRECTION SENSOR...' : 'Quando o SENSOR DE DIREÇÃO...');
    const condutorTitle = traducoesCondutor?.titulo || (language === 'en' ? 'When the COURSE CONDUCTOR...' : 'Quando o CONDUTOR DE CURSO...');

    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border-indigo-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-base">
              {tabela?.titulo || (language === 'en' ? 'Couple Translation Table' : 'Tabela de Tradução do Casal')}
            </CardTitle>
          </div>
          {tabela?.descricao && (
            <p className="text-sm text-muted-foreground italic">{tabela.descricao}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sensor translations */}
          {sensorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-400 text-sm flex items-center gap-2">
                🧭 {sensorTitle}
              </h4>
              {sensorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 text-sm">
                  <span className="font-medium">{renderSafeText(item.comportamento)}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-purple-700 dark:text-purple-400">{renderSafeText(item.significado ?? item.significa)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Conductor translations */}
          {condutorItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700 dark:text-orange-400 text-sm flex items-center gap-2">
                ⚓ {condutorTitle}
              </h4>
              {condutorItems.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-sm">
                  <span className="font-medium">{renderSafeText(item.comportamento)}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="text-orange-700 dark:text-orange-400">{renderSafeText(item.significado ?? item.significa)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== PROTOCOLO PAZ (Identity v2.0 Enhanced with Dynamic Fallback) ==============
  const renderProtocoloPazV2 = () => {
    const protocolo = content.protocolo_paz;
    
    // Use dynamic protocol if no backend data exists
    const effectiveProtocol = protocolo || dynamicPeaceProtocol;
    if (!effectiveProtocol) return null;

    const tempoDuplo = (effectiveProtocol as any)?.tempo_duplo;
    const perguntaRecalibracao = (effectiveProtocol as any)?.pergunta_recalibracao;
    const proibicaoInferencia = (effectiveProtocol as any)?.proibicao_inferencia;
    const proibicaoRegras = asArray<string>(proibicaoInferencia?.regras);
    const legacyRegras = asArray<any>((effectiveProtocol as any)?.regras);

    // Extract tempo_sensor/tempo_condutor (v2.0) OR para_sensor/para_condutor (legacy)
    const tempoSensorText = tempoDuplo?.tempo_sensor || tempoDuplo?.para_sensor || '';
    const tempoCondutorText = tempoDuplo?.tempo_condutor || tempoDuplo?.para_condutor || '';

    return (
      <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base">{effectiveProtocol.titulo || t.sections.protocolo_paz}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tempo Duplo */}
          {(tempoSensorText || tempoCondutorText) && (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {tempoDuplo?.titulo || (language === 'en' ? '1. Double Time' : '1. Tempo Duplo')}
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {tempoSensorText && (
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                      🧭 {language === 'en' ? 'Direction Sensor' : 'Sensor de Direção'}
                    </p>
                    <p className="text-sm">{tempoSensorText}</p>
                  </div>
                )}
                {tempoCondutorText && (
                  <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                      ⚓ {language === 'en' ? 'Course Conductor' : 'Condutor de Curso'}
                    </p>
                    <p className="text-sm">{tempoCondutorText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pergunta de Recalibração */}
          {perguntaRecalibracao && (perguntaRecalibracao.pergunta) && (
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                {perguntaRecalibracao?.titulo || (language === 'en' ? '2. Recalibration Question' : '2. Pergunta de Recalibração')}
              </h4>
              <p className="text-sm italic font-medium text-center py-2 bg-emerald-500/10 rounded-lg px-4">
                "{perguntaRecalibracao?.pergunta || ''}"
              </p>
            </div>
          )}

          {/* Proibição de Inferência */}
          {proibicaoRegras.length > 0 && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {proibicaoInferencia?.titulo || (language === 'en' ? '3. Inference Prohibition' : '3. Proibição de Inferência')}
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
          {legacyRegras.length > 0 && legacyRegras.map((regra: any, i: number) => (
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

  // ============== AÇÃO PRÁTICA 24H (Identity v2.0) ==============
  const renderAcaoPratica = () => {
    const acao = content.acao_pratica_24h;
    if (!acao) return null;

    const passos = [acao.passo_1, acao.passo_2, acao.passo_3].filter(Boolean);

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
        <CardContent className="space-y-4">
          {acao.descricao && (
            <p className="text-sm text-muted-foreground italic">{acao.descricao}</p>
          )}
          
          {/* 3 Steps */}
          {passos.length > 0 && (
            <div className="space-y-3">
              {passos.map((passo: string, i: number) => (
                <div 
                  key={i} 
                  className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/90">{passo}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Fallback for legacy format without steps */}
          {passos.length === 0 && acao.acao && (
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">{renderSafeText(acao.acao)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== COMUNICAÇÃO EM CRISE (Crisis Communication) ==============
  const renderCrisisCommunication = () => {
    // Try to extract DISC data from content
    const discA = content.dados_grafico?.pessoa_a?.disc || content.dados_usuario_a?.disc;
    const discB = content.dados_grafico?.pessoa_b?.disc || content.dados_usuario_b?.disc;
    const nameA = content.dados_grafico?.pessoa_a?.nome || content.metafora_barco?.papeis_identificados?.sensor?.nome || 'Pessoa A';
    const nameB = content.dados_grafico?.pessoa_b?.nome || content.metafora_barco?.papeis_identificados?.condutor?.nome || 'Pessoa B';

    if (!discA || !discB) return null;

    const profiles: CoupleProfiles = {
      personA: { name: nameA, disc: discA },
      personB: { name: nameB, disc: discB }
    };

    const crisisTable = generateCrisisCommunicationTable(profiles, language);

    const sectionTitle = {
      pt: 'Comunicação em Crise',
      'pt-pt': 'Comunicação em Crise',
      en: 'Crisis Communication'
    };

    const columnLabels = {
      pt: { situacao: 'Situação', falar: `Como ${nameA} deve falar`, ouvir: `Como ${nameB} deve ouvir` },
      'pt-pt': { situacao: 'Situação', falar: `Como ${nameA} deve falar`, ouvir: `Como ${nameB} deve ouvir` },
      en: { situacao: 'Situation', falar: `How ${nameA} should speak`, ouvir: `How ${nameB} should hear` }
    };

    const labels = columnLabels[language];

    return (
      <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-base">{sectionTitle[language]}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Practical phrases for stress and feedback situations'
              : 'Frases práticas para situações de estresse e feedback'}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground w-1/5">{labels.situacao}</th>
                  <th className="text-left py-2 px-3 font-semibold text-orange-700 dark:text-orange-400 w-2/5">🗣️ {labels.falar}</th>
                  <th className="text-left py-2 px-3 font-semibold text-blue-700 dark:text-blue-400 w-2/5">👂 {labels.ouvir}</th>
                </tr>
              </thead>
              <tbody>
              {crisisTable.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">{renderSafeText(row.situacao)}</td>
                    <td className="py-3 px-3 text-foreground/80 italic">{renderSafeText(row.como_falar)}</td>
                    <td className="py-3 px-3 text-foreground/80 italic">{renderSafeText(row.como_ouvir)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {crisisTable.map((row, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs">{i + 1}</span>
                  {renderSafeText(row.situacao)}
                </div>
                <div className="pl-8 space-y-2">
                  <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">🗣️ {labels.falar}</p>
                    <p className="text-sm italic text-foreground/80">{renderSafeText(row.como_falar)}</p>
                  </div>
                  <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">👂 {labels.ouvir}</p>
                    <p className="text-sm italic text-foreground/80">{renderSafeText(row.como_ouvir)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insight Box */}
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'These phrases translate natural behaviors into safe language for the relationship. Use them especially in moments of tension.'
                  : 'Essas frases traduzem comportamentos naturais em linguagem segura para a relação. Use-as especialmente em momentos de tensão.'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============== REFLEXÕES PRÁTICAS (Identity v2.2) ==============
  const renderReflexoesPraticas = () => {
    const reflexoes = content.reflexoes_praticas;
    if (!reflexoes || !Array.isArray(reflexoes) || reflexoes.length === 0) return null;

    return (
      <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-base">
              {language === 'en' ? 'Practical Reflections' : 'Reflexões Práticas do Casal'}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Consider doing X so that Y perceives Z' 
              : 'Orientações do tipo "Considere fazer X para que Y perceba Z"'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {reflexoes.map((reflexao: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  {reflexao.para && (
                    <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">
                      Para: {reflexao.para}
                    </p>
                  )}
                  <p className="text-sm font-medium text-foreground">
                    {renderSafeText(reflexao.acao)}
                  </p>
                  {reflexao.efeito && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      → {renderSafeText(reflexao.efeito)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== RITUAIS DO CASAL (Identity v2.2) ==============
  const renderRituaisCasal = () => {
    const rituais = content.rituais_casal;
    if (!rituais) return null;

    const diarios = asArray<string>(rituais.diarios);
    const semanais = asArray<string>(rituais.semanais);
    const mensais = asArray<string>(rituais.mensais);

    if (diarios.length === 0 && semanais.length === 0 && mensais.length === 0) return null;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">
              {language === 'en' ? 'Couple Rituals' : 'Rituais do Casal'}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Anchors that keep the couple connected' 
              : 'Âncoras que mantêm o casal conectado'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {diarios.length > 0 && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                ☀️ {language === 'en' ? 'Daily' : 'Diário'}
              </h4>
              <ul className="space-y-2">
                {diarios.map((ritual: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span>{renderSafeText(ritual)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {semanais.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                📅 {language === 'en' ? 'Weekly' : 'Semanal'}
              </h4>
              <ul className="space-y-2">
                {semanais.map((ritual: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>{renderSafeText(ritual)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mensais.length > 0 && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                🗓️ {language === 'en' ? 'Monthly' : 'Mensal'}
              </h4>
              <ul className="space-y-2">
                {mensais.map((ritual: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>{renderSafeText(ritual)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============== FRASES-PONTE (Identity v2.2) ==============
  const renderFrasesPonte = () => {
    const frases = content.frases_ponte;
    if (!frases || !Array.isArray(frases) || frases.length === 0) return null;

    return (
      <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">
              {language === 'en' ? 'Bridge Phrases' : 'Frases que Constroem'}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Replace reactive communication with proactive words' 
              : 'Substitua comunicação reativa por palavras proativas'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {frases.map((frase: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-500 font-medium text-sm">❌</span>
                <div>
                  <span className="text-xs text-muted-foreground">{language === 'en' ? 'Instead of:' : 'Ao invés de:'}</span>
                  <p className="text-sm text-foreground/80 line-through">{renderSafeText(frase.ao_inves_de)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 font-medium text-sm">✓</span>
                <div>
                  <span className="text-xs text-muted-foreground">{language === 'en' ? 'Try:' : 'Experimente:'}</span>
                  <p className="text-sm font-medium text-foreground">{renderSafeText(frase.experimente)}</p>
                </div>
              </div>
              {frase.porque_funciona && (
                <p className="text-xs text-muted-foreground italic pl-6">
                  💡 {renderSafeText(frase.porque_funciona)}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // ============== ALERTAS DO DIA-A-DIA (Identity v2.2) ==============
  const renderAlertasDiaDia = () => {
    const alertas = content.alertas_dia_a_dia;
    if (!alertas || !Array.isArray(alertas) || alertas.length === 0) return null;

    return (
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">
              {language === 'en' ? 'Daily Alerts' : 'Alertas do Dia-a-Dia'}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Behaviors under pressure and how to support' 
              : 'Comportamentos sob pressão e como apoiar'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertas.map((alerta: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-400 text-sm">
                    {alerta.pessoa} {language === 'en' ? 'under pressure' : 'sob pressão'}
                  </p>
                  <p className="text-sm text-foreground/80">{renderSafeText(alerta.comportamento)}</p>
                </div>
              </div>
              {alerta.considere && (
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                    💡 {language === 'en' ? 'Consider:' : 'Considere:'}
                  </p>
                  <p className="text-sm text-foreground/80">{renderSafeText(alerta.considere)}</p>
                </div>
              )}
              {alerta.efeito && (
                <p className="text-xs text-muted-foreground italic">
                  → {language === 'en' ? 'Effect:' : 'Efeito:'} {renderSafeText(alerta.efeito)}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

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

        {/* PROMPT ÚNICO v1.0 - 9 Seções Obrigatórias */}
        <div className="space-y-6 mt-6">
          {/* 1. Visão Geral do Casal */}
          {renderVisaoGeral()}
          
          {/* 2. Papéis Naturais */}
          {renderPapeisNaturais()}
          
          {/* 3. Forças Centrais */}
          {renderForcasCentrais()}
          
          {/* 4. ❤️ O Amor no Casal (Seção Central) */}
          {renderAmorNoCasal()}
          
          {/* 5. Tensões Naturais */}
          {renderTensoesNaturais()}
          
          {/* 6. Zona de Ajuste */}
          {renderZonaDeAjusteV1()}
          
          {/* 7. Protocolo de Liderança */}
          {renderProtocoloLideranca()}
          
          {/* 8. Tradução para o Dia a Dia */}
          {renderTraducaoDiaADia()}
          
          {/* 9. Síntese Executiva */}
          {renderSinteseExecutiva()}
          
          {/* 10. Cenários da Vida Real (Carreira, Finanças, Saúde, Espiritualidade) */}
          {renderCenariosVidaReal()}
          
          {/* 7 PILLARS SECTIONS - Visual Charts */}
          {renderSynergyRadarChart()}
          {render7PillarsTemperaments()}
          {render7PillarsIntelligences()}
          {render7PillarsArchetypes()}
          {render7PillarsConnectionStyles()}
          {render7PillarsNello16()}
          
          {/* Additional v2.0/v2.2 sections */}
          {renderZonaHarmonia()}
          {/* renderZonaAjuste removed - already rendered by renderZonaDeAjusteV1 above */}
          {renderZonaChoque()}
          {renderTabelaTraducaoV2()}
          {renderCrisisCommunication()}
          {renderProtocoloPazV2()}
          
          {/* Identity v2.2 - Livro de Bordo Premium */}
          {renderReflexoesPraticas()}
          {renderFrasesPonte()}
          {renderAlertasDiaDia()}
          {renderRituaisCasal()}
          
          {renderAcaoPratica()}
          
          {/* Legacy sections for backwards compatibility */}
          {renderTrafficLight()}
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
