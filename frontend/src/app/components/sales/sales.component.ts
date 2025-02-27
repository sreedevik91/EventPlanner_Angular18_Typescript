import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ILoggedUserData, IResponse } from '../../model/interface/interface';
import { AdminSalesComponent } from "../admin-sales/admin-sales.component";
import { ProviderSalesComponent } from "../provider-sales/provider-sales.component";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [AdminSalesComponent, ProviderSalesComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export default class SalesComponent implements OnInit, OnDestroy {

  userService = inject(UserSrerviceService)

  destroy$: Subject<void> = new Subject<void>()
  role: string = ''

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: ILoggedUserData | null) => {
        if (user) this.role = user?.role
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
