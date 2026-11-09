import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { TOAST_DURATION_MS } from '../config/constants';

interface ToastContextValue {
  notify: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message]);

  const value = useMemo(() => ({ notify: setMessage }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {message}
          <button onClick={() => setMessage('')}>
            <X size={14} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
}
