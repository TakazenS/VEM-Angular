import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './news-form.html',
  styleUrl: './news-form.css',
})
export class NewsFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = signal<any>(null);
  headerTitle = 'Nouvelle Actualité';
  
  newsData = {
    titre: '',
    content: ''
  };

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        
        // Sécurité supplémentaire : si l'utilisateur est un simple "utilisateur", on le redirige
        if (user.role === 'utilisateur') {
          this.router.navigate(['/actualites']);
        }
      },
      error: () => this.router.navigate(['/'])
    });
  }

  onSubmit(): void {
    if (this.newsData.titre && this.newsData.content) {
      this.authService.postNews(this.newsData).subscribe({
        next: (response) => {
          console.log('Actualité publiée avec succès', response);
          this.router.navigate(['/actualites']);
        },
        error: (err) => {
          console.error('Erreur lors de la publication de l\'actualité', err);
          // On pourrait ajouter un message d'erreur à l'utilisateur ici
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/actualites']);
  }
}
