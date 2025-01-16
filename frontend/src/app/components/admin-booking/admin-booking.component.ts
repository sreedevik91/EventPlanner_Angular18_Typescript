import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { AlertService } from '../../services/alertService/alert.service';
import { IBooking, IResponse, IService } from '../../model/interface/interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Booking, BookingSearchFilter } from '../../model/class/bookingClass';
import { BookingService } from '../../services/bookingService/booking.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-admin-booking',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, AlertComponent,DatePipe],
  templateUrl: './admin-booking.component.html',
  styleUrl: './admin-booking.component.css'
})
export class AdminBookingComponent implements OnInit {

  bookingFormObj: Booking = new Booking()
  bookingFilterFormObj: BookingSearchFilter = new BookingSearchFilter()

  searchFilterForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  bookingService = inject(BookingService)
  alertService = inject(AlertService)

  currentPage: number = Number(this.bookingFilterFormObj.pageNumber)
  totalBookings: number = 0
  bookings = signal<IBooking[]>([])

  errMessage: string = 'Some error occured'

  constructor() {
    this.getTotalBookings()
    this.initialiseSearchFilterForm()
  }
  ngOnInit(): void {
     this.searchParams = this.searchParams.set('pageNumber', this.bookingFilterFormObj.pageNumber)
      .set('pageSize', this.bookingFilterFormObj.pageSize)
    this.getAllBookings(this.searchParams)
    this.onRefresh()
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      userName: new FormControl(this.bookingFilterFormObj.userName),
      pageNumber: new FormControl(this.bookingFilterFormObj.pageNumber),
      pageSize: new FormControl(this.bookingFilterFormObj.pageSize),
      sortBy: new FormControl(this.bookingFilterFormObj.sortBy),
      sortOrder: new FormControl(this.bookingFilterFormObj.sortOrder),
      // isConfirmed:new FormControl(this.bookingFilterFormObj.isConfirmed),
    })
  }


  getTotalBookings() {
    this.bookingService.getTotalBookings().subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          this.totalBookings = res.body?.data
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  onRefresh() {
    this.searchParams = new HttpParams()
    this.searchFilterForm.get('userName')?.setValue('')
    this.searchFilterForm.get('isConfirmed')?.setValue('')
    this.searchParams = this.searchParams.set('pageNumber', this.bookingFilterFormObj.pageNumber)
      .set('pageSize', this.bookingFilterFormObj.pageSize)
    this.getAllBookings(this.searchParams)
  }

  onSearch() {
    console.log(this.searchFilterForm.value);
    this.bookingFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumber', this.bookingFilterFormObj.pageNumber)
      .set('pageSize', this.bookingFilterFormObj.pageSize)
      .set('sortBy', this.bookingFilterFormObj.sortBy)
      .set('sortOrder', this.bookingFilterFormObj.sortOrder)

    if (this.bookingFilterFormObj.userName !== '') {
      this.searchParams = this.searchParams.set('userName', this.bookingFilterFormObj.userName)
    }

    this.getAllBookings(this.searchParams)

  }

  onSort(value: string) {
    this.bookingFilterFormObj.sortOrder = this.bookingFilterFormObj.sortOrder === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortBy', value)
      .set('sortOrder', this.bookingFilterFormObj.sortOrder)
    console.log(this.searchParams);
    this.getAllBookings(this.searchParams)

  }

  getAllBookings(params: HttpParams) {
    this.bookingService.getAllBookings(params).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          // this.totalServices=res.body.data.length
          this.bookings.set(res.body?.data)
          console.log('all services: ', this.bookings());
          // this.searchParams = new HttpParams()
        } else {
          console.log('could not get users');
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }

  confirmBooking(id: string) {
    // debugger
    this.bookingService.editStatus(id).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('verify user response: ', res);
        if (res.status === 200) {
          this.getAllBookings(this.searchParams)
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : 'Service approved successfully')
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }


  deleteBooking(id: string) {
    this.bookingService.deleteBooking(id).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : 'Service deleted successfully')
          this.getAllBookings(this.searchParams)
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.bookingFilterFormObj.pageNumber = page.toString()
    this.searchParams = this.searchParams.set('pageNumber', this.bookingFilterFormObj.pageNumber)
    this.getAllBookings(this.searchParams)

  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalBookings / Number(this.bookingFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    return this.totalBookings / Number(this.bookingFilterFormObj.pageSize)
  }



}

