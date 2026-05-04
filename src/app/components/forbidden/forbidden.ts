import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="forbidden-container">
      <h1>403</h1>
      <h2>Accès non autorisé</h2>
      <p>Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <a routerLink="/dashboard" class="btn-home">Retour au Dashboard</a>
    </div>
  `,
  styles: [`
    .forbidden-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: sans-serif;
      text-align: center;
      background-color: #f7fafc;
    }
    h1 { font-size: 8rem; margin: 0; color: #1a202c; }
    h2 { font-size: 2rem; color: #2d3748; margin-bottom: 1rem; }
    p { color: #4a5568; margin-bottom: 2rem; }
    .btn-home {
      background-color: #1a202c;
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class ForbiddenComponent {}
