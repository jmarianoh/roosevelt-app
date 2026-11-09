export interface PdfTextItem {
  str: string;
  transform: number[];
}

export interface DraftExpense {
  date: string;
  folio: string;
  concept: string;
  payee: string;
  amount: string;
  sourcePage: number | string;
}

export interface ReportCover {
  startDate: string;
  endDate: string;
  declaredTotal: string;
  expenses: DraftExpense[];
}

export interface ReportDraft extends ReportCover {
  documentId?: number;
  title: string;
  period: string;
}

export interface PdfPageText {
  page: number;
  text: string;
  ocr: boolean;
}

export interface PdfAnalysis {
  name: string;
  pages: number;
  ocrCount: number;
  amounts: number[];
  excerpt: string;
  pageTexts: PdfPageText[];
  draft: ReportCover;
}
