import { ArrowLeft, BadgeCheck, Check, FileCheck2, LoaderCircle } from 'lucide-react';
import type { ExpenseReviewController } from './useExpenseReview';

interface ReviewActionsProps {
  controller: ExpenseReviewController;
  isExactMatch: boolean;
}

export function ReviewActions({ controller, isExactMatch }: ReviewActionsProps) {
  const { review, chosen, comment, busy, close, reviewDocuments, undoMatch, saveMatch, approveExpense } =
    controller;
  const isBlocked = busy || !comment.trim();
  const isReconciled = review?.matches.some((match) => match.review_status === 'validado');
  const isApproved = review?.approval_status === 'aprobado';
  const canApprove = review?.document_status === 'validado' && !isApproved;

  return (
    <div className="modal-actions">
      <button className="secondary" onClick={close}>
        Cancelar
      </button>
      <button className="secondary" disabled={isBlocked} onClick={() => reviewDocuments('observado')}>
        Observar respaldo
      </button>
      {isReconciled && (
        <button className="secondary" disabled={isBlocked} onClick={undoMatch}>
          <ArrowLeft size={14} /> Deshacer conciliación
        </button>
      )}
      <button className="secondary" disabled={isBlocked} onClick={() => reviewDocuments('validado')}>
        <FileCheck2 size={14} /> Validar respaldo
      </button>
      <button
        className="secondary"
        disabled={isBlocked || !chosen.length}
        onClick={() => saveMatch('observado')}
      >
        Observar conciliación
      </button>
      <button
        className="primary"
        disabled={isBlocked || !chosen.length || !isExactMatch}
        onClick={() => saveMatch('validado')}
      >
        {busy ? <LoaderCircle className="spin" size={15} /> : <Check size={16} />} Confirmar conciliación
      </button>
      {canApprove && (
        <button className="primary" disabled={isBlocked || !isExactMatch} onClick={approveExpense}>
          <BadgeCheck size={15} /> Aprobar egreso
        </button>
      )}
      {isApproved && (
        <span className="status-ok">
          <BadgeCheck size={15} /> Egreso aprobado
        </span>
      )}
    </div>
  );
}
