import { CategoryType } from './category.model';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: CategoryType;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

export interface SaveTransactionRequest {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface UpdateTransactionRequest {
  id: number;
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}
