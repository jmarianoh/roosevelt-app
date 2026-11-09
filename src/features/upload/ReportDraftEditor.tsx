import { Check, Eye, LoaderCircle, Plus, X } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { openDocument } from '../../lib/documents';
import { clp, digitsToNumber } from '../../lib/format';
import type { DraftExpense, ReportDraft } from './types';

interface ReportDraftEditorProps {
  draft: ReportDraft;
  busy: boolean;
  onChange: (draft: ReportDraft) => void;
  onSave: () => void;
}

export function ReportDraftEditor({ draft, busy, onChange, onSave }: ReportDraftEditorProps) {
  const updateDraft = (patch: Partial<ReportDraft>) => onChange({ ...draft, ...patch });

  const updateExpense = (index: number, patch: Partial<DraftExpense>) =>
    updateDraft({
      expenses: draft.expenses.map((expense, i) => (i === index ? { ...expense, ...patch } : expense)),
    });

  const removeExpense = (index: number) =>
    updateDraft({ expenses: draft.expenses.filter((_, i) => i !== index) });

  const addExpense = () =>
    updateDraft({
      expenses: [
        ...draft.expenses,
        { concept: '', payee: '', folio: '', amount: '', date: draft.startDate, sourcePage: 1 },
      ],
    });

  const total = draft.expenses.reduce((sum, expense) => sum + digitsToNumber(expense.amount), 0);

  return (
    <div className="content report-draft-wrap">
      <section className="section-card report-editor">
        <SectionHeader
          title="Revisa las partidas extraídas"
          description="Confirma cada dato contra el PDF antes de registrar el informe."
        >
          <span className="status-pending">Borrador</span>
        </SectionHeader>

        <div className="report-form-grid">
          <label>
            Nombre del informe
            <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} />
          </label>
          <label>
            Período
            <input
              type="month"
              value={draft.period}
              onChange={(e) => updateDraft({ period: e.target.value })}
            />
          </label>
          <label>
            Desde
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) => updateDraft({ startDate: e.target.value })}
            />
          </label>
          <label>
            Hasta
            <input
              type="date"
              value={draft.endDate}
              onChange={(e) => updateDraft({ endDate: e.target.value })}
            />
          </label>
          <label>
            Total declarado
            <input
              inputMode="numeric"
              value={draft.declaredTotal}
              onChange={(e) => updateDraft({ declaredTotal: e.target.value })}
            />
          </label>
        </div>

        {draft.expenses.map((expense, index) => (
          <div className="expense-edit-row" key={index}>
            <input
              placeholder="Concepto"
              value={expense.concept}
              onChange={(e) => updateExpense(index, { concept: e.target.value })}
            />
            <input
              placeholder="Proveedor"
              value={expense.payee}
              onChange={(e) => updateExpense(index, { payee: e.target.value })}
            />
            <input
              placeholder="Folio"
              value={expense.folio}
              onChange={(e) => updateExpense(index, { folio: e.target.value })}
            />
            <input
              inputMode="numeric"
              placeholder="Monto $"
              value={expense.amount}
              onChange={(e) => updateExpense(index, { amount: e.target.value })}
            />
            <input
              type="date"
              aria-label="Fecha del egreso"
              value={expense.date}
              onChange={(e) => updateExpense(index, { date: e.target.value })}
            />
            <input
              type="number"
              min="1"
              placeholder="Pág."
              aria-label="Página de respaldo"
              value={expense.sourcePage}
              onChange={(e) => updateExpense(index, { sourcePage: e.target.value })}
            />
            <button
              className="icon-button"
              aria-label="Quitar partida"
              onClick={() => removeExpense(index)}
            >
              <X size={15} />
            </button>
          </div>
        ))}

        <div className="editor-total">
          <button className="secondary" onClick={addExpense}>
            <Plus size={14} /> Agregar partida
          </button>
          <span>
            Suma de partidas <strong>{clp(total)}</strong>
          </span>
        </div>

        <div className="upload-actions">
          <button
            className="secondary"
            onClick={() => draft.documentId && openDocument(draft.documentId)}
          >
            <Eye size={15} /> Abrir PDF original
          </button>
          <button className="primary" disabled={busy || !draft.expenses.length} onClick={onSave}>
            {busy ? <LoaderCircle className="spin" size={15} /> : <Check size={16} />} Registrar
            informe revisado
          </button>
        </div>
      </section>
    </div>
  );
}
