import { CalendarDays, ChevronDown, Plus } from 'lucide-react';
import { PAGES, type Navigate, type PageId } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import { monthLabel } from '../../lib/format';

interface PageHeaderProps {
  page: PageId;
  onNavigate: Navigate;
}

export function PageHeader({ page, onNavigate }: PageHeaderProps) {
  const { data, period, selectPeriod } = useDashboard();
  const config = PAGES.find((item) => item.id === page);

  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">FINANZAS · EDIFICIO ROOSEVELT</div>
        <h1>{config?.title}</h1>
        <p>{config?.subtitle}</p>
      </div>
      <div className="head-actions">
        <label className="period-select">
          <CalendarDays size={16} />
          <select value={period} onChange={(event) => selectPeriod(event.target.value)}>
            {(data?.periods ?? []).map((item) => (
              <option key={item.period} value={item.period}>
                {monthLabel(item.period)}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </label>
        <button className="primary" onClick={() => onNavigate('Carga mensual')}>
          <Plus size={17} /> Nuevo registro
        </button>
      </div>
    </div>
  );
}
