import { Component, inject, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { UserServicesComponent } from '../user-services/user-services.component';
import { AdminServicesComponent } from '../admin-services/admin-services.component';
import { ProviderServicesComponent } from '../provider-services/provider-services.component';

@Component({
  selector: 'app-event-services',
  standalone: true,
  imports: [UserServicesComponent,AdminServicesComponent,ProviderServicesComponent],
  templateUrl: './event-services.component.html',
  styleUrl: './event-services.component.css'
})
export class EventServicesComponent implements OnInit {

  role: string = ''

  userService = inject(UserSrerviceService)

  ngOnInit(): void {
    this.userService.loggedUser$.subscribe((user) => {
      console.log('logged user:', user);
      
      this.role = user?.role!
    })
  }

}
