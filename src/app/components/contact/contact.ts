import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = signal<any>(null);
  allContacts = signal<any[]>([]);
  filter = signal<'all' | 'administration' | 'logistique'>('all');
  selectedContact = signal<any | null>(null);
  isLoading = signal(true);
  showDeleteModal = signal(false);
  contactToDeleteId = signal<number | null>(null);
  deleteSuccess = signal(false);

  headerTitle = 'Demandes de Contact';

  contacts = computed(() => {
    const rawData = this.allContacts();
    const currentFilter = this.filter();
    const userRole = this.user()?.role;

    if (!userRole) return [];

    if (userRole === 'directeur') {
      if (currentFilter === 'all') return rawData;
      return rawData.filter((contact: any) => 
        (contact.service || '').toLowerCase() === currentFilter.toLowerCase()
      );
    }

    // Pour les autres rôles, on filtre toujours par leur service
    return rawData.filter((contact: any) => {
      const contactService = contact.service || '';
      const targetService = (userRole === 'administrateur') ? 'administration' : userRole;
      return contactService.toLowerCase() === targetService.toLowerCase();
    });
  });

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        this.loadContacts();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadContacts(): void {
    this.authService.getContacts().subscribe({
      next: (response) => {
        const rawData = Array.isArray(response) ? response : (response.data || []);
        this.allContacts.set(rawData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur API Contact:', err);
        this.isLoading.set(false);
      }
    });
  }

  setFilter(newFilter: 'all' | 'administration' | 'logistique'): void {
    this.filter.set(newFilter);
  }

  selectContact(contact: any): void {
    this.selectedContact.set(contact);
  }

  deleteContact(event: Event, id: number): void {
    event.stopPropagation();
    this.contactToDeleteId.set(id);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.contactToDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.contactToDeleteId();
    if (id !== null) {
      this.authService.deleteContact(id).subscribe({
        next: () => {
          this.allContacts.update(prev => prev.filter(c => c.id !== id));
          if (this.selectedContact()?.id === id) {
            this.selectedContact.set(null);
          }
          this.cancelDelete();
          
          this.deleteSuccess.set(true);
          setTimeout(() => {
            this.deleteSuccess.set(false);
          }, 3000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.cancelDelete();
        }
      });
    }
  }

  backToList(): void {
    this.selectedContact.set(null);
  }
}
