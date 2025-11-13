export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  typeId: number;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
}

export interface SaveTransactionRequest {
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  categoryId: number;
}

export interface UpdateTransactionRequest {
  id: number;
  amount?: number;
  description?: string;
  date?: Date;
  type: TransactionType;
  categoryId?: number;
}

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

export enum TransactionType {
  Income = 1,
  Expense = 2
}
