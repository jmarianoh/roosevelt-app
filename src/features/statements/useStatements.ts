import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api, errorMessage } from '../../lib/api';
import type { Tx } from '../../types/api';

export function useStatements(period: string, query = '') {
  const { notify } = useToast();
  const [transactions, setTransactions] = useState<Tx[]>([]);

  useEffect(() => {
    let active = true;
    const params = `period=${encodeURIComponent(period)}&q=${encodeURIComponent(query)}`;
    api<Tx[]>(`/statements?${params}`)
      .then((result) => {
        if (active) setTransactions(result);
      })
      .catch((error) => {
        if (active) notify(errorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [period, query, notify]);

  return transactions;
}
