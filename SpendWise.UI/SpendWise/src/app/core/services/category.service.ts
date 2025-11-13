import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category, SaveCategoryRequest, UpdateCategoryRequest} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `/api/categories`;

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Get category
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Create category
  createCategory(category: SaveCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // Update category
  updateCategory(category: UpdateCategoryRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}`, category);
  }

  // Delete category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
