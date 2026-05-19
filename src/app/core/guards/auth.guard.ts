import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/login/services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return auth.me().pipe(
    map(() => true),
    catchError(() => {
      auth.logout();
      router.navigate(['/login']);
      return of(false);
    })
  );
};