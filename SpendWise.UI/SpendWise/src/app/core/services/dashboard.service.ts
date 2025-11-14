import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CategoryBreakdownFilter,
  CategorySummary,
  DashboardSummary,
  GeneralDashboardFilter,
  MonthlyTrend
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `/api/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(filter?: GeneralDashboardFilter): Observable<DashboardSummary> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
    }

    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`, {params});
  }

  getMonthlyTrend(months: number = 6): Observable<MonthlyTrend[]> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<MonthlyTrend[]>(`${this.apiUrl}/monthly-trend`, {params});
  }

  getCategoryBreakdown(filter?: CategoryBreakdownFilter): Observable<CategorySummary[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.transactionType) params = params.set('type', filter.transactionType.toString());
    }

    return this.http.get<CategorySummary[]>(`${this.apiUrl}/category-breakdown`, {params});
  }
}
