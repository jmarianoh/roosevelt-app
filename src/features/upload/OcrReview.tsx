import { clp } from '../../lib/format';
import type { PdfAnalysis } from './types';

export function OcrReview({ analysis }: { analysis: PdfAnalysis }) {
  return (
    <div className="ocr-review">
      <strong>
        Lectura del PDF · {analysis.pages} páginas · {analysis.ocrCount} escaneada(s) con OCR
      </strong>
      <p>{analysis.excerpt}</p>
      <span>Montos identificados: {analysis.amounts.map((amount) => clp(amount)).join(' · ')}</span>
      {analysis.pageTexts.map((page) => (
        <details className="ocr-page" key={page.page}>
          <summary>
            Página {page.page}
            {page.ocr ? ' · OCR' : ''}
          </summary>
          <p>{page.text || 'No se reconoció texto en esta página.'}</p>
        </details>
      ))}
    </div>
  );
}
