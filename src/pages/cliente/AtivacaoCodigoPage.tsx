import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Lock, Download, Mail, Loader2 } from "lucide-react";
import { AtivacaoCodigoForm, type HistoriaUsuario } from "@/components/codigo-essencia/AtivacaoCodigoForm";
import { AtivacaoCodigoReport } from "@/components/codigo-essencia/AtivacaoCodigoReport";
import { useAtivacaoCodigo } from "@/hooks/useAtivacaoCodigo";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAtivacaoCodigoFlag } from "@/hooks/useFeatureFlag";
import { useScreenPDF } from "@/hooks/useScreenPDF";
import { usePDFEmail } from "@/hooks/usePDFEmail";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

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
  
  // PDF hooks
  const { generatePDFFromRef, isGenerating: isPDFGenerating } = useScreenPDF();
  const { sendPDFByEmail, isSending: isEmailSending } = usePDFEmail();
  const reportRef = useRef<HTMLDivElement>(null);

  // Admins can always access, even if feature is disabled
  const isAdmin = userRole === 'admin';
  const canAccess = isAdmin || featureEnabled;
  
  const handleDownloadPDF = async () => {
    const testName = language === 'en' ? 'essence-activation' : 'ativacao-codigo';
    await generatePDFFromRef(reportRef as React.RefObject<HTMLElement>, {
      fileName: `nello-one-${testName}`,
      language: language as 'pt' | 'pt-pt' | 'en',
      scale: 2,
      quality: 0.95
    });
  };

  // Generate PDF base64 from screen capture for email
  const generatePDFBase64 = useCallback(async (): Promise<string | null> => {
    const element = reportRef.current;
    if (!element) return null;
    
    try {
      // Store original styles
      const originalStyle = element.style.cssText;
      
      // Prepare element for capture
      element.style.overflow = 'visible';
      element.style.maxHeight = 'none';
      element.style.height = 'auto';

      // Wait for images to load
      const images = element.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture with html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Restore original styles
      element.style.cssText = originalStyle;

      // A4 dimensions
      const pageWidthMM = 210;
      const pageHeightMM = 297;
      const marginMM = 10;
      const usableHeightMM = pageHeightMM - marginMM;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidthMM = pageWidthMM;
      const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;
      const pageHeightPx = (usableHeightMM / imgHeightMM) * canvas.height;
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const sourceY = pageNum * pageHeightPx;
        const sourceHeight = Math.min(pageHeightPx, canvas.height - sourceY);
        
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        }

        const sliceHeightMM = (sourceHeight / canvas.height) * imgHeightMM;
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidthMM, sliceHeightMM);
      }

      // Add footer
      const pagesCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pagesCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(`NELLO ONE • Página ${i} de ${pagesCount}`, 105, 292, { align: 'center' });
      }

      // Return base64 without data URI prefix
      return pdf.output('datauristring').split(',')[1];
    } catch (error) {
      console.error('Error generating PDF base64:', error);
      return null;
    }
  }, []);

  const handleSendEmail = async () => {
    const reportToSend = generatedReport || savedAtivacao?.relatorio;
    if (!user?.email || !reportToSend) return;
    
    const loadingToast = toast.loading(
      language === 'en' ? 'Preparing report...' : 'Preparando relatório...'
    );
    
    // Generate PDF base64 first
    const pdfBase64 = await generatePDFBase64();
    
    toast.dismiss(loadingToast);
    
    if (!pdfBase64) {
      toast.error(
        language === 'en' ? 'Failed to generate PDF' : 'Erro ao gerar PDF'
      );
      return;
    }
    
    await sendPDFByEmail({
      testType: 'ativacao_codigo',
      testName: language === 'en' ? 'Essence Code Activation' : 'Ativação do Código da Essência',
      userName: profile?.full_name || '',
      userEmail: user.email,
      language: language as 'pt' | 'pt-pt' | 'en',
      resultData: reportToSend,
      pdfBase64
    });
  };

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
            {reportToShow && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadPDF}
                  disabled={isPDFGenerating}
                  className="gap-2"
                >
                  {isPDFGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSendEmail}
                  disabled={isEmailSending}
                  className="gap-2"
                >
                  {isEmailSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  Email
                </Button>
              </>
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
          <div ref={reportRef}>
            <AtivacaoCodigoReport 
              report={reportToShow} 
              userName={profile?.full_name}
              language={language}
            />
          </div>
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
