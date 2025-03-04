
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

  confirmBooking(bookingId:string) {
    return this.http.post(`${this.baseUrl}confirm`, {bookingId}, { observe: 'response' })
  }

  verifyPayment(razorpayResponse:any) {
    return this.http.post(`${this.baseUrl}verifyPayment`, razorpayResponse, { observe: 'response' })
  }

  getTotalBookings() {
    return this.http.get(`${this.baseUrl}bookings/count`, { observe: 'response' })
  }

  getAllBookings(params: HttpParams) {
    return this.http.get(`${this.baseUrl}bookings`, { observe: 'response', params })
  }

  getBookingsByUserId(id: string) {
    return this.http.get(`${this.baseUrl}user/${id}`, { observe: 'response' })
  }

  getBookingsById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response' })
  }
  getBookingsByProvider(id: string) {
    return this.http.get(`${this.baseUrl}bookings/${id}`, { observe: 'response' })
  }

  getBookingsByName(name: string) {
    return this.http.get(`${this.baseUrl}bookings/${name}`, { observe: 'response' })
  }

  getServicesByNameAndProvider(name: string,providerId:string) {
    return this.http.get(`${this.baseUrl}service/${name}/${providerId}`, { observe: 'response' })
  }

  getServicesByEvent(name: string) {
    return this.http.get(`${this.baseUrl}events/service/${name}`, { observe: 'response' })
  }

  getAllEvents(){
    return this.http.get(`${this.baseUrl}events`, { observe: 'response' })
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

  deleteBookedServices(bookingId:string,serviceName:string,serviceId:string){
    return this.http.delete(`${this.baseUrl}service/${bookingId}/${serviceName}/${serviceId}`, { observe: 'response' })
  }

  getSales(params:HttpParams){
    // return this.http.get(`${this.baseUrl}admin/salesData`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}salesData/admin`, { observe: 'response', params })
  }

  getProviderSales(params:HttpParams){
    // return this.http.get(`${this.baseUrl}provider/sales`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}providerSales`, { observe: 'response', params })
  }

  getAdminBookingsData(){
    // return this.http.get(`${this.baseUrl}provider/sales`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}adminData`, { observe: 'response' })
  }

}
