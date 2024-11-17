import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/user-srervice.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserSrerviceService)
  const router = inject(Router)
  const user = userService.getUser()
  console.log('authguard: ', user);
  
  if (user) {
    return true
  } else {
    router.navigateByUrl('login')
    return false;
  }
};
