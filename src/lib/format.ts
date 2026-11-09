export const clp = (amount: number | null | undefined) =>
  '$' + Math.round(amount ?? 0).toLocaleString('es-CL');

export const dateCL = (isoDate: string | null | undefined) =>
  isoDate
    ? new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${isoDate}T12:00:00Z`))
    : '—';

export const monthLabel = (period: string) =>
  new Intl.DateTimeFormat('es-CL', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${period}-01T12:00:00Z`));

export const digitsToNumber = (value: string | number) => Number(String(value).replace(/\D/g, ''));

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
