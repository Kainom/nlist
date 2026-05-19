import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AnimeList } from './features/anime/anime-list/anime-list';
import { AnimeForm } from './features/anime/anime-form/anime-form';
import { AnimeDetail } from './features/anime/anime-detail/anime-detail';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'animes', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'animes', component: AnimeList, canActivate: [authGuard] },
  { path: 'anime/new', component: AnimeForm, canActivate: [authGuard] },
  { path: 'anime/:id', component: AnimeDetail, canActivate: [authGuard] },
  { path: 'anime/edit/:id', component: AnimeForm, canActivate: [authGuard] },
];