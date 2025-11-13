import {Component, OnInit} from '@angular/core';
import {Transaction, TransactionFilter, TransactionSummary, TransactionType} from '../../../../core/models';
import {CategoryService, TransactionService} from '../../../../core/services';

@Component({
  selector: 'app-transaction-list.component',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: any[] = [];
  summary: TransactionSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    transactionCount: 0
  };

  // Filter properties
  filter: TransactionFilter = {};
  startDate: string = '';
  endDate: string = '';
  selectedCategoryId: number | null = null;
  selectedType: number | null = null;

  // Form properties
  showForm = false;
  editingTransaction: Transaction | null = null;

  TransactionType = TransactionType;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
    this.loadSummary();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.filter).subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  loadSummary(): void {
    this.transactionService.getSummary(this.filter.startDate, this.filter.endDate).subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }

  applyFilters(): void {
    this.filter = {};

    if (this.startDate) {
      this.filter.startDate = new Date(this.startDate);
    }
    if (this.endDate) {
      this.filter.endDate = new Date(this.endDate);
    }
    if (this.selectedCategoryId) {
      this.filter.categoryId = this.selectedCategoryId;
    }
    if (this.selectedType !== null) {
      this.filter.type = this.selectedType;
    }

    this.loadTransactions();
    this.loadSummary();
  }

  clearFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedCategoryId = null;
    this.selectedType = null;
    this.filter = {};
    this.loadTransactions();
    this.loadSummary();
  }

  openAddForm(): void {
    this.editingTransaction = null;
    this.showForm = true;
  }

  openEditForm(transaction: Transaction): void {
    this.editingTransaction = transaction;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTransaction = null;
  }

  onTransactionSaved(): void {
    this.closeForm();
    this.loadTransactions();
    this.loadSummary();
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
          this.loadSummary();
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    }
  }

  getTransactionTypeClass(type: number): string {
    return type === TransactionType.Income ? 'income' : 'expense';
  }
}
