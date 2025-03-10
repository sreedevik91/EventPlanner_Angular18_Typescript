import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  http = inject(HttpClient)

  baseUrl:string=environment.apiEventUrl

  constructor() { }

  createEvent(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response', withCredentials:true })
  }

  getTotalEvents() {
    return this.http.get(`${this.baseUrl}events/count`, { observe: 'response', withCredentials:true })
  }

  getAllEvents(params: HttpParams) {
    // debugger
    return this.http.get(`${this.baseUrl}events`, { observe: 'response', params, withCredentials:true })
  }

  getEventById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }

  getEventByName(name: string) {
    return this.http.get(`${this.baseUrl}events/${name}`, { observe: 'response', withCredentials:true })
  }

  getServicesByName(name: string) {
    return this.http.get(`${this.baseUrl}service/${name}`, { observe: 'response', withCredentials:true })
  }

  editEvent(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response', withCredentials:true })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response', withCredentials:true })
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }

}
