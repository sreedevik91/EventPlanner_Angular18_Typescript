import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAdminService, INewServiceData } from '../../model/interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  http = inject(HttpClient)
  baseUrl: string = environment.apiServiceUrl

  constructor() { }

  getTotalServices() {
    return this.http.get(`${this.baseUrl}services/count`, { observe: 'response', withCredentials:true })
  }

  createService(data: FormData) {
    return this.http.post(`${this.baseUrl}new`, data, { observe: 'response', withCredentials:true })
  }

  getAllServices(params: HttpParams) {
    return this.http.get(`${this.baseUrl}services`, { observe: 'response', params, withCredentials:true })
  }

  getAvailableEvents(){
    return this.http.get(`${this.baseUrl}availableEvents`, { observe: 'response', withCredentials:true })
  }

  saveAdminService(serviceData:IAdminService){
    return this.http.post(`${this.baseUrl}addAdminService`, serviceData, { observe: 'response', withCredentials:true })
  }

  getAdminServices(){
    return this.http.get(`${this.baseUrl}adminServices`, { observe: 'response', withCredentials:true })
  }

  deleteAdminServices(service:string){
    return this.http.delete(`${this.baseUrl}adminServices/${service}`, { observe: 'response', withCredentials:true })
  }

  deleteService(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }

  getServiceById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true })
  }

  editService(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, data, { observe: 'response', withCredentials:true })
  }
  
  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response', withCredentials:true })
  }

  approveService(id: string) {
    return this.http.patch(`${this.baseUrl}approve`, { id }, { observe: 'response', withCredentials:true })
  }

  getServiceByName(name: string) {
    return this.http.get(`${this.baseUrl}name/${name}`, { observe: 'response', withCredentials:true })
  }

}
