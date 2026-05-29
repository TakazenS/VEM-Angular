import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ContactComponent } from './components/contact/contact';
import { NewsComponent } from './components/news/news';
import { NewsFormComponent } from './components/news-form/news-form';
import { NewsEditFormComponent } from './components/news-edit-form/news-edit-form';
import { NewsDetailComponent } from './components/news-detail/news-detail';
import { ForbiddenComponent } from './components/forbidden/forbidden';
import { roleGuard } from './services/role-guard';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'VEM | Login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], title: 'VEM | Dashboard' },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard, roleGuard], title: 'VEM | Contact' },
  { path: 'actualites', component: NewsComponent, canActivate: [authGuard], title: 'VEM | Actualités' },
  { path: 'actualites/new', component: NewsFormComponent, canActivate: [authGuard], title: 'VEM | Nouvelle Actualité' },
  { path: 'actualites/edit/:id', component: NewsEditFormComponent, canActivate: [authGuard], title: 'VEM | Modifier Actualité' },
  { path: 'actualite/:id', component: NewsDetailComponent, canActivate: [authGuard], title: 'VEM | Actualité' },
  { path: 'forbidden', component: ForbiddenComponent, title: 'VEM | Accès Refusé' },
  { path: '**', redirectTo: '' }
];
