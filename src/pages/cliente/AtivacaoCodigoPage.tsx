import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Lock } from "lucide-react";
import { AtivacaoCodigoForm, type HistoriaUsuario } from "@/components/codigo-essencia/AtivacaoCodigoForm";
import { AtivacaoCodigoReport } from "@/components/codigo-essencia/AtivacaoCodigoReport";
import { useAtivacaoCodigo } from "@/hooks/useAtivacaoCodigo";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAtivacaoCodigoFlag } from "@/hooks/useFeatureFlag";

export default function AtivacaoCodigoPage() {
  const navigate = useNavigate();
  const { user, profile, userRole } = useAuth();
  const { language } = useLanguage();
  const { 
    savedAtivacao, 
    isLoading, 
    isGenerating, 
    generateAtivacao, 
    resetAtivacao,
    hasAtivacao 
  } = useAtivacaoCodigo();
  
  const { isEnabled: featureEnabled, isLoading: featureLoading } = useAtivacaoCodigoFlag();
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Admins can always access, even if feature is disabled
  const isAdmin = userRole === 'admin';
  const canAccess = isAdmin || featureEnabled;

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

  if (isLoading || featureLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Show unavailable message if feature is disabled and user is not admin
  if (!canAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-2 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "en" ? "Back" : "Voltar"}
          </Button>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold mb-3">
              {language === "en" ? "Coming Soon" : "Em Breve"}
            </h1>
            <p className="text-muted-foreground max-w-md">
              {language === "en" 
                ? "This module is not yet available. We're working on something special for you."
                : "Este módulo ainda não está disponível. Estamos preparando algo especial para você."
              }
            </p>
          </div>
        </div>
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
          
          <div className="flex items-center gap-2">
            {isAdmin && !featureEnabled && (
              <span className="text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded">
                Admin Preview
              </span>
            )}
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
