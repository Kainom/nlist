import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorService = inject(ErrorService);

  // o login não tem sessão para expirar: 401 aqui é credencial inválida
  const isLoginRequest = req.url.includes('/api/auth/login');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          errorService.show('Não foi possível falar com o servidor.');
          break;
        case 401:
          if (isLoginRequest) {
            errorService.show('Email ou senha inválidos.');
            break;
          }
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
