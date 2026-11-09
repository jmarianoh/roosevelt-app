import { useMemo, useState } from 'react';
import type { Expense } from '../../types/api';

export type ExpenseFilter = 'all' | 'pending' | 'validated';

function matchesFilter(expense: Expense, filter: ExpenseFilter) {
  if (filter === 'pending') return !expense.validated_matches;
  if (filter === 'validated') return Boolean(expense.validated_matches);
  return true;
}

export function useExpenseFilters(expenses: Expense[]) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ExpenseFilter>('all');

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return expenses.filter(
      (expense) =>
        matchesFilter(expense, filter) &&
        `${expense.payee} ${expense.concept} ${expense.folio}`.toLowerCase().includes(needle),
    );
  }, [expenses, filter, query]);

  return { query, setQuery, filter, setFilter, filtered };
}
