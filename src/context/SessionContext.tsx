import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import type { AuthResponse, SessionResponse, User } from '../types/api';
import { useToast } from './ToastContext';

export interface Credentials {
  name: string;
  email: string;
  password: string;
}

interface SessionContextValue {
  user: User | null;
  needsSetup: boolean;
  loading: boolean;
  authenticate: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<SessionResponse>('/session')
      .then((session) => {
        if (!session.userCount) setNeedsSetup(true);
        else if (session.user) setUser(session.user);
      })
      .catch(() => notify('No se pudo conectar con el servidor local.'))
      .finally(() => setLoading(false));
  }, [notify]);

  const authenticate = useCallback(
    async (credentials: Credentials) => {
      const result = await api<AuthResponse>(needsSetup ? '/bootstrap' : '/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setUser(result.user);
      setNeedsSetup(false);
    },
    [needsSetup],
  );

  const logout = useCallback(async () => {
    await api('/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setNeedsSetup(false);
  }, []);

  const value = useMemo(
    () => ({ user, needsSetup, loading, authenticate, logout, clearSession }),
    [user, needsSetup, loading, authenticate, logout, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession debe usarse dentro de SessionProvider');
  return context;
}
