import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletServiceService {


  http = inject(HttpClient)

  baseUrl: string = environment.apiWalletUrl

  constructor() { }

  getWallet(userId: string) {
    return this.http.get(`${this.baseUrl}userWallet/${userId}`, { observe: 'response', withCredentials: true })
  }

  addToWallet(walletId:string,amount:number,type:string) {
    const data={
      type,
      amount
    }
    return this.http.post(`${this.baseUrl}${walletId}`, data,  { observe: 'response', withCredentials:true })
  }
}
