import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  user = signal<any>(null);

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.router.navigate(['/']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getNewsPage(): void {
    this.router.navigate(['/news']);
  }

  getContactPage(): void {
    this.router.navigate(['/contact']);
  }
}
