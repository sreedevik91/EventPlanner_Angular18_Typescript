import { Component } from '@angular/core';
import { UserSrerviceService } from '../../services/user-srervice.service';
import { loggedUserData } from '../../model/model';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { ProviderDashboardComponent } from '../provider-dashboard/provider-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent,UserDashboardComponent,ProviderDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
user!:loggedUserData
role:string=''

constructor(private userService:UserSrerviceService){
this.user=userService.getUser()
this.role=this.user.role
}
}
