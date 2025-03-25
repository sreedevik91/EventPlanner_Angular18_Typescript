import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/bookingService/booking.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IAdminBookingData, IBooking, IPaymentList, IResponse } from '../../model/interface/interface';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js'

Chart.register(...registerables)

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe,CurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  bookingService = inject(BookingService)

  destroy$: Subject<void> = new Subject<void>()

  adminBookingsList = signal<(Partial<IAdminBookingData>[])>([])
  adminPaymentList = signal<IPaymentList[]>([])

  oldBookingsCount = signal<number>(0)
  totalRevenue = signal<number>(0)
  upcomingBookingsCount = signal<number>(0)
  totalBookings = signal<number>(0)

  labelsService = signal<string[]>([])
  amountService = signal<(number | null)[]>([])

  labelsEvent = signal<string[]>([])
  amountEvent = signal<(number | null)[]>([])

  serviceChart: Chart<keyof ChartTypeRegistry, (number | null)[], unknown> | null = null;
  eventChart: Chart<keyof ChartTypeRegistry, (number | null)[], unknown> | null = null;

  ngOnInit(): void {
    this.getAdminDashboardData()
    this.getAdminPaymentList()
    this.creatEventChart('Weekly')
    this.creatServiceChart('Weekly')
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

  getAdminPaymentList() {
    this.bookingService.getAdminPaymrntList().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('admin payment list response: ', res);

        if (res.status === HttpStatusCodes.SUCCESS) {
          this.adminPaymentList.set(res.body?.data)
        } else {
          console.log(res.body?.message);
        }

      },
      error: (error: HttpErrorResponse) => {

      }
    })
  }

  creatServiceChart(filter: string) {
    this.bookingService.getChartDataAdmin(filter).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('charts data response: ', res);
        this.labelsService.set(res.body?.data.servicesChartData.label)
        this.amountService.set(res.body?.data.servicesChartData.amount)
        if (this.serviceChart) this.serviceChart.destroy()
        const config: ChartConfiguration<'bar', (number | null)[], unknown> = {
          type: 'bar',
          data: {
            labels: this.labelsService(),
            datasets: [{
              label: filter,
              data: this.amountService(),
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        }
        this.serviceChart = new Chart('myChartService', config);

      },
      error: (error: HttpErrorResponse) => {
        console.log('charts data error: ', error);

      }
    })

  }

  creatEventChart(filter: string) {
    this.bookingService.getChartDataAdmin(filter).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('charts data response: ', res);
        this.labelsEvent.set(res.body?.data.eventsChartData.label)
        this.amountEvent.set(res.body?.data.eventsChartData.amount)
        if (this.eventChart) this.eventChart.destroy()
        const config: ChartConfiguration<'bar', (number | null)[], unknown> = {
          type: 'bar',
          data: {
            labels: this.labelsEvent(),
            datasets: [{
              label: filter,
              data: this.amountEvent(),
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        }
        this.eventChart = new Chart('myChartEvents', config);

      },
      error: (error: HttpErrorResponse) => {
        console.log('charts data error: ', error);

      }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
