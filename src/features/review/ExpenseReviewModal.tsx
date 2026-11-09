import { Check, Paperclip, Sparkles, X } from 'lucide-react';
import { BENEFICIARY_NOTE_PAYEES } from '../../config/constants';
import { useDashboard } from '../../context/DashboardContext';
import { openExpenseSupport } from '../../lib/documents';
import { clp, monthLabel } from '../../lib/format';
import { CandidateList } from './CandidateList';
import { ReviewActions } from './ReviewActions';
import { ReviewChecks } from './ReviewChecks';
import type { ExpenseReviewController } from './useExpenseReview';

export function ExpenseReviewModal({ review }: { review: ExpenseReviewController }) {
  const { data, period } = useDashboard();
  const { isOpen, selected, candidates, chosen, comment, matchTotal, close, setComment, toggleCandidate } =
    review;

  if (!isOpen || !selected) return null;

  const isExactMatch = matchTotal === selected.amount;
  const needsBeneficiaryNote = BENEFICIARY_NOTE_PAYEES.some((name) => selected.payee.includes(name));
  const totalClass = isExactMatch ? 'sum-match' : matchTotal > selected.amount ? 'sum-over' : '';

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div className="review-modal">
        <div className="modal-top">
          <div>
            <span className="eyebrow">REVISIÓN · {monthLabel(period)}</span>
            <h2>{selected.concept}</h2>
            <span>
              {selected.payee} · {selected.folio ? `Folio ${selected.folio}` : 'Sin folio'}
            </span>
          </div>
          <button className="icon-button" onClick={close}>
            <X size={19} />
          </button>
        </div>

        <div className="modal-amount">
          <span>Monto del informe</span>
          <strong>{clp(selected.amount)}</strong>
          <button onClick={() => openExpenseSupport(selected, data?.report)}>
            <Paperclip size={14} /> Revisar respaldo · pág. {selected.source_page}
          </button>
        </div>

        <ReviewChecks review={review.review} />

        <div className="candidate-heading">
          <div>
            <h3>Movimientos candidatos</h3>
            <p>Ordenados por monto y cercanía de fecha. Confirma el proveedor en el respaldo.</p>
          </div>
          <span className="candidate-tag">
            <Sparkles size={13} /> Sugerencias
          </span>
        </div>

        <CandidateList
          expense={selected}
          candidates={candidates}
          chosen={chosen}
          onToggle={toggleCandidate}
        />

        <div className="candidate-total">
          <span>
            Cargos seleccionados <b>{chosen.length}</b>
          </span>
          <strong className={totalClass}>{clp(matchTotal)}</strong>
          {isExactMatch && (
            <span className="equal-pill">
              <Check size={13} /> Coincide
            </span>
          )}
        </div>

        <label className="comment-label">
          Comentario de revisión{' '}
          <span>
            {needsBeneficiaryNote
              ? 'Requerido para dejar constancia del beneficiario o la diferencia.'
              : 'Requerido para registrar la revisión documental.'}
          </span>
          <textarea
            placeholder="Ej.: monto coincide y el RUT del beneficiario corresponde al respaldo…"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>

        <ReviewActions controller={review} isExactMatch={isExactMatch} />
      </div>
    </div>
  );
}
