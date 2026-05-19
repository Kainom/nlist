import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';
import { LoadingService } from './core/services/loading.service';
import { ErrorService } from './core/services/error.service';
import { AuthService } from './features/auth/login/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, LucideHeart],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  loading = inject(LoadingService);
  error = inject(ErrorService);
  auth = inject(AuthService);
  scrolled = false;

  constructor() {
    const token = this.auth.getToken();
    if (token) {
      this.auth.me().subscribe({
        error: () => this.auth.logout()
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }
}