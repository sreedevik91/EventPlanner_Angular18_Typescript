import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IService } from '../../model/interface/interface';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-user-service-details',
  standalone: true,
  imports: [],
  templateUrl: './user-service-details.component.html',
  styleUrl: './user-service-details.component.css'
})
export class UserServiceDetailsComponent implements OnInit{

activatedRoute=inject(ActivatedRoute)

service:string=''
servicesByName=signal<IService[]>([])

serviceImgUrl=environment.serviceImgUrl

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params)=>{
    console.log('services by name: ', params['data'],params['service']);
    this.service=params['service']
    this.servicesByName.set(JSON.parse(params['data']))
  })
}

}
