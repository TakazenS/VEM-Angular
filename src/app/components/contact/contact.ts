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

  headerTitle = 'Demandes de Contact';

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => this.user.set(data),
      error: () => this.router.navigate(['/'])
    });

    this.authService.getContacts().subscribe({
      next: (response) => {
        // Extraction des données (tableau direct ou propriété .data)
        const data = Array.isArray(response) ? response : (response.data || []);
        this.contacts.set(data);
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

  backToList(): void {
    this.selectedContact.set(null);
  }
}
