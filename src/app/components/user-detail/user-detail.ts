import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ContactComponent } from '../contact/contact';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ContactComponent],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetailComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  user = signal<any>(null);
  activeTab = signal<'profile' | 'contact'>('profile');

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

  setTab(tab: 'profile' | 'contact'): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
