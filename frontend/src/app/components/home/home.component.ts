import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loginData, registerData } from '../../model/model';
import { UserSrerviceService } from '../../services/user-srervice.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  allUsers:any=[]
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next:(res:any)=>{
        console.log('all users: ', res);
        
        this.allUsers=res.data
      },
      error:(error:any)=>{
console.log(error.message);

      }
    })
  }

  @ViewChild('modal') modal!: ElementRef;

  registrationData!: registerData;
  loginData!: loginData;

count:string=''

 generateCount(n:number){
  
while(n>=0){
  setTimeout(()=>{
    this.count=`${n}`
  },1000)
}
 }

  isRole: boolean = false
  isLogin: boolean = false
  isLoginForm: boolean = true
  userRole: string = ''
  userService = inject(UserSrerviceService)

  userRegistrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
    role:new FormControl('')
  })

  userLoginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('')
  })

  showPopup() {
    this.modal.nativeElement.style.display = 'block'
  }

  hidePopup() {
    this.userRole=''
    this.isRole=false
    this.modal.nativeElement.style.display = 'none'
  }

  login() {
    this.userLoginForm.get('role')?.setValue(this.userRole)
    this.loginData = this.userLoginForm.value
    console.log(this.loginData);
    this.hidePopup()
    this.userLoginForm.reset()
  }

  register() {
    this.userRegistrationForm.get('role')?.setValue(this.userRole)
    this.registrationData = this.userRegistrationForm.value
    console.log(this.userRegistrationForm);
    this.userService.registerUser(this.registrationData).subscribe(() => {
    alert('user registered successfully')
    this.isLoginForm=true
    })
    this.userRegistrationForm.reset()
  }


}
