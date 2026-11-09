import type { Expense, ExpenseReport } from '../types/api';

export function openDocument(documentId: number, page?: number) {
  const anchor = page ? `#page=${page}` : '';
  window.open(`/api/documents/${documentId}${anchor}`, '_blank', 'noopener');
}

export function openExpenseSupport(expense: Expense, report: ExpenseReport | null | undefined) {
  const documentId = expense.document_id ?? report?.document_id;
  if (documentId) openDocument(documentId, expense.source_page);
}
