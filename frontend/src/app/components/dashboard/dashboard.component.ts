import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ILoggedUserData } from '../../model/interface/interface';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { ProviderDashboardComponent } from '../provider-dashboard/provider-dashboard.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent, UserDashboardComponent, ProviderDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit, OnDestroy{

  destroy$:Subject<void>=new Subject<void>()

  user!: ILoggedUserData
  role: string = ''

  constructor(private userService: UserSrerviceService) {}
    
  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user)=>{
      if(user){
      this.user =user
      this.role = user.role
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
