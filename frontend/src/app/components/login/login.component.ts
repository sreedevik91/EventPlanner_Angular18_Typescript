import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ILoggedUserData, ILoginData, IRegisterData, IResponse } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PasswordMatchValidator } from '../../shared/validators/formValidator';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, FormComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

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
    // debugger
    this.userLoginForm.get('role')?.setValue(this.userRole)
    this.loginData = this.userLoginForm.value
    // console.log(this.loginData);

    this.userService.userLogin(this.loginData).subscribe({
      next: (res: any) => {
        // debugger
        console.log(res);
        console.log(res.body);
        // console.log(res.body.emailVerified);
        if (res.body.emailVerified) {
          if (res.status === 200) {
            console.log(this.router);
            
            this.router.navigateByUrl('dashboard')
            this.userService.setLoggedUser(res.body.data)

          } else {
            // this.callAlert("alert alert-danger", "Login Failed", res.message)
            this.alertService.getAlert("alert alert-danger", "Login Failed", res.body.message)

          }
        } else {
          // debugger
          // this.callAlert("alert alert-danger", "Login Failed!", res.message)
          this.alertService.getAlert("alert alert-danger", "Login Failed!", res.message)

          this.router.navigateByUrl(`verifyEmail`)
        }

      },
      error: (error) => {
        // this.callAlert("alert alert-danger", "Login Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Login Failed", error.message)

      }
    }
    )

    this.userService.loggedUser$.subscribe((res) => {
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
    this.userService.registerUser(this.registrationData).subscribe({
      next: (res: any) => {
        console.log('response from register user: ', res);
        if (res.success) {
          // this.callAlert("alert alert-success", "Success!", res.message)
          this.alertService.getAlert("alert alert-success", "Success!", res.message)
          this.router.navigateByUrl(`/otp/${res.data._id}`)
          // this.isLoginForm = true
        } else {
          // this.callAlert("alert alert-danger", "Failed!", res.message)
          this.alertService.getAlert("alert alert-danger", "Failed!", res.message)

        }
        this.userRegistrationForm.reset()

      },
      error: (error) => {
        // this.callAlert("alert alert-danger", "Register User Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })
  }

  getSendMail() {
    const emailData = this.emailForm.value
    console.log(emailData);

    this.userService.sendResetEmail(emailData).subscribe({
      next: (res: any) => {
        console.log('send mail response: ', res);
        if (res.success) {
          // this.callAlert('alert alert-success', 'Email sent', res.message)
          this.alertService.getAlert('alert alert-success', 'Email sent', res.message)

        } else {
          // this.callAlert('alert alert-danger', 'Sent email failed', res.message)
          this.alertService.getAlert('alert alert-danger', 'Sent email failed', res.message)

        }
        this.emailForm.reset()

      },
      error: (error: any) => {
        // this.callAlert("alert alert-danger", "Sent email Failed", error.message)
        this.alertService.getAlert("alert alert-danger", "Sent email Failed", error.message)


      }
    })
  }

  cancelLogin() {
    this.userLoginForm.reset()
  }

  reload() {
    document.location.href = '/login'
  }

}
