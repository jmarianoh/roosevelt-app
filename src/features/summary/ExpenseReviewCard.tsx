import { ArrowRight, FileText } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { Navigate } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import { clp } from '../../lib/format';
import type { Expense } from '../../types/api';

const MAX_PENDING_ROWS = 4;

interface ExpenseReviewCardProps {
  onNavigate: Navigate;
  onReview: (expense: Expense) => void;
}

export function ExpenseReviewCard({ onNavigate, onReview }: ExpenseReviewCardProps) {
  const { expenses, summary } = useDashboard();
  const progress = summary.total ? (summary.validated / summary.total) * 100 : 0;
  const pendingRows = expenses.filter((expense) => !expense.validated_matches).slice(0, MAX_PENDING_ROWS);

  return (
    <section className="section-card">
      <SectionHeader
        title="Revisión de egresos"
        description="Seguimiento del informe entregado para este período."
      >
        <button className="text-button" onClick={() => onNavigate('Egresos')}>
          Ver todos <ArrowRight size={15} />
        </button>
      </SectionHeader>

      <div className="review-summary">
        <div className="progress-copy">
          <div className="progress-number">
            {summary.validated}
            <span>/{summary.total}</span>
          </div>
          <strong>partidas conciliadas</strong>
          <span>Solo cuentan como revisados los cargos confirmados manualmente.</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <div className="progress-percent">{Math.round(progress)}%</div>
      </div>

      {summary.expenseDifference !== 0 && (
        <div className="discrepancy">
          <div className="discrepancy-mark">≠</div>
          <div>
            <strong>El total del informe no coincide con la suma de sus partidas</strong>
            <span>
              Declarado {clp(summary.expenseDeclared)} <i /> Calculado {clp(summary.expenseDetail)}{' '}
              <i /> Diferencia <b>{clp(summary.expenseDifference)}</b>
            </span>
          </div>
          <button className="text-button" onClick={() => onNavigate('Egresos')}>
            Ver detalle <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="mini-table-head">
        <span>Partida pendiente</span>
        <span>Beneficiario</span>
        <span>Monto</span>
        <span>Estado</span>
        <span />
      </div>
      {pendingRows.map((expense) => (
        <div className="mini-row" key={expense.id}>
          <div className="mini-title">
            <div className="expense-file">
              <FileText size={16} />
            </div>
            <div>
              <strong>{expense.concept}</strong>
              <span>{expense.folio ? `Folio ${expense.folio}` : 'Sin folio'}</span>
            </div>
          </div>
          <span className="row-payee">{expense.payee}</span>
          <strong className="amount">{clp(expense.amount)}</strong>
          <span className="status-pending">
            <span />
            Pendiente
          </span>
          <button className="row-open" aria-label="Revisar partida" onClick={() => onReview(expense)}>
            <ArrowRight size={17} />
          </button>
        </div>
      ))}
      <div className="table-bottom">
        <span>Se muestran partidas aún sin validar</span>
        <button className="text-button" onClick={() => onNavigate('Egresos')}>
          Abrir informe completo
        </button>
      </div>
    </section>
  );
}
