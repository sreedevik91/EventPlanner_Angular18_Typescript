import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { AlertService } from '../../services/alertService/alert.service';

@Component({
  selector: 'app-submit-otp',
  standalone: true,
  imports: [ReactiveFormsModule,AlertComponent],
  templateUrl: './submit-otp.component.html',
  styleUrl: './submit-otp.component.css'
})
export class SubmitOtpComponent implements OnInit {

  ngOnInit(): void {
    this.startTimer()
  }

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

  otpForm: FormGroup = new FormGroup({
    otp: new FormControl('', Validators.required)
  })

  startTimer() {
    this.timer = 60
    this.isOtpExpired = false
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--
      }else{
        this.isOtpExpired=true
        clearInterval(this.interval)
      }
    }, 1000)
  }

  verifyOtp() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id']
      console.log('id from otp: ', this.id);
      const otpFormValue = this.otpForm.value
      const data = {
        id: this.id,
        otp: otpFormValue.otp
      }
      this.userService.verifyOtp(data).subscribe({
        next: (res: any) => {
          console.log(res);
          if(res.success){
            this.otpForm.reset()
            this.router.navigate(['login']);
          }else{
            // this.callAlert("alert alert-danger", "Login Failed", res.message)
this.alertService.getAlert("alert alert-danger", "Login Failed", res.message)

            this.router.navigateByUrl(`/otp/${this.id}`)
          }
        },
        error: (error) => {
          console.log(error);
          // this.callAlert("alert alert-danger", "Login Failed", error.message)
this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)

        }
      })
    })
  }

  backToLogin() {
    this.router.navigate(['login']);
  }

  resendOtp(){
    this.activatedRoute.params.subscribe((params)=>{
      this.id=params['id']
    })
    console.log('id to reset password: ',this.id);
    
    this.userService.resendOtp(this.id).subscribe({
      next:(res:any)=>{
        if(res.success){
          this.startTimer()
         this.isOtpExpired=false
        }else{
          // this.callAlert("alert alert-danger", "Login Failed", res.message)
this.alertService.getAlert("alert alert-danger", "Login Failed", res.message)

        }
      },
      error:(error)=>{
        // this.callAlert("alert alert-danger", "Login Failed", error.message)
this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)

      }
    })
  }

}
