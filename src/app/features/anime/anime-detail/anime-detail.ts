import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { Anime } from '../models/anime.model';
import { LucideHeart, LucideStar, LucidePencil, LucideTrash2, LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [RouterLink, LucideHeart, LucideStar, LucidePencil, LucideTrash2, LucideArrowLeft],
  templateUrl: './anime-detail.html',
  styleUrl: './anime-detail.scss',
})
export class AnimeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AnimeService);
  private router = inject(Router);

  anime = signal<Anime | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe(res => this.anime.set(res));
  }

  delete() {
    const id = this.anime()?._id;
    if (!id) return;
    this.service.delete(id).subscribe(() => this.router.navigate(['/animes']));
  }
}