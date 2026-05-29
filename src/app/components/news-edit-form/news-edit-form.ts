import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-news-edit-form',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './news-edit-form.html',
  styleUrl: './news-edit-form.css',
})
export class NewsEditFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  user = signal<any>(null);
  headerTitle = 'Modifier l\'actualité';
  newsId: number | null = null;
  isLoading = signal(true);
  
  newsData = {
    titre: '',
    content: ''
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.newsId = idParam ? Number(idParam) : null;

    if (!this.newsId) {
      this.router.navigate(['/actualites']);
      return;
    }

    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        
        if (user.role === 'utilisateur') {
          this.router.navigate(['/actualites']);
          return;
        }

        this.loadNewsData();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadNewsData(): void {
    if (this.newsId) {
      this.authService.getNewsById(this.newsId).subscribe({
        next: (response) => {
          console.log('Données reçues pour édition:', response);
          const data = response.data || response;
          this.newsData.titre = data.titre || '';
          this.newsData.content = data.content || '';
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données', err);
          this.router.navigate(['/actualites']);
        }
      });
    }
  }

  onSubmit(): void {
    console.log('Tentative de soumission. newsId:', this.newsId, 'newsData:', this.newsData);
    
    if (this.newsId && this.newsData.titre && this.newsData.content) {
      this.authService.updateNews(this.newsId, this.newsData).subscribe({
        next: (res) => {
          console.log('Mise à jour réussie:', res);
          this.router.navigate(['/actualites']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          // On affiche l'erreur pour aider au diagnostic
          alert('Erreur lors de l\'enregistrement : ' + (err.error?.message || err.message));
        }
      });
    } else {
      console.warn('Soumission ignorée : Données incomplètes', { 
        newsId: this.newsId, 
        titre: !!this.newsData.titre, 
        content: !!this.newsData.content 
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/actualites']);
  }
}
