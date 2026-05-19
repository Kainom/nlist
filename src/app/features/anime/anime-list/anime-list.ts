import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { AnimeService } from '../services/anime.service';
import { Anime } from '../models/anime.model';
import { LucideHeart, LucideStar, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-anime-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LucideHeart, LucideStar, LucideSearch],
  templateUrl: './anime-list.html',
  styleUrl: './anime-list.scss',
})
export class AnimeList implements OnInit, OnDestroy {
  private service = inject(AnimeService);
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  animes = signal<Anime[]>([]);
  total = signal(0);
  page = signal(1);
  totalPages = signal(0);
  searchTerm = signal('');
  isSearching = signal(false);
  limit = 8;

  ngOnInit() {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          this.isSearching.set(false);
          this.page.set(1);
          return this.service.getAll(1, this.limit).pipe(
            // normaliza para o mesmo formato
            switchMap(res => {
              this.setResult(res.data, res.total);
              return [];
            })
          );
        }
        this.isSearching.set(true);
        return this.service.search(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (Array.isArray(res)) {
        this.animes.set(res);
        this.total.set(res.length);
        this.totalPages.set(0); // sem paginação na busca
      }
    });

    this.load();
  }

  load() {
    this.service.getAll(this.page(), this.limit)
      .subscribe(res => this.setResult(res.data, res.total));
  }

  setResult(data: Anime[], total: number) {
    this.animes.set(data);
    this.total.set(total);
    this.totalPages.set(Math.ceil(total / this.limit));
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.search$.next(term);
  }

  goTo(page: number) {
    this.page.set(page);
    this.load();
  }

  pages() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}