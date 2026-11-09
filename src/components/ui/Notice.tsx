import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface NoticeProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Notice({ title, children, action }: NoticeProps) {
  return (
    <div className="notice notice-amber">
      <span className="notice-icon">
        <AlertCircle size={19} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
      {action}
    </div>
  );
}
