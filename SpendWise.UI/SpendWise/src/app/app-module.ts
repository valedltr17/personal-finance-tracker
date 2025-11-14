import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';

import { CategoryListComponent } from './features/categories/components/category-list.component/category-list.component';
import { CategoryFormComponent } from './features/categories/components/category-form.component/category-form.component';
import {
  TransactionFormComponent
} from './features/transactions/components/transaction-form.component/transaction-form.component';
import {
  TransactionListComponent
} from './features/transactions/components/transaction-list.component/transaction-list.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component/dashboard.component';

@NgModule({
  declarations: [
    App,
    CategoryListComponent,
    CategoryFormComponent,
    TransactionListComponent,
    TransactionFormComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
    RouterOutlet,
    RouterLink,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
