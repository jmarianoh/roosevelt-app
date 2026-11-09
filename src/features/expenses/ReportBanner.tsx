import { AlertCircle, Eye, FileText } from 'lucide-react';
import { FALLBACK_REPORT_DOCUMENT_ID } from '../../config/constants';
import { useDashboard } from '../../context/DashboardContext';
import { openDocument } from '../../lib/documents';
import { clp, dateCL, monthLabel } from '../../lib/format';

export function ReportBanner() {
  const { data, period, expenses, summary } = useDashboard();
  const report = data?.report;
  const hasManyReports = (data?.reports ?? []).length > 1;
  const validatedShare = expenses.length ? (summary.validated / expenses.length) * 100 : 0;

  return (
    <>
      <div className="report-banner">
        <div className="report-file-icon">
          <FileText size={21} />
        </div>
        <div className="report-info">
          <span className="eyebrow">INFORME DE EGRESOS · {monthLabel(period)}</span>
          <h2>{report?.title ?? 'Informe de egresos'}</h2>
          <span>
            {dateCL(report?.start_date)} al {dateCL(report?.end_date)} · cartola hasta{' '}
            {dateCL(data?.statement?.end_date)}
          </span>
        </div>
        <div className="report-total">
          <span>{hasManyReports ? 'Total de informes del mes' : 'Total informado'}</span>
          <strong>{clp(summary.expenseDeclared)}</strong>
          <button
            className="text-button"
            onClick={() => openDocument(report?.document_id ?? FALLBACK_REPORT_DOCUMENT_ID)}
          >
            <Eye size={14} /> Ver original
          </button>
        </div>
      </div>
      <div className="recon-banner">
        <div>
          <AlertCircle size={17} />
          <span>
            Suma de partidas <b>{clp(summary.expenseDetail)}</b>
          </span>
        </div>
        <div className="recon-divider" />
        <div>
          <span>Diferencia a aclarar</span>
          <strong>{clp(summary.expenseDifference)}</strong>
        </div>
        <div className="recon-right">
          <span>
            {summary.validated} de {expenses.length} partidas validadas
          </span>
          <div className="tiny-track">
            <span style={{ width: `${validatedShare}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
