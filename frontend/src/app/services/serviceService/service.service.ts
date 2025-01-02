import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { INewServiceData } from '../../model/interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  http = inject(HttpClient)
  baseUrl: string = environment.apiServiceUrl

  constructor() { }

  getTotalServices() {
    return this.http.get(`${this.baseUrl}services/count`, { observe: 'response' })
  }

  createService(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response' })
  }

  getAllServices(params: HttpParams) {
    return this.http.get(`${this.baseUrl}services`, { observe: 'response', params })
  }

  deleteService(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response' })
  }

  getServiceById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response' })
  }

  editService(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response' })
  }
  
  editStatus(id: string) {
    // return this.http.get(`${this.baseUrl}editStatus/${id}`, { observe: 'response' })
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response' })
  }

  approveService(id: string) {
    return this.http.patch(`${this.baseUrl}approve`, { id }, { observe: 'response' })
  }

  getServiceByName(name: string) {
    return this.http.get(`${this.baseUrl}name/${name}`, { observe: 'response' })
  }

}
