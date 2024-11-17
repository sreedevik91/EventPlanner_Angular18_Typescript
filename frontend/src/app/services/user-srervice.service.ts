import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { loggedUserData, loginData, registerData } from '../model/model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserSrerviceService {

  baseUrl: string = environment.apiUrl
  user!: loggedUserData;

  http = inject(HttpClient)

  constructor() { }


  registerUser(data: registerData) {
    return this.http.post(`${this.baseUrl}register`, data)
  }

  userLogin(data: loginData) {
    return this.http.post(`${this.baseUrl}login`, data)
  }

  setUser(data: loggedUserData) {
    this.user = data
  }
  getUser() {
    return this.user
  }

  sendEmail(data: any) {
    return this.http.post(`${this.baseUrl}sendMail`, data)
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}resetPassword`, data)
  }

  userLogout() {
    return this.http.get(`${this.baseUrl}logout`)
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}verifyOtp`, data)
  }

  resendOtp(id: string) {
    return this.http.get(`${this.baseUrl}sendOtp/${id}`)
  }

}
