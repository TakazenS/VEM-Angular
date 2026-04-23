import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ContactComponent } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'VEM | Login' },
  { path: 'dashboard', component: DashboardComponent, title: 'VEM | Dashboard' },
  { path: 'contact', component: ContactComponent, title: 'VEM | Contact' },
  { path: '**', redirectTo: '' }
];
