import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `/api/dashboard`;

  constructor(private http: HttpClient) {}

}
