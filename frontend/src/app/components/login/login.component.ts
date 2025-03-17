import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpStatusCodes, ILoggedUserData, ILoginData, IRegisterData, IResponse } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PasswordMatchValidator } from '../../shared/validators/formValidator';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, FormComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnDestroy{

  destroy$:Subject<void>= new Subject<void>()

  @ViewChild('modal') modal!: ElementRef

  registrationData!: IRegisterData;
  loginData!: ILoginData;

  isRole: boolean = false
  isLogin: boolean = false
  isLoginForm: boolean = true
  userRole: string = ''
  isSendEmail: boolean = false

  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)
  router = inject(Router)

  userRegistrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, PasswordMatchValidator]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
    role: new FormControl('')
  })

  userLoginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('')
  })

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')])
  })

  googleSignin() {
    this.userService.googleSignin()
  }

  login() {
    debugger
    console.log(environment.apiUserUrl);

    this.userLoginForm.get('role')?.setValue(this.userRole)
    this.loginData = this.userLoginForm.value
    console.log(environment.apiUserUrl);

    this.userService.userLogin(this.loginData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        // debugger
        console.log(res);
        console.log(res.body);
        // console.log(res.body.emailVerified);
        // if (res.body.emailVerified) {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(this.router);

          this.router.navigateByUrl('dashboard')
          this.userService.setLoggedUser(res.body?.data)

        } else {
          console.log(res.body?.message);

          this.alertService.getAlert("alert alert-danger", "Login Failed", res.body?.message ? res.body?.message : '')

        }
        // else if (res.status === 400) {
        //   if (res.body.emailNotVerified) {
        //     this.alertService.getAlert("alert alert-danger", "Login Failed!", res.body.message)
        //     this.router.navigateByUrl(`verifyEmail`)
        //   } else {
        //     this.alertService.getAlert("alert alert-danger", "Login Failed", res.body.message)
        //   }

        // } else if (res.status === 403) {
        //   this.userService.userLogout().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
        //     this.router.navigateByUrl('login')
        //   })
        //   this.alertService.getAlert("alert alert-danger", "Login Failed", res.body.message)

        // }
        // } else {
        //   this.alertService.getAlert("alert alert-danger", "Login Failed!", res.body.message)

        //   this.router.navigateByUrl(`verifyEmail`)
        // }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === HttpStatusCodes.BAD_REQUEST) {
          if (error.error.emailNotVerified) {
            this.alertService.getAlert("alert alert-danger", "Login Failed!", error.error.message)
            this.router.navigateByUrl(`verifyEmail`)
          } else {
            this.alertService.getAlert("alert alert-danger", "Login Failed", error.error.message)
          } 

        } else if (error.status === HttpStatusCodes.FORBIDDEN) {
          this.router.navigateByUrl('login')
          this.alertService.getAlert("alert alert-danger", "Login Failed", error.error.message)

        }
        else {
          this.alertService.getAlert("alert alert-danger", "Login Failed", error.error.message)
    console.log(environment.apiUserUrl);
         
          console.log('login error:', error.error.message, error,error.message);

        }

      }
    }
    )

    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('from behavioral subject: ', res);
      }
    })

    this.userLoginForm.reset()
  }

  register() {
    // debugger
    this.userRegistrationForm.get('role')?.setValue(this.userRole)
    const { confirmPassword, ...rest } = this.userRegistrationForm.value
    this.registrationData = rest
    console.log(this.registrationData);
    this.userService.registerUser(this.registrationData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('response from register user: ', res);
        if (res.status === HttpStatusCodes.CREATED) {
          // this.callAlert("alert alert-success", "Success!", res.message)
          this.alertService.getAlert("alert alert-success", "Success!", res.body?.message ? res.body?.message : '')
          this.router.navigateByUrl(`/otp/${res.body?.data._id}`)
          // this.isLoginForm = true
        } else {
          // this.callAlert("alert alert-danger", "Failed!", res.message)
          this.alertService.getAlert("alert alert-danger", "Failed!", res.body?.message!)

        }
        this.userRegistrationForm.reset()

      },
      error: (error: HttpErrorResponse) => {
        // this.callAlert("alert alert-danger", "Register User Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  getSendMail() {
    const emailData = this.emailForm.value
    console.log(emailData);

    this.userService.sendResetEmail(emailData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('send mail response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.callAlert('alert alert-success', 'Email sent', res.message)
          this.alertService.getAlert('alert alert-success', 'Email sent', res.body?.message ? res.body?.message : '')

        } else {
          // this.callAlert('alert alert-danger', 'Sent email failed', res.message)
          this.alertService.getAlert('alert alert-danger', 'Sent email failed', res.body?.message ? res.body?.message : '')

        }
        this.emailForm.reset()

      },
      error: (error: HttpErrorResponse) => {
        // this.callAlert("alert alert-danger", "Sent email Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Sent email Failed", error.error.message)


      }
    })
  }

  cancelLogin() {
    this.userLoginForm.reset()
  }

  reload() {
    document.location.href = '/login'
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
