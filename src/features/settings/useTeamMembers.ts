import { useEffect, useState } from 'react';
import type { Credentials } from '../../context/SessionContext';
import { useToast } from '../../context/ToastContext';
import { api, errorMessage } from '../../lib/api';
import type { TeamMember } from '../../types/api';

export function useTeamMembers() {
  const { notify } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api<TeamMember[]>('/users')
      .then((result) => {
        if (active) setMembers(result);
      })
      .catch((error) => notify(errorMessage(error)));
    return () => {
      active = false;
    };
  }, [notify]);

  /** Devuelve `true` si la invitación se creó, para que el formulario pueda limpiarse. */
  async function addMember(credentials: Credentials) {
    setBusy(true);
    try {
      await api('/users', { method: 'POST', body: JSON.stringify(credentials) });
      notify('Invitación local creada. Comparte esas credenciales directamente con el comité.');
      setMembers(await api<TeamMember[]>('/users'));
      return true;
    } catch (error) {
      notify(errorMessage(error));
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { members, busy, addMember };
}
