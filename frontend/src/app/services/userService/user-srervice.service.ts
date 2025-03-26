import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoggedUserData, ILoginData, IRegisterData, IUser } from '../../model/interface/interface';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSrerviceService {

  baseUrl: string = environment.apiUserUrl

  http = inject(HttpClient)

  constructor() { }

  loggedUserSubject: BehaviorSubject<ILoggedUserData | null> = new BehaviorSubject<ILoggedUserData | null>(null)

  loggedUser$ = this.loggedUserSubject.asObservable()

  setLoggedUser(data: ILoggedUserData) {
    this.loggedUserSubject.next(data)
  }

  registerUser(data: IRegisterData) {
    return this.http.post(`${this.baseUrl}register`,data,{ observe: 'response', withCredentials:true })
  }

  userLogin(data: ILoginData) {
    console.log('userlogin url:',`${this.baseUrl}login` );
    
    return this.http.post(`${this.baseUrl}login`, data, { observe: 'response', withCredentials:true })
    
  }

  googleSignin() {
    debugger
    window.location.href = environment.googleAuthUrl;
  }

  handleGoogleSignin() {
    return this.http.get(`${this.baseUrl}data`, { observe: 'response', withCredentials:true  })
  }

  sendResetEmail(data: any) {
    return this.http.post(`${this.baseUrl}password/resetEmail`, data, { observe: 'response', withCredentials:true  })
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}password/reset`, data, { observe: 'response', withCredentials:true  })
  }

  userLogout() {
     // First make the logout API call
    return this.http.get(`${this.baseUrl}logout`, { observe: 'response', withCredentials:true  }).pipe(
      tap(()=>{
        // Clear user data AFTER the API call succeeds
        this.loggedUserSubject.next(null)
      })
    )
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}otp/verify`, data, { observe: 'response', withCredentials:true  })
  }

  verifyUserEmail(data: any) {
    return this.http.post(`${this.baseUrl}email/verify`, data,  { observe: 'response', withCredentials:true  })
  }

  verifyUser(id: string) {
    return this.http.patch(`${this.baseUrl}verify`, { id },  { observe: 'response', withCredentials:true  })
  }

  resendOtp(id: string) {
    return this.http.get(`${this.baseUrl}otp/${id}`, { observe: 'response', withCredentials:true  })
  }

  getAllUsers(params: any) {
    return this.http.get(`${this.baseUrl}users`, { observe: 'response',params, withCredentials:true  })
  }

  getUsersCount() {
    return this.http.get(`${this.baseUrl}users/count`, { observe: 'response', withCredentials:true  })
  }

  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response', withCredentials:true  })
  }

  refreshToken() {
    return this.http.get(`${this.baseUrl}token/refresh`, { observe: 'response', withCredentials:true  })
  }

  editUser(data: any, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, { data }, { observe: 'response', withCredentials:true  })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response', withCredentials:true  })
  }

}
