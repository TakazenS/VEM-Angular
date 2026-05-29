import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class NewsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = signal<any>(null);
  newsList = signal<any[]>([]);
  isLoading = signal(true);
  headerTitle = 'Actualités';

  // Modal suppression
  showDeleteModal = signal(false);
  newsToDeleteId = signal<number | null>(null);

  // Pagination
  currentPage = signal(1);
  pageSize = 5;

  paginatedNews = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.newsList().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.newsList().length / this.pageSize);
  });

  pageNumbers = computed(() => {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  });

  canAddNews() {
    return this.user() && this.user().role !== 'utilisateur';
  }

  addNews(): void {
    this.router.navigate(['/actualites/new']);
  }

  editNews(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/actualites/edit', id]);
  }

  viewNewsDetail(id: number): void {
    this.router.navigate(['/actualite', id]);
  }

  openDeleteModal(event: Event, id: number): void {
    event.stopPropagation();
    this.newsToDeleteId.set(id);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.newsToDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.newsToDeleteId();
    if (id) {
      this.authService.deleteNews(id).subscribe({
        next: () => {
          this.newsList.update(list => list.filter(n => n.id !== id));
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'actualité', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData) => {
        const user = userData.user || userData;
        this.user.set(user);
        this.loadNews();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadNews(): void {
    this.authService.getNews().subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response.data || []);
        this.newsList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des actualités', err);
        this.isLoading.set(false);
      }
    });
  }
}
