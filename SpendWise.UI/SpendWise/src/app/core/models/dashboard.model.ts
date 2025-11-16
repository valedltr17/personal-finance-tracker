import {Transaction, TransactionType} from './transaction.model';

export interface GeneralDashboardFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface CategoryBreakdownFilter extends GeneralDashboardFilter {
  transactionType?: TransactionType;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  expensesByCategory: CategoryExpenses[];
  recentTransactions: Transaction[];
}

export interface CategoryExpenses {
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  netBalance: number;
}

export interface CategorySummary {
  categoryName: string;
  categoryColor: string;
  transactionTypeId: TransactionType;
  transactionType: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}
