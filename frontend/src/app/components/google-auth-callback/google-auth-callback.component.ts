import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IResponse } from '../../model/interface/interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-google-auth-callback',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './google-auth-callback.component.html',
  styleUrl: './google-auth-callback.component.css'
})
export class GoogleAuthCallbackComponent implements OnInit,OnDestroy {

  destroy$:Subject<void>=new Subject<void>()

  userService = inject(UserSrerviceService)
  router = inject(Router)
  alertService = inject(AlertService)


  ngOnInit(): void {
    this.handleGoogleSignin()
  }

  handleGoogleSignin() {
    this.userService.handleGoogleSignin().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('response from google sign in: ', res.body);
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.router.navigateByUrl('dashboard')
          const userData = res.body?.data
          const loggedUser = {
            id: userData._id,
            user: userData.name,
            role: userData.role,
            username: userData.username,
            email: userData.email,
            isActive: userData.isActive
          }
          this.userService.setLoggedUser(loggedUser)

        } else {
          this.alertService.getAlert("alert alert-danger", "Login Failed", res.body?.message ? res.body?.message : '')
          this.router.navigateByUrl('login')

        }
      },
      error: (error) => {
        // console.log(error.error.message);
        this.alertService.getAlert("alert alert-danger", "Login Failed", error.error.message)
        this.router.navigateByUrl('login')

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
