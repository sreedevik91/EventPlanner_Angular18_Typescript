import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserSrerviceService } from '../services/user-srervice.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const userService = inject(UserSrerviceService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return userService.refreshToken().pipe(
          switchMap(() => {
            console.log('Entered refreshtoken');
            return next(req)
          })
        )
      }
      return throwError(()=>error)
    })

  );

};
