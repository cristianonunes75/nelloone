// Extrai conteudo de PDF / Word / imagem no navegador para enviar ao mm-import-roster.
// PDF e Word viram texto; PDF escaneado e imagens viram base64 (visao da IA).
// pdfjs e mammoth sao carregados sob demanda (dynamic import) para NAO inflar o bundle principal.

export interface ExtractResult {
  text: string;
  images: string[];
  warnings: string[];
}

const ANCHOR = /DIRIGENTE\s+ECC/i;

function trimAtAnchor(text: string): string {
  const idx = text.search(ANCHOR);
  return idx >= 0 ? text.slice(idx) : text;
}

let pdfjsPromise: Promise<any> | null = null;
async function getPdfjs(): Promise<any> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const lib: any = await import('pdfjs-dist');
      const worker: any = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      lib.GlobalWorkerOptions.workerSrc = worker.default;
      return lib;
    })();
  }
  return pdfjsPromise;
}

async function loadPdf(buf: ArrayBuffer): Promise<any> {
  const pdfjsLib = await getPdfjs();
  return pdfjsLib.getDocument({ data: buf }).promise;
}

async function pdfToText(pdf: any): Promise<string> {
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += (content.items as any[]).map((it) => it.str).join(' ') + '\n';
  }
  return text;
}

async function pdfPagesToImages(pdf: any, maxPages = 10): Promise<string[]> {
  const images: string[] = [];
  const n = Math.min(pdf.numPages, maxPages);
  for (let i = 1; i <= n; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport }).promise;
    images.push(canvas.toDataURL('image/jpeg', 0.8));
  }
  return images;
}

function imageFileToDataURL(file: File, maxDim = 1700): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas indisponível'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não consegui ler a imagem'));
    };
    img.src = url;
  });
}

async function docxToText(buf: ArrayBuffer): Promise<string> {
  const mammoth: any = await import('mammoth');
  const fn = mammoth.extractRawText || mammoth.default?.extractRawText;
  const res = await fn({ arrayBuffer: buf });
  return res?.value || '';
}

export async function extractFromFiles(files: File[]): Promise<ExtractResult> {
  const textParts: string[] = [];
  const images: string[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    const name = file.name.toLowerCase();
    try {
      if (file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/.test(name)) {
        images.push(await imageFileToDataURL(file));
      } else if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
        const buf = await file.arrayBuffer();
        const pdf = await loadPdf(buf);
        const text = await pdfToText(pdf);
        if (text.trim().length >= 40) {
          textParts.push(text);
        } else {
          warnings.push(`${file.name}: PDF sem texto, lendo como imagem.`);
          images.push(...(await pdfPagesToImages(pdf)));
        }
      } else if (name.endsWith('.docx')) {
        const buf = await file.arrayBuffer();
        textParts.push(await docxToText(buf));
      } else if (name.endsWith('.doc')) {
        warnings.push(`${file.name}: .doc antigo não é suportado, salve como .docx, PDF ou imagem.`);
      } else {
        warnings.push(`${file.name}: formato não suportado.`);
      }
    } catch (e: any) {
      warnings.push(`${file.name}: ${e?.message || 'falha ao ler'}`);
    }
  }

  const text = trimAtAnchor(textParts.join('\n\n')).trim();
  const cappedImages = images.slice(0, 15);
  if (images.length > 15) {
    warnings.push(`Muitas imagens (${images.length}). Processando as 15 primeiras.`);
  }

  return { text, images: cappedImages, warnings };
}
