import { Routes } from '@angular/router';
import {CategoryListComponent} from './features/categories/components/category-list.component/category-list.component';
import {CategoryFormComponent} from './features/categories/components/category-form.component/category-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/edit/:id', component: CategoryFormComponent },
  { path: '**', redirectTo: '/categories' }
];
