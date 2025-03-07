import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PasswordMatchValidator } from '../../shared/validators/formValidator';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IResponse } from '../../model/interface/interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [AlertComponent, ReactiveFormsModule, FormComponent],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export default class ResetComponent implements OnInit, OnDestroy {

  // class: string = ''
  // message: string = ''
  // alert: boolean = false
  // text: string = ''

  destroy$: Subject<void> = new Subject<void>()

  token: string | null = null
  userId: string = ''

  activeRoute = inject(ActivatedRoute)
  userServices = inject(UserSrerviceService)
  alertService = inject(AlertService)
  router = inject(Router)

  ngOnInit(): void {
    this.activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.token = value['token']
      console.log(this.token);

    })

    // this.activeRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((value)=>{
    //   this.token=value.get('token')
    //   console.log(this.token);

    // })
  }

  // callAlert(classValue: string, text: string, message: string) {
  //   this.alert = true
  //   this.class = classValue
  //   this.text = text
  //   this.message = message
  //   setTimeout(() => {
  //     this.alert = false
  //   }, 2000)
  // }

  resetForm: FormGroup = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, PasswordMatchValidator])
    },
    // { validators: PasswordMatchValidator }
  )

  resetPassword() {
    // console.log(this.activeRoute.snapshot.params['token'])
    debugger
    let resetData = this.resetForm.value
    // resetData.token=this.token
    const data = {
      password: resetData.password,
      token: this.token
    }
    // console.log('resetData: ', resetData, data);
    debugger
    this.userServices.resetPassword(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('resetPassword res: ', res.body);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.callAlert('alert alert-success', 'Password Reset Success', res.message)
          this.alertService.getAlert('alert alert-success', 'Password Reset Success', res.body?.message || '')

        } else {
          // this.callAlert('alert alert-danger', 'Password Reset failed', res.message)
          this.alertService.getAlert('alert alert-danger', 'Password Reset failed', res.body?.message || '')

        }
        setTimeout(() => {

          this.router.navigateByUrl('login')

        }, 1500)
        this.resetForm.reset()
      },
      error: (err: HttpErrorResponse) => {
        // this.callAlert('alert alert-danger', 'Password Reset failed', err.message)
        this.alertService.getAlert('alert alert-danger', 'Password Reset failed', err.error.message)

      }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}


