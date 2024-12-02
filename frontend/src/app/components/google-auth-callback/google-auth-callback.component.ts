import { Component, inject, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';

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
    // this.userService.handleGoogleSignin().subscribe({
    //   next: (res: any) => {
    //     console.log('response from google sign in: ',res);
    //     if (res.success === true) {
    //       this.router.navigateByUrl('dashboard')
    //       this.userService.setLoggedUser(res.data)

    //     } else {
    //       // this.callAlert("alert alert-danger", "Login Failed", res.message)
    //       this.alertService.getAlert("alert alert-danger", "Login Failed", res.message)
    //       this.router.navigateByUrl('login')

    //     }
    //   },
    //   error: (error) => {
    //     this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)
    //   }
    // })
this.handleGoogleSignin()
  }

  handleGoogleSignin() {
    this.userService.handleGoogleSignin().subscribe({
      next: (res: any) => {
        console.log('response from google sign in: ',res);
        if (res.success === true) {
          this.router.navigateByUrl('dashboard')
          this.userService.setLoggedUser(res.data)

        } else {
          // this.callAlert("alert alert-danger", "Login Failed", res.message)
          this.alertService.getAlert("alert alert-danger", "Login Failed", res.message)
          this.router.navigateByUrl('login')

        }
      },
      error: (error) => {
        this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)
      }
    })
  }


}
