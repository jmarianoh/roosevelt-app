import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_PERIOD } from '../config/constants';
import { api, errorMessage } from '../lib/api';
import type { Dashboard, DashboardSummary, Expense } from '../types/api';
import { useToast } from './ToastContext';

const NO_EXPENSES: Expense[] = [];

const EMPTY_SUMMARY: DashboardSummary = {
  income: 0,
  outgoings: 0,
  closingBalance: 0,
  expenseDeclared: 0,
  expenseDetail: 0,
  expenseDifference: 0,
  periodMismatch: false,
  validated: 0,
  approved: 0,
  total: 0,
};

interface DashboardContextValue {
  data: Dashboard | null;
  period: string;
  expenses: Expense[];
  summary: DashboardSummary;
  pending: number;
  refresh: (period?: string) => Promise<void>;
  selectPeriod: (period: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast();
  const [data, setData] = useState<Dashboard | null>(null);
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  const load = useCallback(async (target: string) => {
    const next = await api<Dashboard>(`/dashboard?period=${encodeURIComponent(target)}`);
    setData(next);
    setPeriod(target);
  }, []);

  const selectPeriod = useCallback(
    (target: string) => {
      load(target).catch((error) => notify(errorMessage(error)));
    },
    [load, notify],
  );

  useEffect(() => {
    selectPeriod(DEFAULT_PERIOD);
  }, [selectPeriod]);

  const refresh = useCallback((target: string = period) => load(target), [load, period]);

  const value = useMemo(
    () => ({
      data,
      period,
      expenses: data?.expenses ?? NO_EXPENSES,
      summary: data?.summary ?? EMPTY_SUMMARY,
      pending: data?.pending ?? 0,
      refresh,
      selectPeriod,
    }),
    [data, period, refresh, selectPeriod],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard debe usarse dentro de DashboardProvider');
  return context;
}
