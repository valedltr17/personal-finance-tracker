import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {
  SaveTransactionRequest,
  Transaction,
  TransactionSummary,
  UpdateTransactionRequest, TransactionFilter
} from '../models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `/api/transactions`;

  constructor(private http: HttpClient) { }

  // Get all transactions with filters
  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.categoryId !== undefined) params = params.set('categoryId', filter.categoryId.toString());
      if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    }

    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }

  // Get transaction by id
  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Create transaction
  saveTransaction(transaction: SaveTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // Update transaction
  updateTransaction(transaction: UpdateTransactionRequest): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/`, transaction);
  }

  // Delete transaction
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get Transaction Summary
  getSummary(startDate?: Date, endDate?: Date): Observable<TransactionSummary> {
    let params = new HttpParams();

    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<TransactionSummary>(`${this.apiUrl}/summary`, { params });
  }
}
