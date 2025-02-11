import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IResponse } from '../../model/interface/interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, FormComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnDestroy{

  destroy$:Subject<void>= new Subject<void>()

  activeRoute = inject(ActivatedRoute)
  userServices = inject(UserSrerviceService)
  router = inject(Router)
  alertService = inject(AlertService)

  verifyEmailForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    }
  )

  verifyEmail() {
    debugger
    this.userServices.verifyUserEmail(this.verifyEmailForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('verify email response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')

          this.router.navigateByUrl(`/otp/${res.body?.data._id}`)
        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }
        this.verifyEmailForm.reset()

      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert('alert alert-danger', 'Failed!',  error.error.message)

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
