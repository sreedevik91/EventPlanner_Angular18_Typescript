import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WalletServiceService } from '../../services/walletService/wallet-service.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IResponse, IWallet } from '../../model/interface/interface';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-wallet',
  standalone: true,
  imports: [CurrencyPipe,DatePipe],
  templateUrl: './user-wallet.component.html',
  styleUrl: './user-wallet.component.css'
})
export default class UserWalletComponent implements OnInit, OnDestroy {


  destroy$: Subject<void> = new Subject<void>()

  walletServices = inject(WalletServiceService)
  userService = inject(UserSrerviceService)

  walletData = signal<IWallet>({amount:0,transactions:[],userId:''})

  userId: string = ''

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.id
      }
    })

    this.getWallet()
  }

  getWallet() {
    this.walletServices.getWallet(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('get wallet response: ', res);
        this.walletData.set(res.body?.data)
      },
      error: (error: HttpErrorResponse) => {
        console.log('get wallet response: ', error);

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
