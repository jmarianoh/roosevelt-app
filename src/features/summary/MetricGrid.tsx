import { ArrowDownLeft, ArrowRight, ArrowUpRight, Clock3, FileCheck2, Landmark } from 'lucide-react';
import type { Navigate } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import { clp, monthLabel } from '../../lib/format';
import { MetricCard } from './MetricCard';

export function MetricGrid({ onNavigate }: { onNavigate: Navigate }) {
  const { data, period, summary, pending } = useDashboard();
  const statement = data?.statement;

  return (
    <div className="metric-grid">
      <MetricCard
        label="Saldo disponible"
        iconColor="green"
        icon={<Landmark size={17} />}
        value={clp(statement?.closing_balance)}
      >
        <span className="trend flat">
          <ArrowRight size={13} />
        </span>
        Al cierre de {monthLabel(period)}
      </MetricCard>
      <MetricCard
        label="Ingresos del período"
        iconColor="blue"
        icon={<ArrowDownLeft size={18} />}
        value={clp(statement?.total_credits)}
      >
        Depósitos y abonos bancarios
      </MetricCard>
      <MetricCard
        label="Cargos bancarios"
        iconColor="violet"
        icon={<ArrowUpRight size={17} />}
        value={clp(statement?.total_debits)}
      >
        Giros y pagos registrados
      </MetricCard>
      <MetricCard
        label="Egresos por revisar"
        iconColor="amber"
        icon={<FileCheck2 size={17} />}
        value={clp(summary.expenseDeclared)}
        onClick={() => onNavigate('Egresos')}
      >
        <span className="review-pill">
          <Clock3 size={12} />
          {pending} pendientes
        </span>
        <ArrowRight size={14} className="metric-arrow" />
      </MetricCard>
    </div>
  );
}
