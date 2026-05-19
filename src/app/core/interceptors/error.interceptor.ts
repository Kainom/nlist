import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          localStorage.removeItem('token');
          router.navigate(['/login']);
          errorService.show('Sessão expirada. Faça login novamente.');
          break;
        case 403:
          errorService.show('Você não tem permissão para isso.');
          break;
        case 404:
          errorService.show('Recurso não encontrado.');
          break;
        case 500:
          errorService.show('Erro interno do servidor. Tente novamente.');
          break;
        default:
          errorService.show('Algo deu errado. Tente novamente.');
      }
      return throwError(() => error);
    })
  );
};