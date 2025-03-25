import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IResponse, ISales } from '../../model/interface/interface';
import { providerSalesSearchFilter } from '../../model/class/salesClass';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { BookingService } from '../../services/bookingService/booking.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';

@Component({
  selector: 'app-provider-sales',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './provider-sales.component.html',
  styleUrl: './provider-sales.component.css'
})
export class ProviderSalesComponent implements OnInit, OnDestroy {


  destroy$: Subject<void> = new Subject<void>()

  @ViewChild('modal') formModal!: ElementRef

  searchFilterForm: FormGroup = new FormGroup({})

  serviceSales = signal<ISales[]>([])

  searchFilterFormObj: providerSalesSearchFilter = new providerSalesSearchFilter()

  searchParams = new HttpParams()
  currentPageService: number = Number(this.searchFilterFormObj.pageNumberService)
  totalServiceSales: number = 0

  bookingService = inject(BookingService)
  userService= inject(UserSrerviceService)

  providerId: string = ''
  constructor() { }

  ngOnInit() {
    this.userService.loggedUser$.subscribe((user)=>{
      if(user){
      this.providerId =user.id
      }
    })
    this.onRefresh()
    this.initialiseSearchFilterForm()
    // this.getSalesData(this.searchParams)
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      providerId: new FormControl(this.searchFilterFormObj.providerId),
      pageNumberService: new FormControl(this.searchFilterFormObj.pageNumberService),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortByService: new FormControl(this.searchFilterFormObj.sortByService),
      sortOrderService: new FormControl(this.searchFilterFormObj.sortOrderService),
      startDate: new FormControl(this.searchFilterFormObj.startDate),
      endDate: new FormControl(this.searchFilterFormObj.endDate),
      filterBy: new FormControl(this.searchFilterFormObj.filterBy)
    })
  }

  getSalesData(params: HttpParams) {
    this.bookingService.getProviderSales(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('get sales response: ', res);
        this.serviceSales.set(res.body?.data.servicesSales)
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
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('providerId', this.providerId)
    this.getSalesData(this.searchParams)
  }

  onSortService(value: string) {
    this.searchParams = this.searchParams.set('sortByService', value)
    this.searchFilterFormObj.sortOrderService = this.searchFilterFormObj.sortOrderService === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortOrderService', this.searchFilterFormObj.sortOrderService)
    this.getSalesData(this.searchParams)
  }

  onSearch() {
    // debugger
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumberService', this.searchFilterFormObj.pageNumberService)
      .set('pageSize', this.searchFilterFormObj.pageSize)
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
