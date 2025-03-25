import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertService } from '../../services/alertService/alert.service';
import { BookingService } from '../../services/bookingService/booking.service';
import { HttpStatusCodes, IBooking, ILoggedUserData, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { Subject, takeUntil } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { BookingSearchFilter } from '../../model/class/bookingClass';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-booking',
  standalone: true,
  imports: [DatePipe, ButtonComponent, AlertComponent],
  templateUrl: './user-booking.component.html',
  styleUrl: './user-booking.component.css'
})
export class UserBookingComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  bookingsList = signal<IBooking[]>([])

  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)
  bookingService = inject(BookingService)

  bookingPaginationFormObj: BookingSearchFilter = new BookingSearchFilter()
  paginationParams: HttpParams = new HttpParams()
  currentPage: number = Number(this.bookingPaginationFormObj.pageNumber)
  totalBooking=signal<number>(0)

  userId: string = ''
  userName: string = ''

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.id
        this.userName = user.user
      } else {
        console.log('No logged user data found');
      }
    })
    
    this.paginationParams=this.paginationParams.set('userName', this.userName)
      .set('pageNumber', this.bookingPaginationFormObj.pageNumber)
      .set('pageSize', this.bookingPaginationFormObj.pageSize)
      .set('isConfirmed', 'true')
    this.getBookingsByUser(this.paginationParams)
    // this.getBookingsByUser(this.userId)
  }

  getBookingsByUser(params: HttpParams) {
    // debugger
    this.bookingService.getAllBookings(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        // console.log('bookings by user from user component:', res);

        if (res.status === HttpStatusCodes.SUCCESS) {
          this.bookingsList.set(res.body?.data.bookings)
          console.log('confirmed bookings: ',this.bookingsList);
          // this.bookingsList.update(bookings=>bookings.filter(booking=>booking.isConfirmed===true))
          this.totalBooking.set(res.body?.data.count)
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Failed to fetch Booking Data", error.error.message)

      }
    })
  }

  // getBookingsByUser(userId: string) {
  //   // debugger
  //   this.bookingService.getBookingsByUserId(userId).pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (res: HttpResponse<IResponse>) => {
  //       if (res.status === HttpStatusCodes.SUCCESS) {
  //         this.bookingsList.set(res.body?.data)
  //         console.log('confirmed bookings: ',this.bookingsList);
  //         this.bookingsList.update(bookings=>bookings.filter(booking=>booking.isConfirmed===true))

  //       } else {
  //         console.log(res.body?.message);
  //         this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
  //       }
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

  //     }
  //   })
  // }

  deleteBooking(bookingId: string) {
    // if (confirm('Do you want to delete the booking ?')) {
    this.bookingService.deleteBooking(bookingId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(res.body);
          // this.getBookingsByUser(this.userId)
          this.bookingsList.update(bookings =>
            bookings.filter(booking => booking._id !== bookingId)
          )
          this.totalBooking.update(count=>count-1)
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
    // }
  }

  deleteChoice(bookingId: string, name: string, id: string) {
    // if (confirm('Do you want to delete the service ?')) {
    this.bookingService.deleteBookedServices(bookingId, name, id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(res.body);
          // this.getBookingsByUser(this.userId)
          this.bookingsList.update(bookings =>
            // flatMap - Handles both updating services and potential booking removal
            bookings.flatMap(booking => {
              // First filter the services
              let filteredService = booking.services.filter(service => service._id !== id)
              // Check if any services remain
              if (filteredService.length > 0) {
                // Return updated booking with filtered services
                return { ...booking, services: filteredService }
              }
              // Return empty array to remove the booking completely
              return []
            }))
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
    // }
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.bookingPaginationFormObj.pageNumber = page.toString()
    this.paginationParams = this.paginationParams.set('pageNumber', this.bookingPaginationFormObj.pageNumber)
    this.getBookingsByUser(this.paginationParams)

  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalBooking() / Number(this.bookingPaginationFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    return Math.ceil(this.totalBooking() / Number(this.bookingPaginationFormObj.pageSize))
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
