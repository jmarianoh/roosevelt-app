import { Eye, FileSpreadsheet, FileText, MoreHorizontal, Plus } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { Navigate } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import { openDocument } from '../../lib/documents';
import { clp, dateCL, monthLabel } from '../../lib/format';

export function MonthDocuments({ onNavigate }: { onNavigate: Navigate }) {
  const { data, period, expenses } = useDashboard();
  const statement = data?.statement;
  const report = data?.report;

  return (
    <section className="section-card compact-card">
      <SectionHeader title="Documentos del mes" description="Cartola e informe de egresos">
        <button className="icon-button" onClick={() => onNavigate('Carga mensual')}>
          <MoreHorizontal size={18} />
        </button>
      </SectionHeader>
      <div className="document-list">
        <div className="document-row">
          <div className="document-icon statement-color">
            <FileSpreadsheet size={18} />
          </div>
          <div className="document-info">
            <strong>Cartola · {monthLabel(period)}</strong>
            <span>Saldo de cierre {clp(statement?.closing_balance)}</span>
          </div>
          <button
            className="doc-open"
            onClick={() => statement && openDocument(statement.document_id)}
          >
            <Eye size={15} />
          </button>
        </div>
        {report && (
          <div className="document-row">
            <div className="document-icon report-color">
              <FileText size={18} />
            </div>
            <div className="document-info">
              <strong>{report.title}</strong>
              <span>
                {expenses.length} partidas · {dateCL(report.start_date)} – {dateCL(report.end_date)}
              </span>
            </div>
            <button className="doc-open" onClick={() => onNavigate('Egresos')}>
              <Eye size={15} />
            </button>
          </div>
        )}
        <button className="upload-inline" onClick={() => onNavigate('Carga mensual')}>
          <Plus size={15} /> Agregar documento
        </button>
      </div>
    </section>
  );
}
