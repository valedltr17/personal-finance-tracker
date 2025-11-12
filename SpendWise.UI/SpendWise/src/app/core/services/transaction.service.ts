import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {
  CategoryType,
  SaveTransactionRequest,
  Transaction,
  TransactionSummary,
  UpdateTransactionRequest
} from '../models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) { }

  // Get all transactions with filters
  getTransactions(
    startDate?: string,
    endDate?: string,
    categoryId?: string,
    type?: CategoryType
  ): Observable<Transaction[]> {
    let params = new HttpParams();

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (type !== undefined) params = params.set('type', type.toString());

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
  getTransactionSummary(startDate?: string, endDate?: string): Observable<TransactionSummary> {
    let params = new HttpParams();

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionSummary>(`${this.apiUrl}/summary`, { params });
  }
}
