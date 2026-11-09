import { Search } from 'lucide-react';
import { clp, dateCL } from '../../lib/format';
import type { Candidate, Expense } from '../../types/api';

const MS_PER_DAY = 86400000;

function daysBetween(firstDate: string, secondDate: string) {
  const first = new Date(`${firstDate}T12:00:00Z`).getTime();
  const second = new Date(`${secondDate}T12:00:00Z`).getTime();
  return Math.abs(first - second) / MS_PER_DAY;
}

interface CandidateListProps {
  expense: Expense;
  candidates: Candidate[];
  chosen: number[];
  onToggle: (id: number, isChecked: boolean) => void;
}

export function CandidateList({ expense, candidates, chosen, onToggle }: CandidateListProps) {
  if (!candidates.length) {
    return (
      <div className="candidate-list">
        <div className="no-candidates">
          <Search size={20} />
          <strong>No hay candidatos por monto</strong>
          <span>
            Este documento requiere revisión manual o una cartola de otro período. No se marca como
            conciliado.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list">
      {candidates.map((tx) => (
        <label className={`candidate-row ${chosen.includes(tx.id) ? 'picked' : ''}`} key={tx.id}>
          <input
            type="checkbox"
            disabled={Boolean(tx.used)}
            checked={chosen.includes(tx.id)}
            onChange={(event) => onToggle(tx.id, event.target.checked)}
          />
          <div className="candidate-main">
            <strong>{tx.description}</strong>
            <span>
              {dateCL(tx.posted_at)} · {tx.period} · {daysBetween(tx.posted_at, expense.date)} días
            </span>
          </div>
          <div className="candidate-right">
            <strong>{clp(tx.debit)}</strong>
            {tx.exact ? (
              <span className="exact-pill">Monto exacto</span>
            ) : (
              <span className="near-pill">Monto cercano</span>
            )}
          </div>
          {Boolean(tx.used) && <span className="used-tag">Ya conciliado</span>}
        </label>
      ))}
    </div>
  );
}
