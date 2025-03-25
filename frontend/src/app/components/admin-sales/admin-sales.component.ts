import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IBooking, IResponse, ISales } from '../../model/interface/interface';
import { salesForm, salesSearchFilter } from '../../model/class/salesClass';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BookingService } from '../../services/bookingService/booking.service';

@Component({
  selector: 'app-admin-sales',
  standalone: true,
  imports: [AlertComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './admin-sales.component.html',
  styleUrl: './admin-sales.component.css'
})
export class AdminSalesComponent implements OnInit,OnDestroy{

  destroy$: Subject<void> = new Subject<void>()

  @ViewChild('modal') formModal!: ElementRef

  searchFilterForm: FormGroup = new FormGroup({})
  salesForm: FormGroup = new FormGroup({})

  eventsSales = signal<ISales[]>([])
  serviceSales = signal<ISales[]>([])

  searchFilterFormObj: salesSearchFilter = new salesSearchFilter()
  salesFormObj: salesForm = new salesForm()

  searchParams = new HttpParams()
  currentPageEvent: number = Number(this.searchFilterFormObj.pageNumberEvent)
  currentPageService: number = Number(this.searchFilterFormObj.pageNumberService)
  totalEventSales: number = 0
  totalServiceSales: number = 0

  bookingService = inject(BookingService)

  constructor() { }

  ngOnInit() {
    this.onRefresh()
    this.initialiseSearchFilterForm()
    this.getSalesData(this.searchParams)
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      pageNumberService: new FormControl(this.searchFilterFormObj.pageNumberService),
      pageNumberEvent: new FormControl(this.searchFilterFormObj.pageNumberEvent),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortByService: new FormControl(this.searchFilterFormObj.sortByService),
      sortOrderService: new FormControl(this.searchFilterFormObj.sortOrderService),
      sortByEvent: new FormControl(this.searchFilterFormObj.sortByEvent),
      sortOrderEvent: new FormControl(this.searchFilterFormObj.sortOrderEvent),
      startDate: new FormControl(this.searchFilterFormObj.startDate),
      endDate: new FormControl(this.searchFilterFormObj.endDate),
      filterBy: new FormControl(this.searchFilterFormObj.filterBy)
    })
  }

  initialiseSalesForm() {
    this.salesForm = new FormGroup({
      startDate: new FormControl(this.salesFormObj.startDate),
      endDate: new FormControl(this.salesFormObj.endDate),
      filterBy: new FormControl(this.salesFormObj.filterBy)
    })
  }

  getSalesData(params: HttpParams) {
    this.bookingService.getSales(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('get sales response: ', res);
        this.eventsSales.set(res.body?.data.eventSales)
        this.serviceSales.set(res.body?.data.servicesSales)
        this.totalEventSales = res.body?.data.eventSalesCount
        this.totalServiceSales = res.body?.data.serviceSalesCount
      },
      error: (error: HttpErrorResponse) => {
        console.log('get sales error: ', error);
      }
    })
  }

  onRefresh() {
    this.searchParams = new HttpParams()
    this.searchParams = this.searchParams.set('pageNumberService', this.searchFilterFormObj.pageNumberService)
    this.searchParams = this.searchParams.set('pageNumberEvent', this.searchFilterFormObj.pageNumberEvent)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getSalesData(this.searchParams)
  }

  onSortService(value: string) {
    this.searchParams = this.searchParams.set('sortByService', value)
    this.searchFilterFormObj.sortOrderService = this.searchFilterFormObj.sortOrderService === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortOrderService', this.searchFilterFormObj.sortOrderService)
    this.getSalesData(this.searchParams)
  }

  onSortEvent(value: string) {
    this.searchParams = this.searchParams.set('sortByEvent', value)
    this.searchFilterFormObj.sortOrderEvent = this.searchFilterFormObj.sortOrderEvent === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortOrderEvent', this.searchFilterFormObj.sortOrderEvent)
    this.getSalesData(this.searchParams)
  }

  onSearch() {
    // debugger
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumberService', this.searchFilterFormObj.pageNumberService)
      .set('pageNumberEvent', this.searchFilterFormObj.pageNumberEvent)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('sortByEvent', this.searchFilterFormObj.sortByEvent)
      .set('sortOrderEvent', this.searchFilterFormObj.sortOrderEvent)
      .set('sortByService', this.searchFilterFormObj.sortByService)
      .set('sortOrderService', this.searchFilterFormObj.sortOrderService)
    this.getSalesData(this.searchParams)
  }

  getTotalPagesService() {
    console.log('total sale count from getTotalPagesService: ', this.totalServiceSales);
    let totalPages = Math.ceil(this.totalServiceSales / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpageService() {
    console.log('total sale count from getTotalPagesService: ', this.totalServiceSales);
    return Math.ceil(this.totalServiceSales / Number(this.searchFilterFormObj.pageSize))
  }

  onPageChangeService(page: number) {
    // debugger
    this.currentPageService = page
    this.searchFilterFormObj.pageNumberService = page.toString()
    this.searchParams = this.searchParams.set('pageNumberService', this.searchFilterFormObj.pageNumberService)
    console.log('pageNumberService: ', this.searchFilterFormObj.pageNumberService);
    this.getSalesData(this.searchParams)
  }

  getTotalPagesEvent() {
    console.log('total users count from getTotalPages: ', this.totalEventSales);
    let totalPages = Math.ceil(this.totalEventSales / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpageEvent() {
    console.log('total users count from getLastpage: ', this.totalEventSales);
    return Math.ceil(this.totalEventSales / Number(this.searchFilterFormObj.pageSize))
  }

  onPageChangeEvent(page: number) {
    // debugger
    this.currentPageEvent = page
    this.searchFilterFormObj.pageNumberEvent = page.toString()
    this.searchParams = this.searchParams.set('pageNumberEvent', this.searchFilterFormObj.pageNumberEvent)
    console.log('pageNumber: ', this.searchFilterFormObj.pageNumberEvent);
    this.getSalesData(this.searchParams)
  }

  getValues(event: Event, valueType: string) {
    console.log('getValues event: ', event, ', valueType: ', valueType);
    const inputElement = event.target as HTMLInputElement
    if (valueType === 'startDate') {
      this.searchParams = this.searchParams.set('startDate', inputElement.value)
    } else if (valueType === 'endDate') {
      this.searchParams = this.searchParams.set('endDate', inputElement.value)
    } else if (valueType === 'filterBy') {
      this.searchParams = this.searchParams.set('filterBy', inputElement.value)
    }
    this.getSalesData(this.searchParams)
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
  }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
}
