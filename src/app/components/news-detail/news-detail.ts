import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css',
})
export class NewsDetailComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  user = signal<any>(null);
  news = signal<any>(null);
  isLoading = signal(true);
  headerTitle = 'Détail de l\'actualité';

  // Modal suppression
  showDeleteModal = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/actualites']);
      return;
    }

    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        this.loadNewsDetail(id);
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadNewsDetail(id: number): void {
    this.authService.getNewsById(id).subscribe({
      next: (response) => {
        console.log('Réponse API News Detail:', response);
        
        // Tentative d'extraction de l'objet actualité selon plusieurs structures possibles
        let data = response;
        if (response && response.data) data = response.data;
        else if (response && response.news) data = response.news;
        
        this.news.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'actualité', err);
        this.router.navigate(['/actualites']);
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    const newsItem = this.news();
    if (newsItem && newsItem.id) {
      this.authService.deleteNews(newsItem.id).subscribe({
        next: () => {
          this.router.navigate(['/actualites']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  editNews(): void {
    const newsItem = this.news();
    if (newsItem && newsItem.id) {
      this.router.navigate(['/actualites/edit', newsItem.id]);
    }
  }
}
