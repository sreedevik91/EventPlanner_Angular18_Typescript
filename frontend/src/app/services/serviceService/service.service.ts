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
    return this.http.get(`${this.baseUrl}totalService`, { observe: 'response' })
  }

  createService(data: INewServiceData) {
    return this.http.post(`${this.baseUrl}addService`, data, { observe: 'response' })
  }

  getAllServices(params: HttpParams) {
    return this.http.get(`${this.baseUrl}services`, { observe: 'response', params })

  }

  deleteService(id: string) {
    return this.http.get(`${this.baseUrl}delete/${id}`, { observe: 'response' })
  }

  getServiceById(id: string) {
    return this.http.get(`${this.baseUrl}service/${id}`, { observe: 'response' })
  }

  editService(data: any, id: string) {
    return this.http.post(`${this.baseUrl}edit/${id}`,{data}, { observe: 'response' })
  }
  editStatus(id: string) {
    return this.http.get(`${this.baseUrl}editStatus/${id}`, { observe: 'response' })
  }

  approveService(id: string) {
    return this.http.get(`${this.baseUrl}approveService/${id}`, { observe: 'response'  })
  }

getServiceByName(name:string){
  return this.http.get(`${this.baseUrl}getServiceByName/${name}`, { observe: 'response'  })
}

}
