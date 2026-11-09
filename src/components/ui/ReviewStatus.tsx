import { BadgeCheck, CheckCircle2 } from 'lucide-react';
import type { Expense } from '../../types/api';

export function ReviewStatus({ expense }: { expense: Expense }) {
  if (expense.approval_status === 'aprobado') {
    return (
      <span className="status-ok">
        <BadgeCheck size={14} /> Aprobado
      </span>
    );
  }

  if (expense.validated_matches) {
    return (
      <span className="status-ok">
        <CheckCircle2 size={14} /> Conciliado
      </span>
    );
  }

  return (
    <span className="status-pending">
      <span />
      Por revisar
    </span>
  );
}
