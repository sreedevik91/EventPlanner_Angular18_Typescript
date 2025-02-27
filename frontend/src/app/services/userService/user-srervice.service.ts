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
    return this.http.post(`${this.baseUrl}register`,data,{ observe: 'response' })
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
    return this.http.get(`${this.baseUrl}data`, { observe: 'response' })
  }

  sendResetEmail(data: any) {
    return this.http.post(`${this.baseUrl}password/resetEmail`, data, { observe: 'response' })
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}password/reset`, data, { observe: 'response' })
  }

  userLogout() {
    // debugger
    // this.loggedUserSubject.next(null)
     // First make the logout API call
    return this.http.get(`${this.baseUrl}logout`, { observe: 'response' }).pipe(
      tap(()=>{
        // Clear user data AFTER the API call succeeds
        this.loggedUserSubject.next(null)
      })
    )
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}otp/verify`, data, { observe: 'response' })
  }

  verifyUserEmail(data: any) {
    return this.http.post(`${this.baseUrl}email/verify`, data,  { observe: 'response' })
  }

  verifyUser(id: string) {
    // return this.http.post(`${this.baseUrl}verifyUser`, { id },  { observe: 'response' })
    return this.http.patch(`${this.baseUrl}verify`, { id },  { observe: 'response' })
  }

  resendOtp(id: string) {
    return this.http.get(`${this.baseUrl}otp/${id}`, { observe: 'response' })
  }

  getAllUsers(params: any) {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}users`, { observe: 'response',params })
  }

  getUsersCount() {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}users/count`, { observe: 'response' })
  }

  getUserById(id: string) {
    // return this.http.get(`${this.baseUrl}users`,{withCredentials:true})
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response' })
  }

  refreshToken() {
    return this.http.get(`${this.baseUrl}token/refresh`, { observe: 'response' })
  }

  editUser(data: any, id: string) {
    // return this.http.post(`${this.baseUrl}edit/${id}`, { data }, { observe: 'response' })
    return this.http.patch(`${this.baseUrl}${id}`, { data }, { observe: 'response' })
  }

  editStatus(id: string) {
    // return this.http.post(`${this.baseUrl}editStatus`, { id }, { observe: 'response' })
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response' })
  }

}
