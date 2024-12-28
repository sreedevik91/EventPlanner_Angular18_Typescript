import { Component, inject, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HttpResponse } from '@angular/common/http';
import { IResponse } from '../../model/interface/interface';

@Component({
  selector: 'app-google-auth-callback',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './google-auth-callback.component.html',
  styleUrl: './google-auth-callback.component.css'
})
export class GoogleAuthCallbackComponent implements OnInit {

  userService = inject(UserSrerviceService)
  router = inject(Router)
  alertService = inject(AlertService)


  ngOnInit(): void {
    this.handleGoogleSignin()
  }

  handleGoogleSignin() {
    this.userService.handleGoogleSignin().subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('response from google sign in: ', res.body);
        if (res.status === 200) {
          this.router.navigateByUrl('dashboard')
          this.userService.setLoggedUser(res.body?.data)

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


}
