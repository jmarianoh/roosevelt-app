import type { DraftExpense, PdfTextItem, ReportCover } from './types';

const ROW_TOLERANCE = 3;
const FOLIO_X = 76;
const CONCEPT_X = 150;
const AMOUNT_X = 335;
const PAYEE_X = 405;

const DATE_RANGE = /(\d{2})-(\d{2})-(\d{4})\s*\/\s*(\d{2})-(\d{2})-(\d{4})/;
const SINGLE_DATE = /\d{2}-\d{2}-20\d{2}/;

interface Cell {
  x: number;
  text: string;
}

function groupIntoRows(items: PdfTextItem[]): Cell[][] {
  const groups: { y: number; items: PdfTextItem[] }[] = [];

  for (const item of items) {
    if (!item.str?.trim()) continue;
    const y = Number(item.transform?.[5] ?? 0);
    let group = groups.find((candidate) => Math.abs(candidate.y - y) < ROW_TOLERANCE);
    if (!group) {
      group = { y, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups
    .sort((a, b) => b.y - a.y)
    .map((group) =>
      group.items
        .sort((a, b) => a.transform[4] - b.transform[4])
        .map((item) => ({ x: Number(item.transform[4]), text: String(item.str).trim() })),
    );
}

function columnText(row: Cell[], from: number, to: number) {
  return row
    .filter((cell) => cell.x >= from && cell.x < to)
    .map((cell) => cell.text)
    .join(' ')
    .trim();
}

function findDateRange(rows: Cell[][]) {
  const line = rows
    .flat()
    .map((cell) => cell.text)
    .find((text) => DATE_RANGE.test(text));
  const match = line?.match(DATE_RANGE);
  if (!match) return null;
  return {
    startDate: `${match[3]}-${match[2]}-${match[1]}`,
    endDate: `${match[6]}-${match[5]}-${match[4]}`,
  };
}

/** Extrae período, total y partidas a partir de la posición del texto en la portada del informe. */
export function parseReportCover(items: PdfTextItem[], fallbackPeriod: string): ReportCover {
  const rows = groupIntoRows(items);
  const range = findDateRange(rows);
  const startDate = range?.startDate ?? `${fallbackPeriod}-01`;
  const endDate = range?.endDate ?? `${fallbackPeriod}-28`;

  let total = 0;
  const expenses: DraftExpense[] = [];

  for (const row of rows) {
    const date = columnText(row, -Infinity, FOLIO_X);
    const folio = columnText(row, FOLIO_X, CONCEPT_X);
    const concept = columnText(row, CONCEPT_X, AMOUNT_X);
    const money = columnText(row, AMOUNT_X, PAYEE_X);
    const payee = columnText(row, PAYEE_X, Infinity);
    const amount = Number(money.replace(/[^\d]/g, ''));

    if (concept.toUpperCase() === 'TOTAL') {
      total = amount;
      continue;
    }

    if (concept && money && payee && amount) {
      expenses.push({
        date: date.match(SINGLE_DATE)?.[0].split('-').reverse().join('-') || startDate,
        folio: folio === '-' ? '' : folio,
        concept,
        payee,
        amount: String(amount),
        sourcePage: 1,
      });
    } else if (concept && expenses.length && !money && !payee && !concept.startsWith('Documentos')) {
      expenses[expenses.length - 1].concept += ` ${concept}`;
    }
  }

  return { startDate, endDate, declaredTotal: String(total || ''), expenses };
}
