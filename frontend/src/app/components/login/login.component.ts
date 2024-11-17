import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { loginData, registerData, response } from '../../model/model';
import { UserSrerviceService } from '../../services/user-srervice.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('modal') modal!: ElementRef


  registrationData!: registerData;
  loginData!: loginData;

  isRole: boolean = false
  isLogin: boolean = false
  isLoginForm: boolean = true
  userRole: string = ''
  isSendEmail: boolean = false

  class: string = ''
  message: string = ''
  alert: boolean = false
  text: string = ''

  userService = inject(UserSrerviceService)
  router = inject(Router)


  ngAfterViewInit(): void {
    if ((window as any).google) {

      (window as any).google.accounts.id.initialize({
        client_id: "464375724320-2aug4rpcgj3qv8rnjraa0uu3ikjjbuqt.apps.googleusercontent.com",
        callback: (res: any) => this.handleGoogleResponse(res)
      })
      console.log('script true');

      (window as any).google.accounts.id.renderButton(document.getElementById("googleButton"), {
        type: 'standard',
        theme: 'filled_black',
        size: 'medium',
        text: 'continue_with',
        shape: 'pill',
        width: '320'
      })
    }
  }

  ngOnInit(): void {

  }

  handleGoogleResponse(response: any) {
    //  console.log(response.credential);
    const token = response.credential
    // JWT is "header.payload.signature"
    const tokenDecode = JSON.parse(atob(token.split('.')[1]))
    console.log('tokenDecode', tokenDecode);
    const data = {
      name: tokenDecode.name,
      email: tokenDecode.email,
      googleId: tokenDecode.sub
    }

    this.userService.userLogin(data).subscribe({
      next: (res: any) => {

        console.log(res);
        if (res.success === true) {
          // this.router.navigateByUrl('/dashboard')
          this.userService.setUser(res.userData)
          this.router.navigate(['dashboard']);
        } else {
          this.callAlert("alert alert-danger", "Login Failed", res.message)
        }

        // console.log('login success', res);
        // this.router.navigateByUrl('dashboard')
      },
      error: (error) => {
        console.log(error.message);

      }
    })

  }

  userRegistrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
    role: new FormControl('')
  })

  userLoginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('')
  })

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required)
  })
  

  callAlert(classValue: string, text: string, message: string) {
    this.alert = true
    this.class = classValue
    this.text = text
    this.message = message
    setTimeout(() => {
      this.alert = false
    }, 2000)
  }

  login() {
    this.userLoginForm.get('role')?.setValue(this.userRole)
    this.loginData = this.userLoginForm.value
    console.log(this.loginData);
    this.userService.userLogin(this.loginData).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.success === true) {
          // this.router.navigateByUrl(`/otp/${res.userData.id}`)
          this.router.navigateByUrl('dashboard')
          this.userService.setUser(res.userData)
        } else {
          this.callAlert("alert alert-danger", "Login Failed", res.message)
        }
      },
      error: (error) => {
        this.callAlert("alert alert-danger", "Login Failed", error.message)
      }
    }
    )
    // console.log('from service: ', this.userService.getUser());
    this.userLoginForm.reset()
  }

  register() {
    this.userRegistrationForm.get('role')?.setValue(this.userRole)
    this.registrationData = this.userRegistrationForm.value
    // console.log(this.userRegistrationForm);
    this.userService.registerUser(this.registrationData).subscribe({
      next:(res: any) => {
        console.log(res);
        if (res.success) {
          this.callAlert("alert alert-success", "Success!", res.message)
          this.isLoginForm = true
        } else {
          this.callAlert("alert alert-danger", "Failed!", res.message)
        }
        this.userRegistrationForm.reset()
  
      },
      error:(error)=>{
        this.callAlert("alert alert-danger", "Register User Failed", error.message)
      }
    })
  }

  getSendMail() {
    const emailData = this.emailForm.value
    console.log(emailData);

    this.userService.sendEmail(emailData).subscribe({
      next:(res: any) => {
        console.log('send mail response: ', res);
        if (res.success) {
          this.callAlert('alert alert-success', 'Email sent', res.message)
        } else {
          this.callAlert('alert alert-danger', 'Sendin email failed', res.message)
        }
        this.emailForm.reset()
  
      },
      error:(error:any)=>{
        this.callAlert("alert alert-danger", "Sending email Failed", error.message)

      }
    })
  }

  cancelLogin(){
    this.userLoginForm.reset()
  }

  reload(){
    // this.router.navigateByUrl('login',{skipLocationChange:true}).then(()=>{
    //   this.router.navigate([this.router.url])
    // })

    document.location.href='/login'
  }

}
