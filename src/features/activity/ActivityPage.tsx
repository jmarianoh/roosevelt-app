import { Download, History } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useAuditLog } from './useAuditLog';

export function ActivityPage() {
  const entries = useAuditLog();

  return (
    <section className="section-card content-card">
      <SectionHeader
        title="Registro de actividad"
        description="Cada validación conserva quién la registró, cuándo y por qué."
      >
        <button className="secondary" onClick={() => (location.href = '/api/backup')}>
          <Download size={15} /> Exportar respaldo
        </button>
      </SectionHeader>
      {entries.length === 0 ? (
        <div className="empty-state">
          <History size={24} />
          <strong>Aún no hay decisiones registradas</strong>
          <span>Las validaciones del equipo aparecerán aquí con fecha y autor.</span>
        </div>
      ) : (
        entries.map((entry) => (
          <div className="audit-row" key={entry.id}>
            <div className="audit-avatar">{entry.user_name?.[0] ?? 'R'}</div>
            <div className="audit-info">
              <strong>
                {entry.user_name ?? 'Sistema'} <span>{entry.action.replaceAll('_', ' ')}</span>
              </strong>
              <span>{entry.detail || `${entry.entity} · #${entry.entity_id}`}</span>
            </div>
            <time>{new Date(entry.created_at + 'Z').toLocaleString('es-CL')}</time>
          </div>
        ))
      )}
    </section>
  );
}
