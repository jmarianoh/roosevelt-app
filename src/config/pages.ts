import { FileCheck2, History, Home, Landmark, Upload, Users, type LucideIcon } from 'lucide-react';

export type PageId = 'Resumen' | 'Cartolas' | 'Egresos' | 'Carga mensual' | 'Actividad' | 'Ajustes';

export type Navigate = (page: PageId) => void;

interface PageConfig {
  id: PageId;
  icon: LucideIcon;
  section: 'admin' | 'records';
  title: string;
  subtitle: string;
}

export const PAGES: PageConfig[] = [
  {
    id: 'Resumen',
    icon: Home,
    section: 'admin',
    title: 'Resumen financiero',
    subtitle: 'Vista general de los movimientos y validaciones del condominio.',
  },
  {
    id: 'Cartolas',
    icon: Landmark,
    section: 'admin',
    title: 'Cartolas bancarias',
    subtitle: 'Movimientos bancarios importados y saldo diario de cada período.',
  },
  {
    id: 'Egresos',
    icon: FileCheck2,
    section: 'admin',
    title: 'Egresos y respaldos',
    subtitle: 'Revisa cada egreso y deja una decisión trazable para el comité.',
  },
  {
    id: 'Carga mensual',
    icon: Upload,
    section: 'admin',
    title: 'Carga de documentos',
    subtitle: 'Carga cartolas, informes y documentos de respaldo de cada mes.',
  },
  {
    id: 'Actividad',
    icon: History,
    section: 'records',
    title: 'Registro de actividad',
    subtitle: 'Historial de conciliaciones y cambios registrados por el equipo.',
  },
  {
    id: 'Ajustes',
    icon: Users,
    section: 'records',
    title: 'Accesos del comité',
    subtitle: 'Administra quién puede acceder al espacio de tesorería.',
  },
];
