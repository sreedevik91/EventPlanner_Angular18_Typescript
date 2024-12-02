import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, FormComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  // class: string = ''
  // message: string = ''
  // alert: boolean = false
  // text: string = ''

  activeRoute = inject(ActivatedRoute)
  userServices = inject(UserSrerviceService)
  router = inject(Router)
  alertService = inject(AlertService)

  // callAlert(classValue: string, text: string, message: string) {
  //   this.alert = true
  //   this.class = classValue
  //   this.text = text
  //   this.message = message
  //   setTimeout(() => {
  //     this.alert = false
  //   }, 2000)
  // }

  verifyEmailForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    }
  )

  verifyEmail() {
    debugger
    this.userServices.verifyUserEmail(this.verifyEmailForm.value).subscribe({
      next: (res: any) => {
        console.log('verify email response: ', res);
        if (res.success) {
          // this.callAlert('alert alert-success', 'Otp Sent', res.message)
this.alertService.getAlert('alert alert-success', 'Success!', res.message)

          this.router.navigateByUrl(`/otp/${res.data._id}`)
        } else {
          // this.callAlert('alert alert-danger', 'Error', res.message)
this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }
        this.verifyEmailForm.reset()

      },
      error: (error: any) => {
        // this.callAlert("alert alert-danger", "Sent email Failed", error.message)
this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)


      }
    })
  }
}
