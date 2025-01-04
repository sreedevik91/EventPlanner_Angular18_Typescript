import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  http = inject(HttpClient)

  baseUrl:string=environment.apiEventUrl

  constructor() { }

  createEvent(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response' })
  }

  getTotalEvents() {
    return this.http.get(`${this.baseUrl}events/count`, { observe: 'response' })
  }

  getAllEvents(params: HttpParams) {
    // debugger
    return this.http.get(`${this.baseUrl}events`, { observe: 'response', params })
  }

  getEventById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response' })
  }

  getEventByName(name: string) {
    return this.http.get(`${this.baseUrl}events/${name}`, { observe: 'response' })
  }

  getServicesByName(name: string) {
    return this.http.get(`${this.baseUrl}service/${name}`, { observe: 'response' })
  }

  editEvent(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response' })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response' })
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response' })
  }

}
