import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Heart, 
  Baby, 
  Users, 
  Briefcase, 
  UserCog,
  ChevronRight,
  FileText,
} from "lucide-react";
import { RelatorioContextual, type ReportType } from "./RelatorioContextual";
import { ReportContextModal, type ReportContext } from "./ReportContextModal";

interface RelatorioSelectorProps {
  language: 'pt' | 'pt-pt' | 'en';
  hasSavedCodigo: boolean;
}

interface ReportOption {
  type: ReportType;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  title: Record<string, string>;
  description: Record<string, string>;
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    type: 'parceiro',
    icon: <Heart className="w-5 h-5" />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    title: {
      pt: "Parceiro(a)",
      'pt-pt': "Parceiro(a)",
      en: "Partner"
    },
    description: {
      pt: "Para seu cônjuge ou namorado(a)",
      'pt-pt': "Para o teu cônjuge ou namorado(a)",
      en: "For your spouse or partner"
    }
  },
  {
    type: 'pai_para_filho',
    icon: <Baby className="w-5 h-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    title: {
      pt: "Para Filhos",
      'pt-pt': "Para Filhos",
      en: "For Children"
    },
    description: {
      pt: "Ajude seus filhos a entenderem você",
      'pt-pt': "Ajuda os teus filhos a entenderem-te",
      en: "Help your children understand you"
    }
  },
  {
    type: 'filho_para_pai',
    icon: <Users className="w-5 h-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    title: {
      pt: "Para Pais",
      'pt-pt': "Para Pais",
      en: "For Parents"
    },
    description: {
      pt: "Ajude seus pais a entenderem você",
      'pt-pt': "Ajuda os teus pais a entenderem-te",
      en: "Help your parents understand you"
    }
  },
  {
    type: 'para_gestor',
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    title: {
      pt: "Para Gestor",
      'pt-pt': "Para Gestor",
      en: "For Manager"
    },
    description: {
      pt: "Manual para seu chefe liderar você",
      'pt-pt': "Manual para o teu chefe liderar-te",
      en: "Manual for your boss to lead you"
    }
  },
  {
    type: 'para_equipe',
    icon: <UserCog className="w-5 h-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    title: {
      pt: "Para Equipe",
      'pt-pt': "Para Equipa",
      en: "For Team"
    },
    description: {
      pt: "Seu estilo de liderança para a equipe",
      'pt-pt': "O teu estilo de liderança para a equipa",
      en: "Your leadership style for the team"
    }
  }
];

const TRANSLATIONS = {
  pt: {
    sectionTitle: "Relatórios para Compartilhar",
    sectionDescription: "Crie relatórios personalizados para diferentes pessoas da sua vida",
    backToList: "Voltar",
  },
  'pt-pt': {
    sectionTitle: "Relatórios para Partilhar",
    sectionDescription: "Cria relatórios personalizados para diferentes pessoas da tua vida",
    backToList: "Voltar",
  },
  en: {
    sectionTitle: "Reports to Share",
    sectionDescription: "Create personalized reports for different people in your life",
    backToList: "Back",
  }
};

export const RelatorioSelector = ({ language, hasSavedCodigo }: RelatorioSelectorProps) => {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [pendingType, setPendingType] = useState<ReportType | null>(null);
  const [showContextModal, setShowContextModal] = useState(false);
  const [reportContext, setReportContext] = useState<ReportContext | null>(null);
  const t = TRANSLATIONS[language];

  const handleCardClick = (type: ReportType) => {
    if (!hasSavedCodigo) return;
    setPendingType(type);
    setShowContextModal(true);
  };

  const handleContextSubmit = (context: ReportContext) => {
    setReportContext(context);
    setShowContextModal(false);
    setSelectedType(pendingType);
    setPendingType(null);
  };

  const handleContextSkip = () => {
    setReportContext(null);
    setShowContextModal(false);
    setSelectedType(pendingType);
    setPendingType(null);
  };

  const handleCloseSheet = () => {
    setSelectedType(null);
    setReportContext(null);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{t.sectionTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.sectionDescription}</p>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {REPORT_OPTIONS.map((option) => (
            <Card 
              key={option.type}
              className={`cursor-pointer hover:border-primary/50 transition-all hover:shadow-md ${
                !hasSavedCodigo ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleCardClick(option.type)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className={option.color}>{option.icon}</span>
                </div>
                <h4 className="font-medium text-sm mb-1">{option.title[language]}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{option.description[language]}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Context Modal */}
      {pendingType && (
        <ReportContextModal
          open={showContextModal}
          onOpenChange={setShowContextModal}
          reportType={pendingType}
          language={language}
          onSubmit={handleContextSubmit}
          onSkip={handleContextSkip}
        />
      )}

      {/* Sheet for selected report */}
      <Sheet open={selectedType !== null} onOpenChange={(open) => !open && handleCloseSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCloseSheet}
              className="w-fit -ml-2 mb-2"
            >
              ← {t.backToList}
            </Button>
            <SheetTitle className="sr-only">
              {selectedType && REPORT_OPTIONS.find(o => o.type === selectedType)?.title[language]}
            </SheetTitle>
          </SheetHeader>
          
          {selectedType && (
            <RelatorioContextual 
              reportType={selectedType}
              language={language}
              hasSavedCodigo={hasSavedCodigo}
              context={reportContext}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default RelatorioSelector;
