import { Activity, Check, LoaderCircle, Sparkles } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Dropzone } from './Dropzone';
import { OcrReview } from './OcrReview';
import { ReportDraftEditor } from './ReportDraftEditor';
import { UploadFileList } from './UploadFileList';
import { UploadGuide } from './UploadGuide';
import type { MonthlyUploadController } from './useMonthlyUpload';

export function UploadPage({ upload }: { upload: MonthlyUploadController }) {
  const { uploads, preview, ocrProgress, analysis, reportDraft, busy } = upload;

  return (
    <>
      <div className="upload-layout">
        <section className="section-card content-card">
          <SectionHeader
            title="Agregar documentos"
            description="Selecciona cartolas Excel y respaldos en PDF del mismo período."
          />
          <Dropzone onSelect={upload.selectFiles} />
          {uploads.length > 0 && (
            <>
              <div className="upload-preview-title">
                <strong>Revisión previa</strong>
                <span>{uploads.length} archivo(s) seleccionados</span>
              </div>
              <UploadFileList files={uploads} preview={preview} />
              <div className="upload-actions">
                <button className="secondary" disabled={busy} onClick={upload.runOcr}>
                  <Sparkles size={15} /> Analizar PDF con OCR
                </button>
                <button
                  className="primary"
                  disabled={busy || !preview.length}
                  onClick={upload.importFiles}
                >
                  {busy ? <LoaderCircle className="spin" size={15} /> : <Check size={16} />} Confirmar
                  carga
                </button>
              </div>
              {ocrProgress && (
                <div className="ocr-progress">
                  <Activity size={15} />
                  <span>{ocrProgress}</span>
                </div>
              )}
              {analysis && <OcrReview analysis={analysis} />}
            </>
          )}
        </section>
        <UploadGuide />
      </div>
      {reportDraft && (
        <ReportDraftEditor
          draft={reportDraft}
          busy={busy}
          onChange={upload.setReportDraft}
          onSave={upload.saveReport}
        />
      )}
    </>
  );
}
