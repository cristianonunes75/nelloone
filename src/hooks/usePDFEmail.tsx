import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Import PDF generators
import { generateInteligenciasPremiumPDF, createInteligenciasPremiumPDF } from "@/lib/pdfInteligenciasMultiplas";
import { createArquetiposPremiumPDF } from "@/lib/pdfArquetiposPremium";
import { generateDISCPremiumPDF } from "@/lib/pdfDisc";
import { generateEneagramaPDF, createEneagramaPDF } from "@/lib/pdfEneagrama";
import { generateTemperamentosPDF, createTemperamentosPDF } from "@/lib/pdfTemperamentos";
import { generateNello16PremiumPDF } from "@/lib/pdfNello16Personality";
import { generateEstilosConexaoPremiumPDF, createEstilosConexaoPDF } from "@/lib/pdfEstilosConexaoAfetiva";

interface PDFEmailOptions {
  testType: string;
  testName: string;
  userName: string;
  userEmail: string;
  language: 'pt' | 'pt-pt' | 'en';
  resultData: any;
  pdfBase64?: string; // Optional: pre-generated PDF base64 (for screen capture PDFs)
}

export const usePDFEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendPDFByEmail = async (options: PDFEmailOptions) => {
    setIsSending(true);
    
    try {
      const { testType, testName, userName, userEmail, language, resultData, pdfBase64: preGeneratedPdf } = options;
      
      // If pre-generated PDF is provided, use it directly
      let pdfBase64 = preGeneratedPdf || "";
      let doc: jsPDF | null = null;
      
      // Only generate PDF if not pre-generated
      if (!pdfBase64) {
        switch (testType) {
          case "disc":
            doc = generateDISCPremiumPDF({
              userName,
              scores: resultData.scores,
              dominantProfile: resultData.dominantProfile,
              language
            });
            break;
            
          case "mbti":
            doc = generateNello16PremiumPDF({
              userName,
              personalityType: resultData.type,
              dimensionScores: resultData.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
              language
            });
            break;
            
          case "eneagrama":
            doc = createEneagramaPDF({
              dominantType: parseInt(resultData.primaryType),
              wing: parseInt(resultData.primaryType) === 9 ? 1 : parseInt(resultData.primaryType) + 1,
              scores: resultData.scores || {}
            }, { userName, language });
            break;
            
          case "temperamentos":
            doc = createTemperamentosPDF({
              primary: resultData.primary,
              secondary: resultData.secondary,
              scores: resultData.scores || { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 },
              interpretation: resultData.interpretation || ''
            }, { userName, language });
            break;
            
          case "estilos_conexao_afetiva":
          case "linguagens_amor": // LEGACY
            doc = createEstilosConexaoPDF(resultData, userName, { language });
            break;
            
          case "inteligencias_multiplas":
            // pdfInteligenciasMultiplas only accepts 'pt' | 'en', map pt-pt → pt
            doc = createInteligenciasPremiumPDF(resultData, userName, { language: language === 'pt-pt' ? 'pt' : language });
            break;
            
          case "arquetipos_proposito":
            doc = createArquetiposPremiumPDF({
              dominant: resultData.primary?.archetype || resultData.dominant || '',
              secondary: resultData.secondary?.archetype || resultData.secondary || '',
              tertiary: resultData.tertiary?.archetype || resultData.tertiary || '',
              allScores: resultData.allScores || {},
              ranking: resultData.ranking || []
            }, { userName, language });
            break;
            
          case "ativacao_codigo":
            // ativacao_codigo requires pre-generated PDF base64
            throw new Error('ativacao_codigo requires pre-generated pdfBase64 option');
            
          default:
            throw new Error(`Unsupported test type: ${testType}`);
        }
        
        if (!doc) {
          throw new Error('Failed to generate PDF');
        }
        
        pdfBase64 = doc.output('datauristring').split(',')[1];
      }
      
      // Send email with PDF attachment
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          to: userEmail,
          name: userName,
          testName,
          testType,
          pdfBase64,
          language
        }
      });
      
      if (error) throw error;
      
      const successMessage = language === 'en' 
        ? 'Report sent to your email!' 
        : language === 'pt-pt' 
          ? 'Relatório enviado para o teu email!' 
          : 'Relatório enviado para seu email!';
      
      toast.success(successMessage);
      return true;
    } catch (error: any) {
      console.error('Error sending PDF email:', error);
      const errorMessage = options.language === 'en' 
        ? 'Failed to send email. Please try again.' 
        : options.language === 'pt-pt' 
          ? 'Erro ao enviar email. Por favor, tenta novamente.' 
          : 'Erro ao enviar email. Por favor, tente novamente.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendPDFByEmail, isSending };
};
