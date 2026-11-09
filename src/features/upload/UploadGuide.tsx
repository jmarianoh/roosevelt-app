import { BookOpenCheck, LockKeyhole } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { monthLabel } from '../../lib/format';

const MAX_PERIOD_CHIPS = 8;

const STEPS = [
  {
    number: '01',
    title: 'Selecciona tus documentos',
    detail: 'Incluye la cartola mensual y sus respaldos.',
  },
  {
    number: '02',
    title: 'Revisa el período y los totales',
    detail: 'Los datos importados siguen pendientes hasta validarlos.',
  },
  {
    number: '03',
    title: 'Relaciona los cargos',
    detail: 'La web propone coincidencias para tu revisión.',
  },
];

export function UploadGuide() {
  const { data, period, selectPeriod } = useDashboard();

  return (
    <aside className="section-card upload-aside">
      <div className="guide-icon">
        <BookOpenCheck size={20} />
      </div>
      <h3>Antes de cargar</h3>
      {STEPS.map((step) => (
        <div className="guide-step" key={step.number}>
          <b>{step.number}</b>
          <div>
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
          </div>
        </div>
      ))}
      <div className="privacy-note">
        <LockKeyhole size={15} />
        <span>
          Tus archivos permanecen en este equipo. El OCR funciona localmente y el texto extraído
          puede ser imperfecto.
        </span>
      </div>
      <h3 className="stored-title">Cartolas disponibles</h3>
      <div className="month-chips">
        {(data?.periods ?? []).slice(0, MAX_PERIOD_CHIPS).map((item) => (
          <button
            key={item.period}
            onClick={() => selectPeriod(item.period)}
            className={period === item.period ? 'selected' : ''}
          >
            {monthLabel(item.period)}
          </button>
        ))}
      </div>
    </aside>
  );
}
