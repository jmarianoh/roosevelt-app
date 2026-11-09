import { ArrowRight, Paperclip } from 'lucide-react';
import { ReviewStatus } from '../../components/ui/ReviewStatus';
import { useDashboard } from '../../context/DashboardContext';
import { openExpenseSupport } from '../../lib/documents';
import { clp, dateCL } from '../../lib/format';
import type { Expense } from '../../types/api';

interface ExpensesTableProps {
  expenses: Expense[];
  onReview: (expense: Expense) => void;
}

export function ExpensesTable({ expenses, onReview }: ExpensesTableProps) {
  const { data } = useDashboard();

  return (
    <div className="table-wrap">
      <table className="expenses-table">
        <thead>
          <tr>
            <th>PARTIDA</th>
            <th>PROVEEDOR</th>
            <th>FECHA</th>
            <th>RESPALDO</th>
            <th className="align-r">MONTO</th>
            <th>REVISIÓN</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="expense-table-title">
                  <strong>{expense.concept}</strong>
                  <span>
                    {expense.folio ? `Folio ${expense.folio}` : 'Sin folio'} · pág. {expense.source_page}
                  </span>
                </div>
              </td>
              <td>{expense.payee}</td>
              <td className="date-cell">{dateCL(expense.date)}</td>
              <td>
                <button
                  className="paperclip-link"
                  onClick={() => openExpenseSupport(expense, data?.report)}
                >
                  <Paperclip size={14} />
                  {expense.attachment_count ?? 1} doc.
                </button>
              </td>
              <td className="align-r amount">{clp(expense.amount)}</td>
              <td>
                <ReviewStatus expense={expense} />
              </td>
              <td>
                <button className="row-open" onClick={() => onReview(expense)} aria-label="Abrir revisión">
                  <ArrowRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
