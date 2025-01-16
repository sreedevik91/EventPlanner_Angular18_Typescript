import { Injectable, signal } from '@angular/core';
import { IBooking, IService } from '../../model/interface/interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  eventServices = signal<any>({})

  service: string = ''
  servicesByName = signal<IService[]>([])
  bookingFormValue = signal<IBooking>({
        _id: '',
            userId: '',
            user: '',
            event: '',
            img:'',
            service: '',
            serviceId: '',
            providerId: '',
            eventId: '',
            services: [],
            deliveryDate: new Date(),
            venue:  { building: '', street: '', city: '', district: '', state: '', pbNo: 0 },
            totalCount: 0,
            isConfirmed:false
  })

  constructor() { }

  setServiceData(name: string, data: IService[]) {
    this.service = name
    this.servicesByName.set(data)
  }

  getServiceName() {
    return this.service
  }

  getServiceData() {
    return this.servicesByName()
  }

  setEventServiceData(data: IService[]) {
    this.eventServices.set(data)
  }

  getEventServiceData() {
    return this.eventServices()
  }

  setBookingFormData(data:IBooking) {
    this.bookingFormValue.set(data)
  }

  getBookingFormData() {
    return this.bookingFormValue()
  }

}
