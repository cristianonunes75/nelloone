import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

// Import PDF generators
import { generateInteligenciasPremiumPDF } from "@/lib/pdfInteligenciasMultiplas";
import { generateArquetiposPremiumPDF } from "@/lib/pdfArquetiposPremium";
import { downloadDISCPremiumPDF, generateDISCPremiumPDF } from "@/lib/pdfDisc";
import { generateEneagramaPDF } from "@/lib/pdfEneagrama";
import { generateTemperamentosPDF } from "@/lib/pdfTemperamentos";
import { generateNello16PremiumPDF, downloadNello16PremiumPDF } from "@/lib/pdfNello16Personality";
import { generateEstilosConexaoPremiumPDF } from "@/lib/pdfEstilosConexaoAfetiva";

interface PDFEmailOptions {
  testType: string;
  testName: string;
  userName: string;
  userEmail: string;
  language: 'pt' | 'pt-pt' | 'en';
  resultData: any;
}

export const usePDFEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendPDFByEmail = async (options: PDFEmailOptions) => {
    setIsSending(true);
    
    try {
      const { testType, testName, userName, userEmail, language, resultData } = options;
      
      // Generate PDF based on test type and get base64
      let pdfBase64 = "";
      
      switch (testType) {
        case "disc":
          const discDoc = generateDISCPremiumPDF({
            userName,
            scores: resultData.scores,
            dominantProfile: resultData.dominantProfile,
            language
          });
          pdfBase64 = discDoc.output('datauristring').split(',')[1];
          break;
          
        case "mbti":
          const nello16Doc = generateNello16PremiumPDF({
            userName,
            personalityType: resultData.type,
            dimensionScores: resultData.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
            language
          });
          pdfBase64 = nello16Doc.output('datauristring').split(',')[1];
          break;
          
        case "eneagrama":
          // For tests that save directly, we need a different approach
          // Create a simple PDF with the results
          const eneagramaDoc = new jsPDF();
          eneagramaDoc.text(`Eneagrama - Tipo ${resultData.primaryType}`, 20, 20);
          pdfBase64 = eneagramaDoc.output('datauristring').split(',')[1];
          break;
          
        case "temperamentos":
          const tempDoc = new jsPDF();
          tempDoc.text(`Temperamentos - ${resultData.primary?.name}`, 20, 20);
          pdfBase64 = tempDoc.output('datauristring').split(',')[1];
          break;
          
        case "linguagens_amor":
          const estilosDoc = new jsPDF();
          estilosDoc.text(`Estilos de Conexão Afetiva - ${resultData.primary?.name?.[language] || resultData.primary?.name}`, 20, 20);
          pdfBase64 = estilosDoc.output('datauristring').split(',')[1];
          break;
          
        case "inteligencias_multiplas":
          const intDoc = new jsPDF();
          intDoc.text(`Inteligências Múltiplas`, 20, 20);
          pdfBase64 = intDoc.output('datauristring').split(',')[1];
          break;
          
        case "arquetipos_proposito":
          const arqDoc = new jsPDF();
          arqDoc.text(`Arquétipos com Propósito`, 20, 20);
          pdfBase64 = arqDoc.output('datauristring').split(',')[1];
          break;
          
        default:
          throw new Error(`Unsupported test type: ${testType}`);
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
