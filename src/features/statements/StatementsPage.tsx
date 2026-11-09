import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { SearchBox } from '../../components/ui/SearchBox';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from '../../context/ToastContext';
import { openDocument } from '../../lib/documents';
import { clp, dateCL, monthLabel } from '../../lib/format';
import { useStatements } from './useStatements';

export function StatementsPage() {
  const { data, period } = useDashboard();
  const { notify } = useToast();
  const [query, setQuery] = useState('');
  const transactions = useStatements(period, query);
  const statement = data?.statement;

  return (
    <section className="section-card content-card">
      <SectionHeader
        title="Movimientos de la cartola"
        description={`${monthLabel(period)} · ${transactions.length} movimientos`}
      >
        <button
          className="secondary"
          onClick={() => statement && openDocument(statement.document_id)}
        >
          <Download size={15} /> Descargar cartola
        </button>
      </SectionHeader>
      <div className="filterbar">
        <SearchBox
          placeholder="Buscar descripción o fecha..."
          value={query}
          onChange={setQuery}
          shortcut="⌘ K"
        />
        <button
          className="secondary"
          onClick={() => notify('La cartola original conserva los valores bancarios importados.')}
        >
          <Filter size={15} /> Filtros
        </button>
        <span className="rows-count">
          Saldo final <b>{clp(statement?.closing_balance)}</b>
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>FECHA</th>
              <th>DESCRIPCIÓN</th>
              <th>DOCUMENTO</th>
              <th className="align-r">CARGO</th>
              <th className="align-r">ABONO</th>
              <th className="align-r">SALDO</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="date-cell">{dateCL(tx.posted_at)}</td>
                <td className="desc-cell">
                  <strong>{tx.description}</strong>
                </td>
                <td className="ref-cell">{tx.source_row ? `Fila ${tx.source_row}` : '—'}</td>
                <td className="align-r money-out">{tx.debit ? `− ${clp(tx.debit)}` : '—'}</td>
                <td className="align-r money-in">{tx.credit ? `+ ${clp(tx.credit)}` : '—'}</td>
                <td className="align-r balance-cell">{clp(tx.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-bottom">
        <span>
          Datos extraídos de{' '}
          {statement && `${dateCL(statement.start_date)} – ${dateCL(statement.end_date)}`}
        </span>
        <span className="rows-count">
          {clp(statement?.total_debits)} cargos · {clp(statement?.total_credits)} abonos
        </span>
      </div>
    </section>
  );
}
