import { ArrowDownLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { Navigate } from '../../config/pages';
import { clp, dateCL } from '../../lib/format';
import type { Tx } from '../../types/api';

const MAX_RECENT_ROWS = 5;

interface RecentTransactionsProps {
  transactions: Tx[];
  onNavigate: Navigate;
}

export function RecentTransactions({ transactions, onNavigate }: RecentTransactionsProps) {
  return (
    <section className="section-card compact-card">
      <SectionHeader title="Últimos movimientos" description="Actividad de la cartola bancaria">
        <button className="text-button" onClick={() => onNavigate('Cartolas')}>
          Ver cartola <ArrowRight size={14} />
        </button>
      </SectionHeader>
      <div className="recent-list">
        {transactions.slice(0, MAX_RECENT_ROWS).map((tx) => (
          <div className="recent-row" key={tx.id}>
            <div className={`recent-icon ${tx.debit ? 'debit-icon' : 'credit-icon'}`}>
              {tx.debit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            </div>
            <div className="recent-desc">
              <strong>{tx.description}</strong>
              <span>{dateCL(tx.posted_at)}</span>
            </div>
            <span className={`recent-amount ${tx.debit ? 'negative' : ''}`}>
              {tx.debit ? '-' : '+'}
              {clp(tx.debit || tx.credit)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
