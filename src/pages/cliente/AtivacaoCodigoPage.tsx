import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AtivacaoCodigoForm, type HistoriaUsuario } from "@/components/codigo-essencia/AtivacaoCodigoForm";
import { AtivacaoCodigoReport } from "@/components/codigo-essencia/AtivacaoCodigoReport";
import { useAtivacaoCodigo } from "@/hooks/useAtivacaoCodigo";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AtivacaoCodigoPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const { 
    savedAtivacao, 
    isLoading, 
    isGenerating, 
    generateAtivacao, 
    resetAtivacao,
    hasAtivacao 
  } = useAtivacaoCodigo();
  
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleSubmit = async (historia: HistoriaUsuario) => {
    const report = await generateAtivacao(historia, language);
    if (report) {
      setGeneratedReport(report);
    }
  };

  const handleReset = async () => {
    await resetAtivacao();
    setGeneratedReport(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          {language === "en" ? "Please log in to access this page." : "Por favor, faça login para acessar esta página."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const reportToShow = generatedReport || savedAtivacao?.relatorio;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "en" ? "Back" : "Voltar"}
          </Button>
          
          {hasAtivacao && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {language === "en" ? "Regenerate" : "Refazer"}
            </Button>
          )}
        </div>

        {/* Content */}
        {reportToShow ? (
          <AtivacaoCodigoReport 
            report={reportToShow} 
            userName={profile?.full_name}
            language={language}
          />
        ) : (
          <AtivacaoCodigoForm 
            onSubmit={handleSubmit}
            isLoading={isGenerating}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
