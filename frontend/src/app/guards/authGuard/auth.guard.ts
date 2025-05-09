import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ILoggedUserData, IResponse } from '../../model/interface/interface';
import { catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpResponse } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserSrerviceService)
  const router = inject(Router)

  const alert = inject(AlertService)


  // return userService.loggedUser$.pipe(
  //   take(1), // Ensure we only get the first emitted value

  //   // map((user) => {
  //   //   if(user){
  //   //     console.log('logged user from authguard: ', user)
  //   //     if (!user.isActive){
  //   //       router.navigateByUrl('/login');  // Redirect to login if not authenticated
  //   //       alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
  //   //       return false;  // Block route activation  
  //   //     }else{
  //   //       // console.log('authguard: ', user);
  //   //       return true;  
  //   //     }
  //   //   }

  //   //   router.navigateByUrl('/login'); 
  //   //   return false; 

  //   // }),

  //   switchMap((user) => {
  //     if (user) {
  //       console.log('logged user from authguard: ', user)
  //       if (!user.isActive) {
  //         router.navigateByUrl('/login');  // Redirect to login if not authenticated
  //         alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
  //         // return false;  // Block route activation  
  //         return of(false)
  //       } else {
  //         // console.log('authguard: ', user);
  //         // return true;  
  //         return of(true)
  //       }
  //     }

  //     return userService.checkLoggedUser().pipe(
  //       map((user: HttpResponse<IResponse> | boolean) => {
  //         if (!user) return false
  //         if ((user as HttpResponse<IResponse>).body?.success) {
  //           const updatedUser = userService.loggedUserSubject.value
  //           if (updatedUser && !(updatedUser?.isActive)) {
  //             router.navigateByUrl('/login');  // Redirect to login if not authenticated
  //             alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
  //             return false;  // Block route activation  
  //           }
  //           return true;
  //         }
  //         router.navigateByUrl('/login');
  //         return false;
  //         // return of(false)
  //       }),
  //       catchError((error) => {
  //         router.navigateByUrl('login')
  //         alert.getAlert("alert alert-danger",'Authentication Error','Failed to verify authentication. Please log in again.')
  //         return of(false)
  //       })
  //     )


  //   })


  // );


  return userService.checkLoggedUser().pipe(
    take(1),
    map((isUser) => {
      if (isUser) {
        let loggedUser = userService.loggedUserSubject.value
        if (loggedUser && !(loggedUser.isActive)) {
          router.navigateByUrl('/login');  // Redirect to login if not authenticated
          alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
          return false;  // Block route activation  
        }
        return true
      }
      router.navigateByUrl('/login');
      return false;
    }),
    catchError((error) => {
      console.error('AuthGuard error:', error);
      router.navigateByUrl('/login');
      alert.getAlert(
        'alert alert-danger',
        'Authentication Error',
        'Failed to verify authentication. Please log in again.'
      );
      return of(false);
    })
  )

};
