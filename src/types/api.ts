export type UserRole = 'tesorero' | 'comite';
export type DocumentStatus = 'pendiente' | 'validado' | 'observado';
export type ApprovalStatus = 'pendiente' | 'aprobado' | 'observado';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface TeamMember extends User {
  created_at: string;
}

export interface SessionResponse {
  userCount: number;
  user?: User | null;
}

export interface AuthResponse {
  user: User;
}

export interface Tx {
  id: number;
  period: string;
  posted_at: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  source_row: number;
  document_id: number;
}

export interface Expense {
  id: number;
  date: string;
  folio: string;
  concept: string;
  payee: string;
  amount: number;
  source_page: number;
  kind: string;
  document_id?: number | null;
  attachment_count?: number;
  validated_matches?: number;
  approval_status?: ApprovalStatus | null;
  document_status?: DocumentStatus | null;
}

export interface Period {
  period: string;
  start_date: string | null;
  end_date: string | null;
  opening_balance: number | null;
  total_credits: number | null;
  total_debits: number | null;
  closing_balance: number | null;
}

export interface Statement {
  id: number;
  document_id: number;
  period: string;
  start_date: string;
  end_date: string;
  opening_balance: number;
  total_credits: number;
  total_debits: number;
  closing_balance: number;
}

export interface ExpenseReport {
  id: number;
  document_id: number;
  period: string;
  title: string;
  start_date: string;
  end_date: string;
  declared_total: number;
  detail_total: number;
  currency: string;
  original_name: string;
}

export interface DashboardSummary {
  income: number;
  outgoings: number;
  closingBalance: number;
  expenseDeclared: number;
  expenseDetail: number;
  expenseDifference: number;
  periodMismatch: boolean;
  validated: number;
  approved: number;
  total: number;
}

export interface Dashboard {
  periods: Period[];
  period: string;
  statement?: Statement | null;
  report: ExpenseReport | null;
  reports: ExpenseReport[];
  expenses: Expense[];
  pending: number;
  summary: DashboardSummary;
}

export interface Candidate {
  id: number;
  period: string;
  posted_at: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  original_name: string;
  used: number | boolean;
  exact: boolean;
  daysApart: number;
  inDateWindow: boolean;
}

export interface Reconciliation {
  id: number;
  expense_id: number;
  transaction_id: number;
  review_status: DocumentStatus;
  comment: string;
  posted_at: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reviewer: string | null;
}

export interface ExpenseReview {
  id: number;
  expense_id: number;
  document_status: DocumentStatus;
  approval_status: ApprovalStatus;
  comment: string;
  reviewer: string | null;
}

export interface ReconciliationsResponse {
  reconciliations: Reconciliation[];
  review: ExpenseReview | null;
}

export type SelectedReview = Partial<ExpenseReview> & {
  matches: Reconciliation[];
};

export interface ImportPreviewFile {
  name: string;
  hash: string;
  bytes: number;
  duplicate: boolean;
  type: 'cartola' | 'egreso';
  rows?: number;
  pages?: number | null;
  ocrRequired?: boolean;
}

export interface ImportPreviewResponse {
  files: ImportPreviewFile[];
}

export interface ImportConfirmFile {
  name: string;
  id?: number;
  duplicate?: boolean;
  requiresReview?: boolean;
  ocrOnClient?: boolean;
}

export interface ImportConfirmResponse {
  files: ImportConfirmFile[];
}

export interface ExpenseConfirmResponse {
  ok: boolean;
  reportId: number;
  expenseCount: number;
  detailTotal: number;
  difference: number;
}

export interface AuditEntry {
  id: number;
  action: string;
  entity: string;
  entity_id: number;
  detail: string;
  created_at: string;
  user_name: string | null;
}
