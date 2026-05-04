import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ContactComponent } from './components/contact/contact';
import { ForbiddenComponent } from './components/forbidden/forbidden';
import { roleGuard } from './services/role-guard';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'VEM | Login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], title: 'VEM | Dashboard' },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard, roleGuard], title: 'VEM | Contact' },
  { path: 'forbidden', component: ForbiddenComponent, title: 'VEM | Accès Refusé' },
  { path: '**', redirectTo: '' }
];
