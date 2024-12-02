import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ILoggedUserData } from '../../model/interface/interface';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserSrerviceService)
  const router = inject(Router)

  return userService.loggedUser$.pipe(
    take(1), // Ensure we only get the first emitted value
    map((user) => {
      if (user) {
        console.log('authguard: ', user);
        return true;  // User is authenticated, allow route activation
      } else {
        router.navigateByUrl('/login');  // Redirect to login if not authenticated
        return false;  // Block route activation
      }
    })
  );

};
