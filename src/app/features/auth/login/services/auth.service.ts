import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/auth`;

  isLoggedIn = signal(false);
  isInitialized = signal(false);
  loading = signal(false);

  me() {
    return this.http.get(`${this.base}/me`).pipe(
      tap(() => {
        this.isLoggedIn.set(true);
        this.isInitialized.set(true);
      }),
      catchError((err) => {
        this.isInitialized.set(true);
        return throwError(() => err);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.isLoggedIn.set(true);
        this.isInitialized.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}