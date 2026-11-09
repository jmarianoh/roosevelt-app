import { ArrowRight, Eye, FileText } from 'lucide-react';
import { Notice } from '../../components/ui/Notice';
import { SearchBox } from '../../components/ui/SearchBox';
import { FALLBACK_REPORT_DOCUMENT_ID } from '../../config/constants';
import { useDashboard } from '../../context/DashboardContext';
import { openDocument } from '../../lib/documents';
import { clp } from '../../lib/format';
import type { Expense } from '../../types/api';
import { ExpensesTable } from './ExpensesTable';
import { ReportBanner } from './ReportBanner';
import { useExpenseFilters, type ExpenseFilter } from './useExpenseFilters';

export function ExpensesPage({ onReview }: { onReview: (expense: Expense) => void }) {
  const { data, expenses, summary } = useDashboard();
  const { query, setQuery, filter, setFilter, filtered } = useExpenseFilters(expenses);
  const reports = data?.reports ?? [];

  return (
    <>
      <Notice title="Las propuestas requieren revisión humana">
        Los montos y fechas cercanas son sugerencias para revisar junto con el respaldo. No se
        aprueban ni concilian automáticamente.
      </Notice>

      {reports.length > 1 && (
        <div className="report-list">
          {reports.map((report) => (
            <div className="report-chip" key={report.id}>
              <FileText size={15} />
              <strong>{report.title}</strong>
              <span>{clp(report.declared_total)}</span>
              <button className="text-button" onClick={() => openDocument(report.document_id)}>
                <Eye size={13} /> PDF
              </button>
            </div>
          ))}
        </div>
      )}

      <section className="section-card content-card">
        <ReportBanner />
        <div className="filterbar">
          <SearchBox
            placeholder="Buscar proveedor, concepto o folio..."
            value={query}
            onChange={setQuery}
          />
          <select
            className="filter-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value as ExpenseFilter)}
          >
            <option value="all">Todas las partidas</option>
            <option value="pending">Pendientes</option>
            <option value="validated">Validadas</option>
          </select>
          <span className="rows-count">{filtered.length} partidas</span>
        </div>
        <ExpensesTable expenses={filtered} onReview={onReview} />
        <div className="table-bottom">
          <span>{summary.total} partidas · los respaldos agrupados no duplican montos</span>
          <button
            className="text-button"
            onClick={() => openDocument(data?.report?.document_id ?? FALLBACK_REPORT_DOCUMENT_ID)}
          >
            Abrir informe original <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </>
  );
}
