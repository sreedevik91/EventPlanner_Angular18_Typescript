import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/bookingService/booking.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IAdminBookingData, IBooking, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  bookingService = inject(BookingService)

  destroy$: Subject<void> = new Subject<void>()

  adminBookingsList = signal<(Partial<IAdminBookingData>[])>([])

  oldBookingsCount = signal<number>(0)
  totalRevenue = signal<number>(0)
  upcomingBookingsCount = signal<number>(0)
  totalBookings = signal<number>(0)

  ngOnInit(): void {
    this.getAdminDashboardData()
  }

  getAdminDashboardData() {
    this.bookingService.getAdminBookingsData().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('getServicesByProvider response: ', res.body);
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('service booking response: ', res.body?.data);
          this.adminBookingsList.set(res.body?.data.bookingData)
          this.oldBookingsCount.set(res.body?.data.oldBookings)
          this.upcomingBookingsCount.set(res.body?.data.upcomingBookings)
          this.totalRevenue.set(res.body?.data.totalRevenue)
          this.totalBookings.set(res.body?.data.totalBooking)
          // console.log('service bookings list: ', this.adminBookingsList);
        } else {
          console.log(res.body?.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('getServicesByProvider error: ', error.error.message, error);

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
