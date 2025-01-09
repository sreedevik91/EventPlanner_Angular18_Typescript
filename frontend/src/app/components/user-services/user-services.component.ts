import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ServiceService } from '../../services/serviceService/service.service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { IResponse, IService } from '../../model/interface/interface';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { AlertService } from '../../services/alertService/alert.service';
import { IChoice } from '../../model/class/serviceClass';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataService/data.service';

@Component({
  selector: 'app-user-services',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './user-services.component.html',
  styleUrl: './user-services.component.css'
})
export class UserServicesComponent implements OnInit {

  @ViewChild('serviceModal') serviceModal!: ElementRef

  serviceServices = inject(ServiceService)
  alertService = inject(AlertService)
  dataService = inject(DataService)

  router=inject(Router)

  searchParams = new HttpParams()

  services = signal<IService[]>([])
  serviceByName = signal<any[]>([])

  servicesName: string = ''
  serviceEvents = new Set<string>()
  // serviceChoices=new Set<IChoice>()
  serviceChoicesDb: IChoice[] = []
  serviceChoices = new Set<string>()
  servicePrizeRange: string = ''

  serviceImgUrl=environment.serviceImgUrl
  serviceImg:string=''

  ngOnInit(): void {
    this.onLoad()
  }

  onLoad() {
    this.searchParams = this.searchParams.set('isApproved', true)
    this.getAllServices(this.searchParams)
  }

  getAllServices(params: HttpParams) {
    this.serviceServices.getAllServices(params).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          console.log('getAllServices response', res.body?.data);
          this.services.set(res.body?.data)
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message || '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  getService(name: string) {
    this.servicesName = name
    
    this.serviceServices.getServiceByName(name).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          console.log('getServiceByName response: ', res.body?.data);
          this.serviceByName.set(res.body?.data)
          this.serviceImg=res.body?.data[0].img[0]
          // this.showModal()
          // this.services.set(res.body?.extra)
          const extra=this.services().filter(e=>e.name===name)
          console.log('user service extra: ',extra);
          this.dataService.setServiceData(name,extra)
          // this.router.navigate(['services/details'],{queryParams:{data:JSON.stringify(extra),service:name}})
          this.router.navigate(['services/details'])
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message || '')
        }

      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed",  error.error.message)
        console.log('getServiceByName error: ', error.error.message);

      }
    })

  }

  getEvents() {
    return Array.from(this.serviceEvents)
  }
  getChoices() {
    return Array.from(this.serviceChoices)
  }
  showModal() {
    this.serviceModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    this.serviceModal.nativeElement.style.display = 'none'
    this.onLoad()
  }

}
