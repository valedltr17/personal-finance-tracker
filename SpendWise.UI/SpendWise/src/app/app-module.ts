import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CategoryListComponent } from './features/categories/components/category-list.component/category-list.component';
import { CategoryFormComponent } from './features/categories/components/category-form.component/category-form.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {routes} from './app.routes';

@NgModule({
  declarations: [
    App,
    CategoryListComponent,
    CategoryFormComponent
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
  ],
  bootstrap: [App]
})
export class AppModule { }
