import type { ChangeEvent } from 'react';
import { Download, ShieldCheck, Upload } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useSession } from '../../context/SessionContext';
import { useToast } from '../../context/ToastContext';
import { api, errorMessage } from '../../lib/api';

export function BackupSection() {
  const { clearSession } = useSession();
  const { notify } = useToast();

  async function restoreBackup(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!window.confirm('La restauración reemplazará todos los datos locales actuales. ¿Quieres continuar?')) {
      input.value = '';
      return;
    }

    try {
      const body = new FormData();
      body.append('file', file);
      await api('/backup/restore', { method: 'POST', body });
      notify('Respaldo restaurado. Inicia sesión de nuevo con las credenciales del respaldo.');
      clearSession();
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      input.value = '';
    }
  }

  return (
    <section className="section-card content-card backup-section">
      <SectionHeader
        title="Respaldar y restaurar"
        description="Descarga todos los documentos, datos y el historial de validaciones."
      >
        <button className="primary" onClick={() => (location.href = '/api/backup')}>
          <Download size={16} /> Descargar respaldo
        </button>
      </SectionHeader>
      <div className="notice notice-blue">
        <ShieldCheck size={18} />
        <span>
          El respaldo incluye información financiera y credenciales hasheadas. Guárdalo en una
          ubicación privada.
        </span>
      </div>
      <label className="restore-button">
        <Upload size={15} /> Restaurar respaldo
        <input type="file" accept=".zip" onChange={restoreBackup} />
      </label>
    </section>
  );
}
