import { ChevronRight, CircleHelp, Menu } from 'lucide-react';
import type { PageId } from '../../config/pages';
import { initials } from '../../lib/format';
import type { User } from '../../types/api';

interface TopbarProps {
  user: User;
  page: PageId;
  onToggleMobile: () => void;
}

export function Topbar({ user, page, onToggleMobile }: TopbarProps) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onToggleMobile}>
        <Menu size={20} />
      </button>
      <div className="breadcrumb">
        Administración <ChevronRight size={14} /> <strong>{page}</strong>
      </div>
      <div className="top-right">
        <span className="local-pill">
          <span className="online-dot" /> Espacio local
        </span>
        <span className="top-divider" />
        <button className="icon-button help-button" title="Documentación">
          <CircleHelp size={18} />
        </button>
        <button className="avatar top-avatar" title={user.name}>
          {initials(user.name)}
        </button>
      </div>
    </header>
  );
}
