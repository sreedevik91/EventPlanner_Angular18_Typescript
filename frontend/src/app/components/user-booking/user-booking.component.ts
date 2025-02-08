import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertService } from '../../services/alertService/alert.service';
import { BookingService } from '../../services/bookingService/booking.service';
import { HttpStatusCodes, IBooking, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-user-booking',
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  templateUrl: './user-booking.component.html',
  styleUrl: './user-booking.component.css'
})
export class UserBookingComponent implements OnInit {

  bookingsList = signal<IBooking[]>([])

  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)
  bookingService = inject(BookingService)

  userId: string = ''

  ngOnInit(): void {
    this.userService.loggedUser$.subscribe((user: any) => {
      this.userId = user.id
    })
    this.getBookingsByUser(this.userId)
  }

  getBookingsByUser(userId: string) {
    this.bookingService.getBookingsByUserId(userId).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {

          this.bookingsList.set(res.body?.data)
          console.log(this.bookingsList);

        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  deleteBooking(bookingId: string) {
    if (confirm('Do you want to delete the booking ?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: (res: HttpResponse<IResponse>) => {
          if (res.status === HttpStatusCodes.SUCCESS) {
            console.log(res.body);
            this.getBookingsByUser(this.userId)

          } else {
            console.log(res.body?.message);
            this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

        }
      })
    }
  }

  deleteChoice(bookingId: string, name: string, id: string) {
    if (confirm('Do you want to delete the service ?')) {
      this.bookingService.deleteBookedServices(bookingId, name, id).subscribe({
        next: (res: HttpResponse<IResponse>) => {
          if (res.status === HttpStatusCodes.SUCCESS) {
            console.log(res.body);
            this.getBookingsByUser(this.userId)

          } else {
            console.log(res.body?.message);
            this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

        }
      })
    }
  }

}
