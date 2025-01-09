
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  http = inject(HttpClient)

  baseUrl:string=environment.apiBookingUrl

  constructor() { }

  createBooking(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response' })
  }

  getTotalBookings() {
    return this.http.get(`${this.baseUrl}bookings/count`, { observe: 'response' })
  }

  getAllBookings(params: HttpParams) {
    return this.http.get(`${this.baseUrl}bookings`, { observe: 'response', params })
  }

  getBookingById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response' })
  }

  getBookingsByName(name: string) {
    return this.http.get(`${this.baseUrl}bookings/${name}`, { observe: 'response' })
  }

  // getServicesByName(name: string) {
  //   return this.http.get(`${this.baseUrl}service/${name}`, { observe: 'response' })
  // }

  getServicesByNameAndProvider(name: string,providerId:string) {
    return this.http.get(`${this.baseUrl}service/${name}/${providerId}`, { observe: 'response' })
  }

  editBooking(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response' })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response' })
  }

  deleteBooking(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response' })
  }

}
