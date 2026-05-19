import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Anime, AnimePaginated } from '../models/anime.model';
import { environment } from '../../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/anime`;

  getAll(page = 1, limit = 8, search = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search) params = params.set('search', search);

    return this.http.get<AnimePaginated>(`${this.base}/index`, { params });
  }

  getById(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<Anime>(`${this.base}/show`, { params });
  }

  save(data: Partial<Anime>) {
    return this.http.post<Anime>(`${this.base}/store`, data);
  }

  update(id: string, data: Partial<Anime>) {
    const params = new HttpParams().set('id', id);
    return this.http.put<Anime>(`${this.base}/update`, data, { params });
  }

  delete(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.base}/delete`, { params });
  }

  search(q: string) {
  const params = new HttpParams().set('q', q.trim());
  return this.http.get<Anime[]>(`${this.base}/search`, { params });
}
}