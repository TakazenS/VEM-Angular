import { Component, OnInit, inject, signal } from '@angular/core';
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
  contacts = signal<any[]>([]);
  selectedContact = signal<any | null>(null);
  isLoading = signal(true);
  showDeleteModal = signal(false);
  contactToDeleteId = signal<number | null>(null);
  deleteSuccess = signal(false);

  headerTitle = 'Demandes de Contact';

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData) => {
        // En fonction de la structure de retour de getUser
        const user = userData.user || userData;
        this.user.set(user);
        this.loadContacts(user.role);
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadContacts(userRole: string): void {
    this.authService.getContacts().subscribe({
      next: (response) => {
        const rawData = Array.isArray(response) ? response : (response.data || []);

        // DEBUG: Vérifiez ce log dans F12 pour voir le nom exact du champ de rôle
        console.log('Données reçues de l\'API:', rawData[0]);
        console.log('Rôle de l\'utilisateur actuel:', userRole);

        let filteredData = rawData;

        if (userRole !== 'directeur') {
          filteredData = rawData.filter((contact: any) => {
            const contactService = contact.service || '';
            
            // On mappe 'administrateur' vers 'administration' pour la comparaison
            const targetService = (userRole === 'administrateur') ? 'administration' : userRole;
            
            return contactService.toLowerCase() === targetService.toLowerCase();
          });
        }

        this.contacts.set(filteredData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur API Contact:', err);
        this.isLoading.set(false);
      }
    });
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
          this.contacts.update(prev => prev.filter(c => c.id !== id));
          if (this.selectedContact()?.id === id) {
            this.selectedContact.set(null);
          }
          this.cancelDelete();
          
          // Affichage du message de succès pendant 3 secondes
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
