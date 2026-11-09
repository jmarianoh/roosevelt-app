import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  iconColor: 'green' | 'blue' | 'violet' | 'amber';
  icon: ReactNode;
  value: string;
  children: ReactNode;
  onClick?: () => void;
}

export function MetricCard({ label, iconColor, icon, value, children, onClick }: MetricCardProps) {
  const content = (
    <>
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${iconColor}`}>{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">{children}</div>
    </>
  );

  if (onClick) {
    return (
      <button className="metric-card expense-metric" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className="metric-card">{content}</div>;
}
