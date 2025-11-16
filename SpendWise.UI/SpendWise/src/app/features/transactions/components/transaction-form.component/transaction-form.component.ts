import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SaveTransactionRequest, Transaction, TransactionType, UpdateTransactionRequest} from '../../../../core/models';
import {TransactionService} from '../../../../core/services';

@Component({
  selector: 'transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  @Input() transaction: Transaction | null = null;
  @Input() categories: any[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formData = {
    amount: 0,
    description: '',
    date: '',
    type: TransactionType.Expense,
    categoryId: 0
  };

  TransactionType = TransactionType;
  errorMessage = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    if (this.transaction) {
      // Editing existing transaction
      this.formData = {
        amount: this.transaction.amount,
        description: this.transaction.description,
        type: this.transaction.typeId,
        date: new Date(this.transaction.date).toISOString().split('T')[0],
        categoryId: this.transaction.categoryId
      };
    } else {
      // New transaction - set default date to today
      this.formData.date = new Date().toISOString().split('T')[0];
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const transactionData = {
      amount: this.formData.amount,
      description: this.formData.description,
      date: new Date(this.formData.date),
      type: this.formData.type,
      categoryId: this.formData.categoryId
    };

    if (this.transaction) {
      Object.assign(transactionData, { id: this.transaction.id });
      // Update existing transaction
      this.transactionService
        .updateTransaction(transactionData as UpdateTransactionRequest)
        .subscribe({
          next: () => {
            this.saved.emit();
          },
          error: (error) => {
            console.error('Error updating transaction:', error);
            this.errorMessage = 'Failed to update transaction. Please try again.';
          }
        });
    } else {
      // Create new transaction
      this.transactionService
        .saveTransaction(transactionData as SaveTransactionRequest)
        .subscribe({
          next: () => {
            this.saved.emit();
          },
          error: (error) => {
            console.error('Error creating transaction:', error);
            this.errorMessage = 'Failed to create transaction. Please try again.';
          }
        });
    }
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (this.formData.amount <= 0) {
      this.errorMessage = 'Amount must be greater than 0';
      return false;
    }

    if (!this.formData.description.trim()) {
      this.errorMessage = 'Description is required';
      return false;
    }

    if (!this.formData.date) {
      this.errorMessage = 'Date is required';
      return false;
    }

    if (!this.formData.categoryId || this.formData.categoryId === 0) {
      this.errorMessage = 'Please select a category';
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
