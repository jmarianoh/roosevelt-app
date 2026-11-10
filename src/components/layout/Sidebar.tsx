import { ArrowRight, ChevronDown, CircleHelp, Landmark, LogOut, X } from 'lucide-react';
import { Fragment } from 'react';
import { PAGES, SECTIONS, type Navigate, type PageId, type SectionId } from '../../config/pages';
import { useDashboard } from '../../context/DashboardContext';
import { useSession } from '../../context/SessionContext';
import { initials } from '../../lib/format';
import type { User } from '../../types/api';

interface SidebarProps {
  user: User;
  page: PageId;
  isMobileOpen: boolean;
  onNavigate: Navigate;
  onSelectPage: Navigate;
  onCloseMobile: () => void;
}

export function Sidebar({
  user,
  page,
  isMobileOpen,
  onNavigate,
  onSelectPage,
  onCloseMobile,
}: SidebarProps) {
  const { pending } = useDashboard();
  const { logout } = useSession();

  const renderNav = (section: SectionId) => (
    <nav>
      {PAGES.filter((item) => item.section === section).map(({ id, icon: Icon }) => (
        <button
          className={`nav-item ${page === id ? 'active' : ''}`}
          key={id}
          onClick={() => onSelectPage(id)}
        >
          <Icon size={17} />
          <span>{id}</span>
          {id === 'Egresos' && pending > 0 && <b className="nav-count">{pending}</b>}
        </button>
      ))}
    </nav>
  );

  return (
    <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <Landmark size={20} />
        </div>
        <div>
          <span className="brand-name">ROOSEVELT</span>
          <span className="brand-sub">ADMINISTRACIÓN</span>
        </div>
        <button className="icon-button mobile-close" onClick={onCloseMobile}>
          <X size={19} />
        </button>
      </div>

      <div className="building-card">
        <div className="building-thumb">
          <Landmark size={20} />
          <span>1760</span>
        </div>
        <div>
          <strong>Edificio Roosevelt</strong>
          <span>Concepción, Chile</span>
        </div>
        <ChevronDown size={14} className="muted" />
      </div>

      {SECTIONS.map(({ id, label }, i) => (
        <Fragment key={id}>
          <div className={`nav-caption ${i > 0 ? 'second-cap' : ''}`}>{label.toUpperCase()}</div>
          {renderNav(id)}
        </Fragment>
      ))}

      <div className="sidebar-bottom">
        <div className="support-card">
          <div className="support-icon">
            <CircleHelp size={17} />
          </div>
          <strong>¿Necesitas ayuda?</strong>
          <span>Consulta la guía de uso para el equipo.</span>
          <button onClick={() => onNavigate('Carga mensual')}>
            Ver guía <ArrowRight size={13} />
          </button>
        </div>
        <div className="sidebar-user">
          <div className="avatar">{initials(user.name)}</div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>Comité</span>
          </div>
          <button className="icon-button" title="Cerrar sesión" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
