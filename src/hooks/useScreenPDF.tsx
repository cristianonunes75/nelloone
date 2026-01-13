import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ScreenPDFOptions {
  fileName?: string;
  scale?: number;
  backgroundColor?: string;
  quality?: number;
  language?: 'pt' | 'pt-pt' | 'en';
}

const TEXTS = {
  pt: {
    generating: 'Gerando PDF...',
    success: 'PDF baixado com sucesso!',
    error: 'Erro ao gerar PDF',
    noContent: 'Nenhum conteúdo para capturar'
  },
  'pt-pt': {
    generating: 'A gerar PDF...',
    success: 'PDF descarregado com sucesso!',
    error: 'Erro ao gerar PDF',
    noContent: 'Nenhum conteúdo para capturar'
  },
  en: {
    generating: 'Generating PDF...',
    success: 'PDF downloaded successfully!',
    error: 'Error generating PDF',
    noContent: 'No content to capture'
  }
};

export const useScreenPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFFromElement = useCallback(async (
    element: HTMLElement | null,
    options: ScreenPDFOptions = {}
  ) => {
    const {
      fileName = 'relatorio-nello',
      scale = 2,
      backgroundColor = '#ffffff',
      quality = 0.95,
      language = 'pt'
    } = options;

    const t = TEXTS[language] || TEXTS.pt;

    if (!element) {
      toast.error(t.noContent);
      return false;
    }

    setIsGenerating(true);
    const toastId = toast.loading(t.generating);

    try {
      // Store original styles
      const originalStyle = element.style.cssText;
      
      // Prepare element for capture - ensure all content is visible
      element.style.overflow = 'visible';
      element.style.maxHeight = 'none';
      element.style.height = 'auto';

      // Wait for any lazy images to load
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

      // Small delay to ensure all styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the element with html2canvas
      const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Ensure cloned element shows all content
          clonedElement.style.overflow = 'visible';
          clonedElement.style.maxHeight = 'none';
          clonedElement.style.height = 'auto';
          
          // Remove any fixed positioned elements that might interfere
          const fixedElements = clonedDoc.querySelectorAll('[style*="position: fixed"]');
          fixedElements.forEach(el => (el as HTMLElement).style.display = 'none');
          
          // Also hide any floating menus
          const floatingMenus = clonedDoc.querySelectorAll('[class*="fixed"]');
          floatingMenus.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.classList.contains('fixed')) {
              htmlEl.style.display = 'none';
            }
          });
        }
      });

      // Restore original styles
      element.style.cssText = originalStyle;

      // Calculate PDF dimensions - A4 in mm
      const imgWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // Add image to PDF, handling multiple pages if needed
      const imgData = canvas.toDataURL('image/jpeg', quality);

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is taller than one page
      while (heightLeft > 0) {
        position = -pageHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        pageNumber++;
      }

      // Add footer with page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `NELLO ONE • Página ${i} de ${totalPages}`,
          105,
          292,
          { align: 'center' }
        );
      }

      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`${fileName}-${timestamp}.pdf`);

      toast.success(t.success, { id: toastId });
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t.error, { id: toastId });
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generatePDFFromRef = useCallback(async (
    ref: React.RefObject<HTMLElement>,
    options: ScreenPDFOptions = {}
  ) => {
    return generatePDFFromElement(ref.current, options);
  }, [generatePDFFromElement]);

  return {
    generatePDFFromElement,
    generatePDFFromRef,
    isGenerating
  };
};
