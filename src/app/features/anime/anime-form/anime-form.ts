import { Component, inject, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-anime-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideHeart],
  templateUrl: './anime-form.html',
  styleUrl: './anime-form.scss',
})
export class AnimeForm implements OnInit {
  private service = inject(AnimeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  preview: string | null = null;
  editId: string | null = null;
  statusOpen = false;
  statusOptions = ['watching', 'completed',  'planned', 'paused','dropped'];

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    rating: new FormControl(''),
    episodes: new FormControl(''),
    status: new FormControl('watching'),
    imageUrl: new FormControl(''),
  });

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.service.getById(this.editId).subscribe(anime => {
        this.form.patchValue(anime as any);
        this.preview = anime.imageUrl || null;
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.onload = () => this.preview = reader.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  onUrlChange() {
    this.preview = this.form.value.imageUrl || null;
  }

  clampRating(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseFloat(input.value);
    if (val > 10) input.value = '10';
    if (val < 0) input.value = '0';
    this.form.get('rating')?.setValue(input.value);
  }

  selectStatus(opt: string) {
    this.form.get('status')?.setValue(opt);
    this.statusOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const el = event.target as HTMLElement;
    if (!el.closest('.select__wrapper')) this.statusOpen = false;
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = this.form.value as any;

    if (this.editId) {
      this.service.update(this.editId, data).subscribe(() => this.router.navigate(['/animes']));
    } else {
      this.service.save(data).subscribe(() => this.router.navigate(['/animes']));
    }
  }
}