import { SectionHeader } from '../../components/ui/SectionHeader';
import { clp, monthLabel } from '../../lib/format';
import type { Period } from '../../types/api';

const CHART_WIDTH = 960;
const PLOT_TOP = 17;
const PLOT_BOTTOM = 220;
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP;
const GRID_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

const shortMonth = new Intl.DateTimeFormat('es-CL', { month: 'short', timeZone: 'UTC' });

function monthParts(period: string) {
  const label = shortMonth.format(new Date(`${period}-01T12:00:00Z`)).replace('.', '');
  const isJanuary = Number(period.slice(5)) === 1;
  return { label, year: isJanuary ? period.slice(2, 4) : '' };
}

export function CashflowChart({ periods }: { periods: Period[] }) {
  const months = periods
    .filter((item) => item.total_credits !== null && item.total_credits !== undefined)
    .slice()
    .sort((a, b) => a.period.localeCompare(b.period));

  const groupWidth = CHART_WIDTH / Math.max(months.length, 1);
  const maxAmount = Math.max(
    1,
    ...months.flatMap((item) => [Number(item.total_credits) || 0, Number(item.total_debits) || 0]),
  );

  return (
    <section className="section-card cashflow-card">
      <SectionHeader
        title="Ingresos y egresos por mes"
        description="Abonos y cargos totales según las cartolas bancarias cargadas."
      >
        <div className="chart-legend">
          <span>
            <i className="legend-income" />
            Ingresos
          </span>
          <span>
            <i className="legend-expense" />
            Egresos
          </span>
        </div>
      </SectionHeader>
      <div className="cashflow-chart">
        <svg
          viewBox="0 0 960 260"
          role="img"
          aria-label="Gráfico mensual de ingresos y egresos bancarios"
        >
          <title>Ingresos y egresos mensuales</title>
          {GRID_FRACTIONS.map((fraction) => {
            const y = PLOT_BOTTOM - PLOT_HEIGHT * fraction;
            return (
              <g key={fraction}>
                <line x1="0" x2={CHART_WIDTH} y1={y} y2={y} className="chart-gridline" />
                <text x="0" y={y - 4} className="chart-tick">
                  {fraction === 0 ? '0' : `${Math.round(((maxAmount * fraction) / 1000000) * 10) / 10}M`}
                </text>
              </g>
            );
          })}
          {months.map((item, index) => {
            const x = index * groupWidth + groupWidth / 2;
            const barWidth = Math.min(13, groupWidth * 0.31);
            const incomeHeight = ((Number(item.total_credits) || 0) / maxAmount) * PLOT_HEIGHT;
            const expenseHeight = ((Number(item.total_debits) || 0) / maxAmount) * PLOT_HEIGHT;
            const { label, year } = monthParts(item.period);

            return (
              <g key={item.period}>
                <rect
                  x={x - barWidth - 1}
                  y={PLOT_BOTTOM - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  rx="2"
                  className="chart-income"
                >
                  <title>
                    {monthLabel(item.period)} · Ingresos: {clp(item.total_credits)}
                  </title>
                </rect>
                <rect
                  x={x + 1}
                  y={PLOT_BOTTOM - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  rx="2"
                  className="chart-expense"
                >
                  <title>
                    {monthLabel(item.period)} · Egresos: {clp(item.total_debits)}
                  </title>
                </rect>
                <text x={x} y="239" textAnchor="middle" className="chart-month">
                  {label}
                  {year && (
                    <tspan x={x} dy="10">
                      {year}
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
