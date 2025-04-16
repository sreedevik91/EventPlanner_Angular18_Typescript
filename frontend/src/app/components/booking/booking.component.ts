import { Component, OnDestroy } from '@angular/core';
import { ILoggedUserData } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AdminBookingComponent } from "../admin-booking/admin-booking.component";
import { UserBookingComponent } from "../user-booking/user-booking.component";
import { Subject } from 'rxjs';
import { ProviderBookingComponent } from '../provider-booking/provider-booking.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [AdminBookingComponent, UserBookingComponent,ProviderBookingComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export default class BookingComponent implements OnDestroy{

  destroy$:Subject<void>= new Subject<void>()

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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
