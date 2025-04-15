import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { AdminService, Service, ServiceSearchFilter } from '../../model/class/serviceClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../services/serviceService/service.service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpStatusCodes, IAdminService, IResponse, IService } from '../../model/interface/interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Subject, takeUntil } from 'rxjs';
import { FormComponent } from '../../shared/components/form/form.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, AlertComponent, FormComponent],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent implements OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  @ViewChild('modal') formModal!: ElementRef

  serviceFromObj: AdminService = new AdminService()
  searchFilterFormObj: ServiceSearchFilter = new ServiceSearchFilter()

  searchFilterForm: FormGroup = new FormGroup({})
  servicesForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  serviceService = inject(ServiceService)
  alertService = inject(AlertService)

  currentPage: number = Number(this.searchFilterFormObj.pageNumber)
  totalServices: number = 0
  services = signal<IService[]>([])
  adminServices = signal<string[]>([])
  extra: any = []

  errMessage: string = 'Some error occured'

  constructor() {
  }

  ngOnInit(): void {
    this.getTotalServices()
    this.initialiseSearchFilterForm()
    this.initialiseServicesForm()
    this.onRefresh()
    this.getAdminServices()
  }

  initialiseServicesForm() {
    this.servicesForm = new FormGroup({
      services: new FormArray([new FormControl(this.serviceFromObj.services)])
    })
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      serviceName: new FormControl(this.searchFilterFormObj.serviceName),
      provider: new FormControl(this.searchFilterFormObj.provider),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder)
    })
  }

  addServiceItem() {
    (<FormArray>this.servicesForm.get('services')).push(new FormControl(this.serviceFromObj.services))
  }

  getServicesItem() {
    return (<FormArray>this.servicesForm.get('services'))['controls']
  }

  deleteServiceItem(index: number) {
    let servicesArray = (<FormArray>this.servicesForm.get('services'))
    servicesArray.removeAt(index)
  }

  getTotalServices() {
    this.serviceService.getTotalServices().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.totalServices = res.body?.data
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
    this.searchFilterForm.get('serviceName')?.setValue('')
    this.searchFilterForm.get('provider')?.setValue('')
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllServices(this.searchParams)
  }

  onSearch() {
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('sortBy', this.searchFilterFormObj.sortBy)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)

    if (this.searchFilterFormObj.serviceName !== '') {
      this.searchParams = this.searchParams.set('serviceName', this.searchFilterFormObj.serviceName)
    }

    if (this.searchFilterFormObj.provider !== '') {
      this.searchParams = this.searchParams.set('provider', this.searchFilterFormObj.provider)
    }

    this.getAllServices(this.searchParams)

  }

  onSort(value: string) {
    this.searchFilterFormObj.sortOrder = this.searchFilterFormObj.sortOrder === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortBy', value)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)
    console.log(this.searchParams);
    this.getAllServices(this.searchParams)

  }

  getAllServices(params: HttpParams) {
    this.serviceService.getAllServices(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.services.set(res.body?.data.services)
          this.totalServices = res.body?.data.count
          console.log('all services new: ', res.body?.extra);
          this.extra = res.body?.extra

          console.log('all services: ', this.services());
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

  getAdminServices() {
    this.serviceService.getAdminServices().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.adminServices.set(res.body?.data)
          console.log('admin services new: ', res.body?.data);
        } else {
          console.log('could not get service');
          // this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        // this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }

  deleteAdminService(service:string){
    this.serviceService.deleteAdminServices(service).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.adminServices.set(res.body?.data)
          console.log('admin services after deletion: ', res.body?.data);
        } else {
          console.log('could not delete service');
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : this.errMessage)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }

  saveAdminService(){
    const serviceFormData=this.servicesForm.value
    console.log('admin services form value: ', serviceFormData);
    
    this.serviceService.saveAdminService(serviceFormData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('verify user response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.hideModal()
        this.adminServices.set(res.body?.data)
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : 'Service saved successfully')
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

  approveService(id: string) {
    // debugger
    this.serviceService.approveService(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('verify user response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.services.update(services =>
            services.map(service =>
              service._id === id ? { ...service, isApproved: !service.isApproved } : service
            )
          )
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

  deleteService(id: string) {
    this.serviceService.deleteService(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : 'Service deleted successfully')
          this.services.update(services =>
            services.filter(service => service._id !== id)
          )
          this.totalServices -= 1
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
    this.searchFilterFormObj.pageNumber = page.toString()
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
    this.getAllServices(this.searchParams)

  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalServices / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    return this.totalServices / Number(this.searchFilterFormObj.pageSize)
  }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
    // this.imgUrl = ''
    this.servicesForm.reset()
    this.serviceFromObj = new AdminService()
    this.initialiseServicesForm()
    // this.isAddEvent = true
    // this.eventServicesList.set([])
    // this.eventImgInput.nativeElement.value = ''
    // console.log('on closing the model eventForm value: ', this.eventForm.value);

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}


