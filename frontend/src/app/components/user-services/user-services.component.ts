import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ServiceService } from '../../services/serviceService/service.service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { IService } from '../../model/interface/interface';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { AlertService } from '../../services/alertService/alert.service';
import { IChoice } from '../../model/class/serviceClass';

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

  searchParams = new HttpParams()

  services = signal<IService[]>([])
  serviceByName = signal<any[]>([])

  servicesName: string = ''
  serviceEvents = new Set<string>()
  // serviceChoices=new Set<IChoice>()
  serviceChoicesDb: IChoice[] = []
  serviceChoices = new Set<string>()
  servicePrizeRange: string = ''


  ngOnInit(): void {
    this.onLoad()
  }

  onLoad() {
    this.searchParams = this.searchParams.set('isApproved', true)
    this.getAllServices(this.searchParams)
  }

  getAllServices(params: HttpParams) {
    this.serviceServices.getAllServices(params).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          console.log('getAllServices response', res.body.data);
          this.services.set(res.body.data)
        } else {
          console.log(res.body.message);
          // this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })
  }

  getService(name: string) {
    this.servicesName = name
    // this.searchParams = this.searchParams.set('serviceName', name)
    //   .set('isApproved', true)
    // this.getAllServices(this.searchParams)
    // let values = this.services()
    // values.forEach(e => {
    //   let events = e.events
    //   events.forEach(element => {
    //     this.serviceEvents.add(element)
    //   });
    //   let choices = e.choices
    //   choices.forEach(elem => {
    //     this.serviceChoicesDb.push(elem)
    //   })
    //   // let min:any=0
    //   // let max:number=0
    //   let min = this.serviceChoicesDb.forEach((val) => {
    //     this.serviceChoices.add(val.choiceName)
    //     let arr = []
    //     arr.push(val.choicePrice)
    //     let minValue = arr.sort((a, b) => a - b)
    //     //  let mini=Math.min(Number(val.choicePrice))
    //     return minValue[0]
    //   })
    //   let max = this.serviceChoicesDb.forEach((val) => {
    //     let arr = []
    //     arr.push(val.choicePrice)
    //     let maxValue = arr.sort((a, b) => b - a)
    //     //  let mini=Math.min(Number(val.choicePrice))
    //     return maxValue[0]
    //   })
    //   this.servicePrizeRange = `₹ ${min}-${max}`
    //   this.showModal()
    // })

    this.serviceServices.getServiceByName(name).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          console.log('getServiceByName response: ', res.body.data);
          this.serviceByName.set(res.body.data)
          this.showModal()
        } else {
          console.log(res.body.message);
          // this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }

      },
      error: (error: HttpErrorResponse) => {
        // this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)
        console.log('getServiceByName error: ', error.message);

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
