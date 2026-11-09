import { BadgeCheck, FileCheck2, Landmark } from 'lucide-react';
import type { SelectedReview } from '../../types/api';

export function ReviewChecks({ review }: { review: SelectedReview | null }) {
  const isDocumentValid = review?.document_status === 'validado';
  const isReconciled = review?.matches.some((match) => match.review_status === 'validado');
  const isApproved = review?.approval_status === 'aprobado';
  const stateClass = (isDone: boolean | undefined) => (isDone ? 'check-done' : 'check-open');

  return (
    <div className="review-checks">
      <span className={stateClass(isDocumentValid)}>
        <FileCheck2 size={14} /> Respaldo · {isDocumentValid ? 'Validado' : 'Pendiente'}
      </span>
      <span className={stateClass(isReconciled)}>
        <Landmark size={14} /> Banco · {isReconciled ? 'Conciliado' : 'Pendiente'}
      </span>
      <span className={stateClass(isApproved)}>
        <BadgeCheck size={14} /> Aprobación · {isApproved ? 'Aprobado' : 'Pendiente'}
      </span>
    </div>
  );
}
