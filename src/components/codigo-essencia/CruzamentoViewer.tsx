import { useState } from "react";
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
  Download,
  Share2
} from "lucide-react";
import { toast } from "sonner";

interface CruzamentoViewerProps {
  crossing: {
    id: string;
    content: any;
    relationship_type: string;
    public_token: string;
    is_public_active: boolean;
  };
  language: 'pt' | 'pt-pt' | 'en';
  onBack: () => void;
}

const TRANSLATIONS = {
  pt: {
    back: "Voltar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    download: "Baixar PDF",
    relationshipLabels: {
      spouse: "Relatório de Casal",
      parent_child: "Relatório Familiar",
      siblings: "Relatório entre Irmãos",
      friends: "Relatório de Amizade"
    },
    sections: {
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
    }
  },
  'pt-pt': {
    back: "Voltar",
    copyLink: "Copiar link",
    linkCopied: "Link copiado!",
    download: "Transferir PDF",
    relationshipLabels: {
      spouse: "Relatório de Casal",
      parent_child: "Relatório Familiar",
      siblings: "Relatório entre Irmãos",
      friends: "Relatório de Amizade"
    },
    sections: {
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
    }
  },
  en: {
    back: "Back",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    download: "Download PDF",
    relationshipLabels: {
      spouse: "Couple Report",
      parent_child: "Family Report",
      siblings: "Sibling Report",
      friends: "Friendship Report"
    },
    sections: {
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
    }
  }
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  perfil_conjunto: <Users className="w-5 h-5 text-primary" />,
  dinamica_familiar: <Users className="w-5 h-5 text-primary" />,
  dinamica_fraternal: <Users className="w-5 h-5 text-primary" />,
  harmonias: <Heart className="w-5 h-5 text-pink-500" />,
  forcas_da_relacao: <Heart className="w-5 h-5 text-pink-500" />,
  complementaridades: <Heart className="w-5 h-5 text-pink-500" />,
  tensoes: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  pontos_de_atencao: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  atritos_tipicos: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  desafios_tipicos: <Target className="w-5 h-5 text-blue-500" />,
  compromissos_usuario_a: <Check className="w-5 h-5 text-emerald-500" />,
  compromissos_usuario_b: <Check className="w-5 h-5 text-emerald-500" />,
  como_o_pai_pode_apoiar: <HelpCircle className="w-5 h-5 text-purple-500" />,
  como_o_filho_pode_comunicar: <MessageCircle className="w-5 h-5 text-purple-500" />,
  como_melhorar: <Target className="w-5 h-5 text-blue-500" />,
  perguntas_para_casal: <MessageCircle className="w-5 h-5 text-primary" />,
  perguntas_para_conversa: <MessageCircle className="w-5 h-5 text-primary" />,
  perguntas: <MessageCircle className="w-5 h-5 text-primary" />
};

export const CruzamentoViewer = ({ crossing, language, onBack }: CruzamentoViewerProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const t = TRANSLATIONS[language];
  const content = crossing.content || {};

  const handleCopyLink = () => {
    const link = `${window.location.origin}/cruzamento/${crossing.public_token}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success(t.linkCopied);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const renderContent = (data: any) => {
    if (!data) return null;
    
    if (typeof data === 'string') {
      return <p className="text-foreground/80 whitespace-pre-line">{data}</p>;
    }
    
    if (Array.isArray(data)) {
      return (
        <ul className="space-y-2">
          {data.map((item, i) => (
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

  const renderSection = (key: string, data: any) => {
    if (!data) return null;
    
    const title = data.titulo || t.sections[key as keyof typeof t.sections] || key;
    const icon = SECTION_ICONS[key] || <Target className="w-5 h-5 text-primary" />;
    
    // Determine content field
    const contentField = data.resumo || data.conteudo || data.pontos || data.compromissos || 
                        data.sugestoes || data.perguntas || data.situacoes;
    
    if (!contentField) return null;
    
    return (
      <Card key={key}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent(contentField)}
        </CardContent>
      </Card>
    );
  };

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
        </div>
      </div>

      {/* Title Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-pink-500/5 border-primary/20">
        <CardContent className="pt-6 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">
            {t.relationshipLabels[crossing.relationship_type as keyof typeof t.relationshipLabels] || t.relationshipLabels.spouse}
          </h2>
        </CardContent>
      </Card>

      {/* Opening */}
      {content.abertura && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-foreground/80 italic whitespace-pre-line">{content.abertura}</p>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Sections */}
      {Object.entries(content).map(([key, value]) => {
        if (key === 'abertura' || key === 'fechamento') return null;
        return renderSection(key, value);
      })}

      {/* Closing */}
      {content.fechamento && (
        <Card className="bg-gradient-to-br from-primary/5 to-pink-500/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-foreground/80 whitespace-pre-line text-center">{content.fechamento}</p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center px-4">
        {language === 'en' 
          ? "This report is a symbolic tool for self-knowledge. It does not replace therapy or professional counseling."
          : "Este relatório é uma ferramenta simbólica de autoconhecimento. Não substitui terapia ou aconselhamento profissional."}
      </p>
    </div>
  );
};
