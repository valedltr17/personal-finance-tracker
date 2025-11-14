import { Routes } from '@angular/router';
import {CategoryListComponent} from './features/categories/components/category-list.component/category-list.component';
import {CategoryFormComponent} from './features/categories/components/category-form.component/category-form.component';
import {DashboardComponent} from './features/dashboard/components/dashboard.component/dashboard.component';
import {
  TransactionFormComponent
} from './features/transactions/components/transaction-form.component/transaction-form.component';
import {
  TransactionListComponent
} from './features/transactions/components/transaction-list.component/transaction-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/edit/:id', component: CategoryFormComponent },

  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
  { path: 'transactions/edit/:id', component: TransactionFormComponent },
  { path: '**', redirectTo: '/dashboard' },
];
