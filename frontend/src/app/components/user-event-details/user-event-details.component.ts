import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IService } from '../../model/interface/interface';
import { environment } from '../../../environments/environment.development';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-user-event-details',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './user-event-details.component.html',
  styleUrl: './user-event-details.component.css'
})
export class UserEventDetailsComponent implements OnInit {

activatedRoute=inject(ActivatedRoute)

services=signal<any>({})
serviceNames:string[]=[]

serviceImgUrl=environment.serviceImgUrl

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params)=>{
    console.log('services by name: ', params['data'])
    this.services.set(JSON.parse(params['data']))
    console.log('services key names: ', Object.keys(this.services()))
this.serviceNames=Object.keys(this.services())
  })
}

bookEvent(eventId:string,providerId:string){

}

}
