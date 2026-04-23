import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  user = signal<any>(null);

  headerTitle = computed(() => {
    const u = this.user();
    if (!u) return 'Chargement...';
    return `Bonjour, <span style="font-weight: 700; color: #1a202c;">${u.name} ${u.prenom}</span>`;
  });

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

  getNewsPage(): void {
    this.router.navigate(['/news']);
  }

  getContactPage(): void {
    this.router.navigate(['/contact']);
  }
}
