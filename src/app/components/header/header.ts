import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  title = input<string>('');
  showBackButton = input<boolean>(false);
  backRoute = input<string>('/dashboard');
  user = input<any>(null);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate([this.backRoute()]);
  }
}
