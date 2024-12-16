import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const userService = inject(UserSrerviceService)
  const router = inject(Router)
  const alert = inject(AlertService)

  // return next(req).pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401) {
  //       return userService.refreshToken().pipe(
  //         switchMap((res: any) => {
  //           console.log('Entered refreshtoken', res.body.data);
  //           console.log('setLoggedUser',res.body.data);
  //           userService.setLoggedUser(res.body.data)
  //           return next(req)
  //         })
  //       )
  //     } 
  //     return throwError(() => error)
  //   })

  // );

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return userService.refreshToken().pipe(
          switchMap((res: any) => {
            console.log('Entered refreshtoken', res.body.data);
            userService.setLoggedUser(res.body.data)
            return next(req)
          }),
          catchError((refreshError) => {
            console.log('Entered refreshtoken catcherror');

            router.navigateByUrl('login')
            alert.getAlert("alert alert-danger", "Authentication failed", "Please try to login again")
            return throwError(() => refreshError)
          })
        )
      } else if (error.status === 403) {
        return userService.userLogout().pipe(
          //tap() is used to perform side effects like navigating to the login page and showing an alert. It does not modify the observable's output.
          tap(() => {
            console.log('Entered user blocked interceptor');
            router.navigateByUrl('login')
            alert.getAlert("alert alert-danger", "Authentication failed", "Please try to login again")
          }),
          //After tap(), we use map() to ensure the final observable pipeline returns an HttpResponse to maintain the required type (HttpEvent<any>). This ensures the interceptor conforms to Angular's expectations.
          map(() => new HttpResponse({ status: 403 })),
          catchError((blockedError) => {
            router.navigateByUrl('login')
            alert.getAlert("alert alert-danger", "Authentication failed", "Please try to login again")
            return throwError(() => blockedError)
          })
        )
      }

      return throwError(() => error)
    })
  )

};
