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
  contactCount = signal<number>(0);

  headerTitle = computed(() => {
    const u = this.user();
    if (!u) return 'Chargement...';
    return `Bonjour, <span style="font-weight: 700; color: #1a202c;">${u.name} ${u.prenom}</span>`;
  });

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        this.loadContactCount(user.role);
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.router.navigate(['/']);
      }
    });
  }

  loadContactCount(userRole: string): void {
    const allowedRoles = ['administrateur', 'logistique', 'directeur'];
    if (!allowedRoles.includes(userRole)) return;

    this.authService.getContacts().subscribe({
      next: (response) => {
        const rawData = Array.isArray(response) ? response : (response.data || []);
        
        let filteredData = rawData;
        if (userRole !== 'directeur') {
          filteredData = rawData.filter((contact: any) => {
            const contactService = contact.service || '';
            const targetService = (userRole === 'administrateur') ? 'administration' : userRole;
            return contactService.toLowerCase() === targetService.toLowerCase();
          });
        }
        
        this.contactCount.set(filteredData.length);
      },
      error: (err) => console.error('Error fetching contact count', err)
    });
  }

  getNewsPage(): void {
    this.router.navigate(['/actualites']);
  }

  getContactPage(): void {
    this.router.navigate(['/contact']);
  }
}
