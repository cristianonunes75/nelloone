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
      quality = 0.92,
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
      await new Promise(resolve => setTimeout(resolve, 200));

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

      // A4 dimensions in mm
      const pageWidthMM = 210;
      const pageHeightMM = 297;
      const marginMM = 10; // Margin for footer
      const usableHeightMM = pageHeightMM - marginMM;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate how much of the canvas fits per page
      const imgWidthMM = pageWidthMM;
      const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;
      
      // Calculate page height in canvas pixels
      const pageHeightPx = (usableHeightMM / imgHeightMM) * canvas.height;
      
      // Number of pages needed
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        // Calculate the portion of the canvas for this page
        const sourceY = pageNum * pageHeightPx;
        const sourceHeight = Math.min(pageHeightPx, canvas.height - sourceY);
        
        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          // Fill with background color
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          // Draw the portion of the main canvas
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,  // Source rectangle
            0, 0, canvas.width, sourceHeight          // Destination rectangle
          );
        }

        // Calculate the height of this slice in mm
        const sliceHeightMM = (sourceHeight / canvas.height) * imgHeightMM;

        // Add this page slice to PDF
        const pageImgData = pageCanvas.toDataURL('image/jpeg', quality);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidthMM, sliceHeightMM);
      }

      // Add footer with page numbers
      const pagesCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pagesCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `NELLO ONE • Página ${i} de ${pagesCount}`,
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
