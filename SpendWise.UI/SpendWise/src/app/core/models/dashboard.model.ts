export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  topExpenseCategories: CategoryExpense[];
  recentTransactions: RecentTransaction[];
}

export interface CategoryExpense {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  transactionCount: number;
}

export interface RecentTransaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  type: number;
}
