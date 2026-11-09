import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from '../../context/ToastContext';
import { useBusyAction } from '../../hooks/useBusyAction';
import { api, errorMessage } from '../../lib/api';
import { clp, digitsToNumber } from '../../lib/format';
import type {
  ExpenseConfirmResponse,
  ImportConfirmResponse,
  ImportPreviewFile,
  ImportPreviewResponse,
} from '../../types/api';
import { analyzePdf } from './pdfOcr';
import type { PdfAnalysis, ReportDraft } from './types';

const withoutPdfExtension = (name: string) => name.replace(/\.pdf$/i, '');

function toFormData(files: File[]) {
  const body = new FormData();
  files.forEach((file) => body.append('files', file));
  return body;
}

function completionMessage({ draft, pages, ocrCount }: PdfAnalysis) {
  return draft.expenses.length
    ? `Se detectaron ${draft.expenses.length} partidas y ${ocrCount} página(s) escaneada(s) con OCR · revisa todo el texto y corrige los campos antes de guardar.`
    : `Se revisaron ${pages} páginas; ${ocrCount} mediante OCR local. Agrega las partidas manualmente y confirma cada dato.`;
}

export type MonthlyUploadController = ReturnType<typeof useMonthlyUpload>;

export function useMonthlyUpload({ onReportSaved }: { onReportSaved: () => void }) {
  const { period, refresh } = useDashboard();
  const { notify } = useToast();
  const { busy, run } = useBusyAction();
  const [uploads, setUploads] = useState<File[]>([]);
  const [preview, setPreview] = useState<ImportPreviewFile[]>([]);
  const [ocrProgress, setOcrProgress] = useState('');
  const [analysis, setAnalysis] = useState<PdfAnalysis | null>(null);
  const [reportDraft, setReportDraft] = useState<ReportDraft | null>(null);

  function selectFiles(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list);
    setUploads(files);
    void run(async () => {
      const result = await api<ImportPreviewResponse>('/import/preview', {
        method: 'POST',
        body: toFormData(files),
      });
      setPreview(result.files);
      notify('Previsualización lista. Revisa el estado antes de importar.');
    });
  }

  function importFiles() {
    if (!uploads.length) return;
    void run(async () => {
      const result = await api<ImportConfirmResponse>('/import/confirm', {
        method: 'POST',
        body: toFormData(uploads),
      });
      const pdf = result.files.find((file) => file.ocrOnClient && !file.duplicate);
      if (pdf) {
        const parsed = analysis?.draft;
        setReportDraft({
          documentId: pdf.id,
          title: withoutPdfExtension(pdf.name),
          period,
          startDate: parsed?.startDate ?? `${period}-01`,
          endDate: parsed?.endDate ?? `${period}-28`,
          declaredTotal: parsed?.declaredTotal ?? '',
          expenses: parsed?.expenses ?? [],
        });
      }
      notify(
        `${result.files.length} archivo(s) procesado(s). Las cartolas se importaron; revisa y completa cada PDF antes de registrarlo como informe.`,
      );
      setUploads([]);
      setPreview([]);
      await refresh();
    });
  }

  function runOcr() {
    const pdf = uploads.find((file) => file.type === 'application/pdf');
    if (!pdf) {
      notify('Selecciona un PDF para revisar su texto.');
      return;
    }

    void run(async () => {
      try {
        const result = await analyzePdf(pdf, period, setOcrProgress);
        setAnalysis(result);
        setReportDraft((old) =>
          old
            ? { ...old, ...result.draft }
            : { title: withoutPdfExtension(pdf.name), period, ...result.draft },
        );
        setOcrProgress(completionMessage(result));
      } catch (error) {
        notify(`No se pudo leer el PDF: ${errorMessage(error)}`);
        setOcrProgress('');
      }
    });
  }

  function saveReport() {
    if (!reportDraft?.documentId) {
      notify('Carga primero el PDF original.');
      return;
    }

    void run(async () => {
      const result = await api<ExpenseConfirmResponse>('/import/expense-confirm', {
        method: 'POST',
        body: JSON.stringify({
          ...reportDraft,
          declaredTotal: digitsToNumber(reportDraft.declaredTotal),
          expenses: reportDraft.expenses.map((expense) => ({
            ...expense,
            amount: digitsToNumber(expense.amount),
            sourcePage: Number(expense.sourcePage) || 1,
          })),
        }),
      });
      notify(
        `Informe registrado: ${result.expenseCount} partidas · diferencia aritmética ${clp(result.difference)}.`,
      );
      setReportDraft(null);
      setAnalysis(null);
      setOcrProgress('');
      await refresh(reportDraft.period);
      onReportSaved();
    });
  }

  return {
    uploads,
    preview,
    ocrProgress,
    analysis,
    reportDraft,
    busy,
    selectFiles,
    importFiles,
    runOcr,
    saveReport,
    setReportDraft,
  };
}
