import { LoaderCircle } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { DashboardProvider } from './context/DashboardContext';
import { useSession } from './context/SessionContext';
import { AuthScreen } from './features/auth/AuthScreen';

export function App() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" />
        <span>Cargando espacio seguro…</span>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <DashboardProvider>
      <AppShell user={user} />
    </DashboardProvider>
  );
}
