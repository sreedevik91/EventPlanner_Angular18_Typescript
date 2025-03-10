
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  http = inject(HttpClient)

  baseUrl:string=environment.apiBookingUrl

  constructor() { }

  createBooking(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response', withCredentials:true })
  }

  confirmBooking(bookingId:string) {
    return this.http.post(`${this.baseUrl}confirm`, {bookingId}, { observe: 'response', withCredentials:true })
  }

  verifyPayment(razorpayResponse:any) {
    return this.http.post(`${this.baseUrl}verifyPayment`, razorpayResponse, { observe: 'response', withCredentials:true })
  }

  getTotalBookings() {
    return this.http.get(`${this.baseUrl}bookings/count`, { observe: 'response', withCredentials:true })
  }

  getAllBookings(params: HttpParams) {
    return this.http.get(`${this.baseUrl}bookings`, { observe: 'response', params, withCredentials:true })
  }

  getBookingsByUserId(id: string) {
    return this.http.get(`${this.baseUrl}user/${id}`, { observe: 'response', withCredentials:true })
  }

  getBookingsById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }
  getBookingsByProvider(id: string) {
    return this.http.get(`${this.baseUrl}bookings/${id}`, { observe: 'response', withCredentials:true })
  }

  getBookingsByName(name: string) {
    return this.http.get(`${this.baseUrl}bookings/${name}`, { observe: 'response', withCredentials:true })
  }

  getServicesByNameAndProvider(name: string,providerId:string) {
    return this.http.get(`${this.baseUrl}service/${name}/${providerId}`, { observe: 'response', withCredentials:true })
  }

  getServicesByEvent(name: string) {
    return this.http.get(`${this.baseUrl}events/service/${name}`, { observe: 'response', withCredentials:true })
  }

  getAllEvents(){
    return this.http.get(`${this.baseUrl}events`, { observe: 'response', withCredentials:true })
  }

  editBooking(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response', withCredentials:true })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response', withCredentials:true })
  }

  deleteBooking(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }

  deleteBookedServices(bookingId:string,serviceName:string,serviceId:string){
    return this.http.delete(`${this.baseUrl}service/${bookingId}/${serviceName}/${serviceId}`, { observe: 'response', withCredentials:true })
  }

  getSales(params:HttpParams){
    // return this.http.get(`${this.baseUrl}admin/salesData`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}salesData/admin`, { observe: 'response', params, withCredentials:true })
  }

  getProviderSales(params:HttpParams){
    // return this.http.get(`${this.baseUrl}provider/sales`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}providerSales`, { observe: 'response', params, withCredentials:true })
  }

  getAdminBookingsData(){
    // return this.http.get(`${this.baseUrl}provider/sales`, { observe: 'response', params })
    return this.http.get(`${this.baseUrl}adminData`, { observe: 'response', withCredentials:true })
  }

}
