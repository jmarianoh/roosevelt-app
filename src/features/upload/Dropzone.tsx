import { Upload } from 'lucide-react';

export function Dropzone({ onSelect }: { onSelect: (files: FileList | null) => void }) {
  return (
    <label className="dropzone">
      <input
        type="file"
        accept=".xls,.xlsx,.pdf"
        multiple
        onChange={(event) => onSelect(event.target.files)}
      />
      <div className="drop-icon">
        <Upload size={22} />
      </div>
      <strong>
        Arrastra tus archivos aquí o <span>explora en tu equipo</span>
      </strong>
      <p>Cartolas .XLS o .XLSX y documentos .PDF · hasta 25 MB cada uno</p>
      <small>Los archivos se leen en tu navegador y se guardan en este equipo.</small>
    </label>
  );
}
