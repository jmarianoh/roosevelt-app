import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api, errorMessage } from '../../lib/api';
import type { AuditEntry } from '../../types/api';

export function useAuditLog() {
  const { notify } = useToast();
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let active = true;
    api<AuditEntry[]>('/audit')
      .then((result) => {
        if (active) setEntries(result);
      })
      .catch((error) => notify(errorMessage(error)));
    return () => {
      active = false;
    };
  }, [notify]);

  return entries;
}
