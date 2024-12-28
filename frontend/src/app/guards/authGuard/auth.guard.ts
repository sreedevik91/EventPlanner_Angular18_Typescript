import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ILoggedUserData } from '../../model/interface/interface';
import { catchError, map, take, throwError } from 'rxjs';
import { AlertService } from '../../services/alertService/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserSrerviceService)
  const router = inject(Router)

  const alert = inject(AlertService)


  return userService.loggedUser$.pipe(
    take(1), // Ensure we only get the first emitted value
    // map((user) => {
    //   if (user?.isActive) {
    //     console.log('authguard: ', user);
    //     return true;  // User is authenticated, allow route activation
    //   } else {
    //     router.navigateByUrl('/login');  // Redirect to login if not authenticated
    //     alert.getAlert("alert alert-danger", "Login failed", "Your account has been blocked. Contact admin for more details.")
    //     return false;  // Block route activation
    //   }
    // })


    map((user) => {
      if(user){
        if (!user.isActive){
          router.navigateByUrl('/login');  // Redirect to login if not authenticated
          alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
          return false;  // Block route activation  
        }else{
          console.log('authguard: ', user);
          return true;  
        }
      }

      router.navigateByUrl('/login'); 
      return false; 

      // if (!user?.isActive) {
      //   router.navigateByUrl('/login');  // Redirect to login if not authenticated
      //   alert.getAlert("alert alert-danger", "Account Blocked", "Your account has been blocked. Contact admin for more details.")
      //   return false;  // Block route activation
      // }
      // console.log('authguard: ', user);
      // return true;  // User is authenticated, allow route activation
    }),
    catchError((error) => {
      router.navigateByUrl('login') 
      alert.getAlert("alert alert-danger", "", error)
      return throwError(() => error)
    })
  );


};
