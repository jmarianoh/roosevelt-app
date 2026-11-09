import { ArrowRight } from 'lucide-react';
import { Notice } from '../../components/ui/Notice';
import type { Navigate } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import type { Expense } from '../../types/api';
import { useStatements } from '../statements/useStatements';
import { CashflowChart } from './CashflowChart';
import { ExpenseReviewCard } from './ExpenseReviewCard';
import { MetricGrid } from './MetricGrid';
import { MonthDocuments } from './MonthDocuments';
import { RecentTransactions } from './RecentTransactions';

interface SummaryPageProps {
  onNavigate: Navigate;
  onReview: (expense: Expense) => void;
}

export function SummaryPage({ onNavigate, onReview }: SummaryPageProps) {
  const { data, period, summary } = useDashboard();
  const transactions = useStatements(period);

  return (
    <>
      {summary.periodMismatch && (
        <Notice
          title="El período no coincide completamente"
          action={
            <button onClick={() => onNavigate('Egresos')}>
              Revisar <ArrowRight size={15} />
            </button>
          }
        >
          El informe termina el 31 de octubre; la cartola disponible llega hasta el 30. La diferencia
          de fecha queda pendiente de revisión.
        </Notice>
      )}
      <MetricGrid onNavigate={onNavigate} />
      <CashflowChart periods={data?.periods ?? []} />
      <ExpenseReviewCard onNavigate={onNavigate} onReview={onReview} />
      <div className="lower-grid">
        <RecentTransactions transactions={transactions} onNavigate={onNavigate} />
        <MonthDocuments onNavigate={onNavigate} />
      </div>
    </>
  );
}
