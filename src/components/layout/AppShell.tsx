import { useState } from 'react';
import type { PageId } from '../../config/pages';
import { ActivityPage } from '../../features/activity/ActivityPage';
import { ExpensesPage } from '../../features/expenses/ExpensesPage';
import { ExpenseReviewModal } from '../../features/review/ExpenseReviewModal';
import { useExpenseReview } from '../../features/review/useExpenseReview';
import { ResidentsPage } from '../../features/residents/ResidentsPage';
import { SettingsPage } from '../../features/settings/SettingsPage';
import { StatementsPage } from '../../features/statements/StatementsPage';
import { SummaryPage } from '../../features/summary/SummaryPage';
import { UploadPage } from '../../features/upload/UploadPage';
import { useMonthlyUpload } from '../../features/upload/useMonthlyUpload';
import type { User } from '../../types/api';
import { PageFooter } from './PageFooter';
import { PageHeader } from './PageHeader';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ user }: { user: User }) {
  const [page, setPage] = useState<PageId>('Resumen');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const review = useExpenseReview();
  const upload = useMonthlyUpload({ onReportSaved: () => setPage('Egresos') });

  const selectPage = (target: PageId) => {
    setPage(target);
    setIsMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        page={page}
        isMobileOpen={isMobileOpen}
        onNavigate={setPage}
        onSelectPage={selectPage}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <main className="main-area">
        <Topbar user={user} page={page} onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />
        <div className="content">
          <PageHeader page={page} onNavigate={setPage} />
          {page === 'Resumen' && <SummaryPage onNavigate={setPage} onReview={review.open} />}
          {page === 'Cartolas' && <StatementsPage />}
          {page === 'Egresos' && <ExpensesPage onReview={review.open} />}
          {page === 'Carga mensual' && <UploadPage upload={upload} />}
          {page === 'Actividad' && <ActivityPage />}
          {page === 'Copropietarios y Residentes' && <ResidentsPage />}
          {page === 'Ajustes' && <SettingsPage />}
        </div>
        <PageFooter />
      </main>
      {isMobileOpen && (
        <button className="mobile-scrim" onClick={() => setIsMobileOpen(false)} />
      )}
      <ExpenseReviewModal review={review} />
    </div>
  );
}
