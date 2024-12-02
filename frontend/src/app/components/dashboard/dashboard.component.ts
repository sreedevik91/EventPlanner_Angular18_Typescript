import { Component } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ILoggedUserData } from '../../model/interface/interface';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { ProviderDashboardComponent } from '../provider-dashboard/provider-dashboard.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent, UserDashboardComponent, ProviderDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user!: ILoggedUserData
  role: string = ''

  constructor(private userService: UserSrerviceService) {
    this.userService.loggedUser$.subscribe((user)=>{
      if(user){
      this.user =user
      this.role = user.role
      }
    })
  }
}
