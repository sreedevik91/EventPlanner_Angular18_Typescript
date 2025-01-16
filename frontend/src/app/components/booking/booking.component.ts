import { Component } from '@angular/core';
import { ILoggedUserData } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AdminBookingComponent } from "../admin-booking/admin-booking.component";
import { UserBookingComponent } from "../user-booking/user-booking.component";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [AdminBookingComponent, UserBookingComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  user!: ILoggedUserData
  role: string = ''

  constructor(private userService: UserSrerviceService) {}
  
  ngOnInit(): void {
    this.userService.loggedUser$.subscribe((user)=>{
      if(user){
      this.user =user
      this.role = user.role
      }
    })
  }
}
