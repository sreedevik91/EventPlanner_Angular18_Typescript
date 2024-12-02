import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const userService = inject(UserSrerviceService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return userService.refreshToken().pipe(
          switchMap((res: any) => {
            console.log('Entered refreshtoken', res.data);
            userService.setLoggedUser(res.userData)
            return next(req)
          })
        )
      }
      return throwError(() => error)
    })

  );

};
