import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoggedUserData, ILoginData, IRegisterData, IResponse, IUser } from '../../model/interface/interface';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, of, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import Cookies from 'js-cookie'

@Injectable({
  providedIn: 'root'
})

export class UserSrerviceService {

  baseUrl: string = environment.apiUserUrl
  router = inject(Router)
  http = inject(HttpClient)

  constructor() {
    let isLoggedIn = localStorage.getItem('isLoggedIn')

    // let storedUser = localStorage.getItem('loggedUser')
    // if (isLoggedIn === 'true' && storedUser) {
    //   this.loggedUserSubject.next(JSON.parse(storedUser))
    // }

    if (isLoggedIn === 'true') {
      console.log('isLoggedIn is true in localStorage');

      // this.checkLoggedUser().subscribe()
    } else {
      console.log(`isLoggedIn is ${isLoggedIn} in localStorage`);

    }

    // listen for localStorage value changes in other tabs and update the logged user accordingly
    window.addEventListener('storage', (event) => {
      console.log('window event triggered :', event);

      if (event.key === 'isLoggedIn') {
        if (event.newValue === 'true') {
          // this.loggedUserSubject.next(JSON.parse(localStorage.getItem('loggedUser') || '{}'))
          this.checkLoggedUser().subscribe()
        } else {
          this.clearLoggedUserData()
          this.router.navigateByUrl('/login');
        }
      }
    })

  }

  loggedUserSubject: BehaviorSubject<ILoggedUserData | null> = new BehaviorSubject<ILoggedUserData | null>(null)

  loggedUser$ = this.loggedUserSubject.asObservable()

  setLoggedUser(data: ILoggedUserData) {
    this.loggedUserSubject.next(data)
  }

  checkLoggedUser() {
    return this.http.get(`${this.baseUrl}check`, { observe: 'response', withCredentials: true }).pipe(
      take(1),
      tap((response: HttpResponse<IResponse>) => {
        console.log('checkLoggedUser response:', response)
        if (response.body?.success) {
          // localStorage.setItem('isLoggedIn', 'true')
          // localStorage.setItem('loggedUser', JSON.stringify(response.body?.data))
          this.loggedUserSubject.next(response.body.data)
        } else {
          this.clearLoggedUserData()
        }
      }),
      map((response => !!response.body?.success)), // to convert strictly to a boolean value
      catchError(() => {
        this.clearLoggedUserData()
        return of(false)
      })
    )
  }

  clearLoggedUserData() {
    console.log('logged user data cleared from localStorage and subject');

    this.loggedUserSubject.next(null)
    localStorage.removeItem('isLoggedIn')
    // localStorage.removeItem('loggedUser')
  }

  registerUser(data: IRegisterData) {
    return this.http.post(`${this.baseUrl}register`, data, { observe: 'response', withCredentials: true })
  }

  userLogin(data: ILoginData) {
    console.log('userlogin url:', `${this.baseUrl}login`);

    return this.http.post(`${this.baseUrl}login`, data, { observe: 'response', withCredentials: true })

  }

  googleSignin() {
    // debugger
    window.location.href = environment.googleAuthUrl;
  }

  handleGoogleSignin() {
    return this.http.get(`${this.baseUrl}data`, { observe: 'response', withCredentials: true })
  }

  sendResetEmail(data: any) {
    return this.http.post(`${this.baseUrl}password/resetEmail`, data, { observe: 'response', withCredentials: true })
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}password/reset`, data, { observe: 'response', withCredentials: true })
  }

  userLogout() {
    // First make the logout API call
    return this.http.get(`${this.baseUrl}logout`, { observe: 'response', withCredentials: true }).pipe(
      tap(() => {
        // Clear user data AFTER the API call succeeds
        // this.loggedUserSubject.next(null)
        Cookies.remove('accessToken', { path: '/', domain: 'dreamevents.shop' })
        Cookies.remove('refreshToken', { path: '/', domain: 'dreamevents.shop' })
        this.clearLoggedUserData()
      })
    )
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.baseUrl}otp/verify`, data, { observe: 'response', withCredentials: true })
  }

  verifyUserEmail(data: any) {
    return this.http.post(`${this.baseUrl}email/verify`, data, { observe: 'response', withCredentials: true })
  }

  verifyUser(id: string) {
    return this.http.patch(`${this.baseUrl}verify`, { id }, { observe: 'response', withCredentials: true })
  }

  resendOtp(id: string) {
    return this.http.get(`${this.baseUrl}otp/${id}`, { observe: 'response', withCredentials: true })
  }

  getAllUsers(params: any) {
    return this.http.get(`${this.baseUrl}users`, { observe: 'response', params, withCredentials: true })
  }

  getUsersCount() {
    return this.http.get(`${this.baseUrl}users/count`, { observe: 'response', withCredentials: true })
  }

  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}${id}`, { observe: 'response', withCredentials: true })
  }

  refreshToken() {
    return this.http.get(`${this.baseUrl}token/refresh`, { observe: 'response', withCredentials: true })
  }

  editUser(data: any, id: string) {
    return this.http.patch(`${this.baseUrl}${id}`, { data }, { observe: 'response', withCredentials: true })
  }

  editStatus(id: string) {
    return this.http.patch(`${this.baseUrl}status`, { id }, { observe: 'response', withCredentials: true })
  }

}
