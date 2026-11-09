import { useCallback, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../lib/api';

/** Ejecuta acciones asíncronas exponiendo `busy` y mostrando sus errores como toast. */
export function useBusyAction() {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (action: () => Promise<void>) => {
      setBusy(true);
      try {
        await action();
      } catch (error) {
        notify(errorMessage(error));
      } finally {
        setBusy(false);
      }
    },
    [notify],
  );

  return { busy, run };
}
