import { CheckCircle2, FileSpreadsheet, FileText } from 'lucide-react';
import type { ImportPreviewFile } from '../../types/api';

interface UploadFileListProps {
  files: File[];
  preview: ImportPreviewFile[];
}

export function UploadFileList({ files, preview }: UploadFileListProps) {
  return (
    <div className="upload-file-list">
      {files.map((file) => {
        const isPdf = file.name.toLowerCase().endsWith('.pdf');
        const isDuplicate = preview.find((item) => item.name === file.name)?.duplicate;

        return (
          <div className="upload-file-row" key={file.name}>
            <div className={`document-icon ${isPdf ? 'report-color' : 'statement-color'}`}>
              {isPdf ? <FileText size={17} /> : <FileSpreadsheet size={17} />}
            </div>
            <div className="document-info">
              <strong>{file.name}</strong>
              <span>
                {(file.size / 1024).toFixed(0)} KB ·{' '}
                {isPdf ? 'PDF · requiere OCR/revisión' : 'Cartola Excel'}
              </span>
            </div>
            {isDuplicate ? (
              <span className="status-pending">Ya existe</span>
            ) : (
              <span className="status-ok">
                <CheckCircle2 size={14} /> Listo
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
