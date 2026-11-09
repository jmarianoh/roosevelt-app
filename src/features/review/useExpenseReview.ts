import { useMemo, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from '../../context/ToastContext';
import { useBusyAction } from '../../hooks/useBusyAction';
import { api } from '../../lib/api';
import type {
  Candidate,
  Expense,
  ReconciliationsResponse,
  SelectedReview,
} from '../../types/api';

export type ExpenseReviewController = ReturnType<typeof useExpenseReview>;

export function useExpenseReview() {
  const { refresh } = useDashboard();
  const { notify } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [review, setReview] = useState<SelectedReview | null>(null);
  const { busy, run } = useBusyAction();

  const matchTotal = useMemo(
    () => chosen.reduce((sum, id) => sum + (candidates.find((tx) => tx.id === id)?.debit ?? 0), 0),
    [chosen, candidates],
  );

  function open(expense: Expense) {
    setSelected(expense);
    setComment('');
    setChosen([]);
    void run(async () => {
      const [found, current] = await Promise.all([
        api<Candidate[]>(`/candidates/${expense.id}`),
        api<ReconciliationsResponse>(`/reconciliations/${expense.id}`),
      ]);
      const linkedIds = current.reconciliations
        .filter((item) => item.review_status === 'validado')
        .map((item) => item.transaction_id);
      setCandidates(found.filter((tx) => tx.inDateWindow && (!tx.used || linkedIds.includes(tx.id))));
      setChosen(linkedIds);
      setReview({ ...current.review, matches: current.reconciliations });
      setIsOpen(true);
    });
  }

  const close = () => setIsOpen(false);

  function toggleCandidate(id: number, isChecked: boolean) {
    setChosen(isChecked ? [...chosen, id] : chosen.filter((item) => item !== id));
  }

  function saveMatch(status: 'validado' | 'observado') {
    if (!selected) return;
    void run(async () => {
      await api('/reconciliations', {
        method: 'POST',
        body: JSON.stringify({ expenseId: selected.id, transactionIds: chosen, status, comment }),
      });
      notify(
        status === 'validado'
          ? 'Conciliación bancaria revisada y guardada.'
          : 'Decisión guardada en el historial.',
      );
      await refresh();
      close();
    });
  }

  function reviewDocuments(status: 'validado' | 'observado') {
    if (!selected) return;
    void run(async () => {
      await api(`/expenses/${selected.id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, comment }),
      });
      setReview((old) => old && { ...old, document_status: status });
      notify(
        status === 'validado'
          ? 'Revisión del respaldo registrada.'
          : 'Observación del respaldo registrada.',
      );
      await refresh();
    });
  }

  function approveExpense() {
    if (!selected) return;
    void run(async () => {
      await api(`/expenses/${selected.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });
      notify('Egreso aprobado. Quedó registrado quién lo aprobó y cuándo.');
      await refresh();
      close();
    });
  }

  function undoMatch() {
    if (!selected) return;
    void run(async () => {
      await api(`/reconciliations/${selected.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ comment }),
      });
      setReview((old) => old && { ...old, approval_status: 'pendiente', matches: [] });
      setCandidates((old) => old.map((tx) => ({ ...tx, used: false })));
      setChosen([]);
      notify('Conciliación deshecha y movimiento liberado.');
      await refresh();
    });
  }

  return {
    isOpen,
    selected,
    candidates,
    chosen,
    comment,
    review,
    busy,
    matchTotal,
    open,
    close,
    setComment,
    toggleCandidate,
    saveMatch,
    reviewDocuments,
    approveExpense,
    undoMatch,
  };
}
