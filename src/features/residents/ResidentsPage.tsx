import { useEffect, useState } from 'react';
import { Building2, Home, KeyRound, HelpCircle } from 'lucide-react';
import { SearchBox } from '../../components/ui/SearchBox';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useToast } from '../../context/ToastContext';
import { api, errorMessage } from '../../lib/api';
import type { ResidentsResponse } from '../../types/api';
import { MetricCard } from '../summary/MetricCard';

export function ResidentsPage() {
  const { notify } = useToast();
  const [data, setData] = useState<ResidentsResponse>();
  const [query, setQuery] = useState('');

  useEffect(() => {
    api<ResidentsResponse>('/residents').then(setData).catch((e) => notify(errorMessage(e)));
  }, [notify]);

  const s = data?.summary;
  const q = query.trim().toLowerCase();
  const rows = (data?.rows ?? []).filter((r) => !q || `${r.unit} ${r.name} ${r.role}`.toLowerCase().includes(q));
  const pct = (n = 0) => (s?.total ? `${Math.round((n / s.total) * 100)}% del total` : '');

  return (
    <>
      <div className="metric-grid">
        <MetricCard label="Departamentos" iconColor="blue" icon={<Building2 size={17} />} value={String(s?.total ?? '—')}>
          Cada unidad se cuenta una sola vez
        </MetricCard>
        <MetricCard label="Residentes" iconColor="green" icon={<Home size={17} />} value={String(s?.residentes ?? '—')}>
          Propietario vive en la unidad · {pct(s?.residentes)}
        </MetricCard>
        <MetricCard label="Arrendados" iconColor="violet" icon={<KeyRound size={17} />} value={String(s?.arrendadas ?? '—')}>
          Con arrendatario registrado · {pct(s?.arrendadas)}
        </MetricCard>
        <MetricCard label="Sin confirmar" iconColor="amber" icon={<HelpCircle size={17} />} value={String(s?.sinConfirmar ?? '—')}>
          Propietario no reside y sin arrendatario · {pct(s?.sinConfirmar)}
        </MetricCard>
      </div>
      <section className="section-card content-card">
        <SectionHeader title="Padrón" description={`${rows.length} personas`} />
        <div className="filterbar">
          <SearchBox placeholder="Buscar depto, nombre o rol..." value={query} onChange={setQuery} shortcut="⌘ K" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>DEPTO.</th>
                <th>NOMBRE</th>
                <th>ROL</th>
                <th>RESIDE</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.unit}</td>
                  <td className="desc-cell"><strong>{r.name}</strong></td>
                  <td>{r.role}</td>
                  <td>{r.resides ? 'Sí' : 'No'}</td>
                  <td>{r.email || '—'}</td>
                  <td>{r.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
