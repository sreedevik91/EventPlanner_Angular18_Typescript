import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoggedUserData, ILoginData, IRegisterData, IUser } from '../../model/interface/interface';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSrerviceService {

  baseUrl: string = environment.apiUserUrl

  http = inject(HttpClient)

  constructor() { }

  // loggedUserSubject:BehaviorSubject<ILoggedUserData>= new BehaviorSubject<ILoggedUserData>({_id: '',user: '',role: '', username: '',email: ''})
  loggedUserSubject: BehaviorSubject<ILoggedUserData | null> = new BehaviorSubject<ILoggedUserData | null>(null)

  loggedUser$ = this.loggedUserSubject.asObservable()

  setLoggedUser(data: ILoggedUserData) {
    this.loggedUserSubject.next(data)
  }

  registerUser(data: IRegisterData) {
    return this.http.post(`${this.baseUrl}register`, data)
  }

  userLogin(data: ILoginData) {
    return this.http.post(`${this.baseUrl}login`, data, { observe: 'response' })
    // { observe: 'response' } will incluse status codes in response which could be get be response.status
    // backend response data would be accessed by response.body.keyName
  }

  googleSignin() {
    window.location.href = 'http://localhost:4000/user/auth/google';
  }

  handleGoogleSignin() {
    return this.http.get(`${this.baseUrl}data`)
  }

  sendResetEmail(data: any) {
    return this.http.post(`${this.baseUrl}sendResetEmail`, data)
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}resetPassword`, data)
  }

  userLogout() {
    this.loggedUserSubject.next(null)
    return this.http.get(`${this.baseUrl}logout`)
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}verifyOtp`, data)
  }

  verifyUserEmail(data: any) {
    return this.http.post(`${this.baseUrl}verifyEmail`, data)
  }

  verifyUser(id: string) {
    return this.http.post(`${this.baseUrl}verifyUser`, { id })
  }

  resendOtp(id: string) {
    return this.http.get(`${this.baseUrl}sendOtp/${id}`)
  }

  getAllUsers(params: any) {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}users`, { params })
  }

  getUsersCount() {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}usersCount`)
  }

  getUserById(id: string) {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}user/${id}`)
  }

  refreshToken() {
    return this.http.get(`${this.baseUrl}refreshToken`)
  }

  editUser(data: any, id: string) {
    return this.http.post(`${this.baseUrl}edit/${id}`, { data })
  }

  editStatus(id: string) {
    return this.http.post(`${this.baseUrl}editStatus`, { id })
  }

}
