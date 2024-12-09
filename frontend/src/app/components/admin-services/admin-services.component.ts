import { Component, inject, signal } from '@angular/core';
import { Service, ServiceSearchFilter } from '../../model/class/serviceClass';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../services/serviceService/service.service';
import { HttpParams } from '@angular/common/http';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { AlertService } from '../../services/alertService/alert.service';
import { IService } from '../../model/interface/interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonComponent,AlertComponent],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent {
  serviceFromObj: Service = new Service()
  searchFilterFormObj: ServiceSearchFilter = new ServiceSearchFilter()

  searchFilterForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  serviceService = inject(ServiceService)
  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)

  currentPage: number = Number(this.searchFilterFormObj.pageNumber)
  totalServices: number = 0
  services = signal<IService[]>([])

  constructor() {
    this.getTotalServices()
    this.initialiseSearchFilterForm()
  }
  ngOnInit(): void {
    this.userService.loggedUser$.subscribe((user: any) => {
    

    })
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllServices(this.searchParams)
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      serviceName: new FormControl(this.searchFilterFormObj.serviceName),
      provider: new FormControl(this.searchFilterFormObj.provider),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder),
    })
  }


  getTotalServices() {
    this.serviceService.getTotalServices().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.totalServices = res.body.data
        } else {
          console.log(res.body.message);
          // this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: any) => {
        // this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })
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
    this.searchParams.set('sortBy', value)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)
    this.getAllServices(this.searchParams)

  }

  getAllServices(params: HttpParams) {
    this.serviceService.getAllServices(params).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.services.set(res.body.data)
          console.log('total services: ', this.services());
        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)
        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)
      }
    })
  }

  approveService(id: string) {
    this.serviceService.approveService(id).subscribe({
      next: (res: any) => {
        console.log('verify user response: ', res);
        if (res.status===200) {
          this.getAllServices(this.searchParams)

          this.alertService.getAlert('alert alert-success', 'Success!', res.message)

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }

      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  

  deleteService(id: string) {
    this.serviceService.deleteService(id).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body.message)
          this.getAllServices(this.searchParams)
        } else {
          console.log(res.body.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: any) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

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


}
