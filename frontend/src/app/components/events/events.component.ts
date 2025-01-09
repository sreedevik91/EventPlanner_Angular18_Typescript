import { Component, OnInit } from '@angular/core';
import { AdminEventsComponent } from '../admin-events/admin-events.component';
import { UserEventsComponent } from '../user-events/user-events.component';
import { ILoggedUserData, IResponse } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [AdminEventsComponent, UserEventsComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {

  user!: ILoggedUserData
  role: string = ''

  constructor(private userService: UserSrerviceService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.userService.loggedUser$.subscribe({
      next: (user: ILoggedUserData | null) => {
        if (user) {
          this.role = user?.role
          this.user = user
        }
      },
      error: (error: any) => {
        this.alertService.getAlert("alert alert-danger", "Failed", error.message)
      }
    })
  }

}
