import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { NewsComponent } from './components/news/news';
import { ContactComponent } from './components/contact/contact';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'VEM | Login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], title: 'VEM | Dashboard' },
  { path: 'news', component: NewsComponent, canActivate: [authGuard], title: 'VEM | Actualitées' },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard], title: 'VEM | Contact' },
  { path: '**', redirectTo: '' }
];
