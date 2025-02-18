import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IResponse } from '../../model/interface/interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-submit-otp',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './submit-otp.component.html',
  styleUrl: './submit-otp.component.css'
})
export default class SubmitOtpComponent implements OnInit,OnDestroy {

  destroy$:Subject<void>= new Subject<void>()

  id: string = ''
  timer: number = 60
  isOtpExpired: boolean = false
  interval: any

  // class: string = ''
  // message: string = ''
  // alert: boolean = false
  // text: string = ''

  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  userService = inject(UserSrerviceService)
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

  ngOnInit(): void {
    this.startTimer()
  }


  otpForm: FormGroup = new FormGroup({
    otp: new FormControl('', Validators.required)
  })

  startTimer() {
    this.timer = 60
    this.isOtpExpired = false
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--
      } else {
        this.isOtpExpired = true
        clearInterval(this.interval)
      }
    }, 1000)
  }

  verifyOtp() {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params['id']
      console.log('id from otp: ', this.id);
      const otpFormValue = this.otpForm.value
      const data = {
        id: this.id,
        otp: otpFormValue.otp
      }
      this.userService.verifyOtp(data).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: HttpResponse<IResponse>) => {
          console.log(res.body);
          if (res.status === HttpStatusCodes.SUCCESS) {
            this.otpForm.reset()
            this.router.navigate(['login']);
          } else {
            this.alertService.getAlert("alert alert-danger", "Login Failed", res.body?.message || '')

            this.router.navigateByUrl(`/otp/${this.id}`)
          }
        },
        error: (error:HttpErrorResponse) => {
          console.log(error);
          this.alertService.getAlert("alert alert-danger", "Login Failed",  error.error.message)

        }
      })
    })
  }

  backToLogin() {
    this.router.navigate(['login']);
  }

  resendOtp() {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params['id']
    })
    console.log('id to reset password: ', this.id);

    this.userService.resendOtp(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status===HttpStatusCodes.SUCCESS) {
          this.startTimer()
          this.isOtpExpired = false
        } else {
          this.alertService.getAlert("alert alert-danger", "Login Failed", res.body?.message || '')

        }
      },
      error: (error) => {
        // this.callAlert("alert alert-danger", "Login Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
