import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { PDFPageProxy } from 'pdfjs-dist';
import type { Worker as OcrWorker } from 'tesseract.js';
import { parseReportCover } from './parseReportCover';
import type { PdfAnalysis, PdfPageText, PdfTextItem } from './types';

const MIN_EMBEDDED_TEXT_LENGTH = 55;
const OCR_RENDER_SCALE = 1.5;
const OCR_LINE_HEIGHT = 18;
const OCR_FIRST_LINE_Y = 800;
const MAX_AMOUNT = 100_000_000;
const MAX_AMOUNTS_SHOWN = 80;
const EXCERPT_LENGTH = 1800;
const PAGE_TEXT_LENGTH = 1600;

const AMOUNT_PATTERN = /(?:\$\s*)?([0-9]{1,3}(?:[., ][0-9]{3})+)(?!\d)/g;

const collapseWhitespace = (text: string) => text.replace(/\s+/g, ' ');

function extractAmounts(text: string) {
  const amounts = [...text.matchAll(AMOUNT_PATTERN)]
    .map((match) => Number(match[1].replace(/[., ]/g, '')))
    .filter((amount) => amount > 0 && amount < MAX_AMOUNT);
  return [...new Set(amounts)].slice(0, MAX_AMOUNTS_SHOWN);
}

async function recognizePage(page: PDFPageProxy, worker: OcrWorker) {
  const viewport = page.getViewport({ scale: OCR_RENDER_SCALE });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
  const text = (await worker.recognize(canvas)).data.text;
  canvas.width = 0;
  canvas.height = 0;
  return text;
}

/**
 * Lee un PDF en el navegador. Usa el texto incrustado de cada página y recurre a OCR
 * local solo en las páginas escaneadas.
 */
export async function analyzePdf(
  file: File,
  period: string,
  onProgress: (message: string) => void,
): Promise<PdfAnalysis> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = pdfWorker;
  const { createWorker } = await import('tesseract.js');

  const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: PdfPageText[] = [];
  let firstPageItems: PdfTextItem[] = [];
  let worker: OcrWorker | undefined;
  let currentPage = 1;

  try {
    for (currentPage = 1; currentPage <= pdf.numPages; currentPage++) {
      onProgress(`Leyendo página ${currentPage} de ${pdf.numPages} en este equipo…`);
      const page = await pdf.getPage(currentPage);
      const content = await page.getTextContent();
      // Sin `includeMarkedContent`, pdf.js solo entrega elementos de texto.
      let items = content.items as PdfTextItem[];
      let text = items.map((item) => item.str).join(' ').trim();
      const needsOcr = text.length < MIN_EMBEDDED_TEXT_LENGTH;

      if (needsOcr) {
        worker ??= await createWorker('spa', 1, {
          logger: (message) => {
            if (message.status === 'recognizing text') {
              const percent = Math.round((message.progress ?? 0) * 100);
              onProgress(`OCR local · página ${currentPage} de ${pdf.numPages} · ${percent}%`);
            }
          },
        });
        text = await recognizePage(page, worker);
        items = text.split('\n').map((str, index) => ({
          str,
          transform: [1, 0, 0, 1, 0, OCR_FIRST_LINE_Y - index * OCR_LINE_HEIGHT],
        }));
      }

      if (currentPage === 1) firstPageItems = items;
      pages.push({ page: currentPage, text, ocr: needsOcr });
    }
  } finally {
    await worker?.terminate();
  }

  return {
    name: file.name,
    pages: pdf.numPages,
    ocrCount: pages.filter((page) => page.ocr).length,
    amounts: extractAmounts(pages.map((page) => page.text).join('\n')),
    excerpt: collapseWhitespace(pages[0]?.text ?? '').slice(0, EXCERPT_LENGTH),
    pageTexts: pages.map((page) => ({
      ...page,
      text: collapseWhitespace(page.text).slice(0, PAGE_TEXT_LENGTH),
    })),
    draft: parseReportCover(firstPageItems, period),
  };
}
