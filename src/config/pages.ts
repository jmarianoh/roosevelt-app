import { FileCheck2, History, Home, Landmark, Upload, Users, Building2, type LucideIcon } from 'lucide-react';

export type PageId = 'Resumen' | 'Cartolas' | 'Egresos' | 'Carga mensual' | 'Actividad' | 'Copropietarios y Residentes' | 'Ajustes';

export type Navigate = (page: PageId) => void;

export type SectionId = 'conciliacion' | 'sistema';

// Un módulo nuevo = una entrada aquí + sus páginas en PAGES + su render en AppShell.
export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'conciliacion', label: 'Conciliación bancaria' },
  { id: 'sistema', label: 'Sistema' },
];

interface PageConfig {
  id: PageId;
  icon: LucideIcon;
  section: SectionId;
  title: string;
  subtitle: string;
}

export const PAGES: PageConfig[] = [
  {
    id: 'Resumen',
    icon: Home,
    section: 'conciliacion',
    title: 'Resumen financiero',
    subtitle: 'Vista general de los movimientos y validaciones del condominio.',
  },
  {
    id: 'Cartolas',
    icon: Landmark,
    section: 'conciliacion',
    title: 'Cartolas bancarias',
    subtitle: 'Movimientos bancarios importados y saldo diario de cada período.',
  },
  {
    id: 'Egresos',
    icon: FileCheck2,
    section: 'conciliacion',
    title: 'Egresos y respaldos',
    subtitle: 'Revisa cada egreso y deja una decisión trazable para el comité.',
  },
  {
    id: 'Carga mensual',
    icon: Upload,
    section: 'conciliacion',
    title: 'Carga de documentos',
    subtitle: 'Carga cartolas, informes y documentos de respaldo de cada mes.',
  },
  {
    id: 'Actividad',
    icon: History,
    section: 'sistema',
    title: 'Registro de actividad',
    subtitle: 'Historial de conciliaciones y cambios registrados por el equipo.',
  },
  {
    id: 'Copropietarios y Residentes',
    icon: Building2,
    section: 'sistema',
    title: 'Copropietarios y residentes',
    subtitle: 'Padrón por departamento. Los correos se muestran ofuscados.',
  },
  {
    id: 'Ajustes',
    icon: Users,
    section: 'sistema',
    title: 'Accesos del comité',
    subtitle: 'Administra quién puede acceder al espacio del comité.',
  },
];
