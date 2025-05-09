import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Menus } from '../../model/constants/menus';
import { Subject, takeUntil } from 'rxjs';
import { IResponse } from '../../model/interface/interface';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export default class LayoutComponent implements OnDestroy, OnInit, AfterViewInit {

  destroy$: Subject<void> = new Subject<void>()

  role: string = ''
  userMenus: any = []
  userName: string = ''

  userService = inject(UserSrerviceService)
  router = inject(Router)
  cdr=inject(ChangeDetectorRef)
  el=inject(ElementRef)
  menus = Menus

  constructor() {
    console.log('layout loaded: ');

      this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user)=>{
        if(user){
          // this.cdr.detectChanges()
          this.role = user.role
          this.userName = user.user
        }
      })

    console.log('logged user name: ', this.userName);

      this.menus.forEach((element:any)=>{
       let isRole=element.roles.includes(this.role)
       if(isRole){
        this.userMenus.push(element)
       }
      })
      console.log('User menus: ',this.userMenus);
  }

  ngAfterViewInit(): void {
    let dropdown=this.el.nativeElement.querySelector('#dropdownUser1')
    console.log('dropdown element in the navbar: ', dropdown);
    
    if(dropdown){
      new bootstrap.Dropdown(dropdown)
    }
  }

  ngOnInit(): void {
    // this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
    //   if (user) {
    //     this.role = user.role
    //     this.userName = user.user
    //   }
    // })

    // console.log('logged user name: ', this.userName);

    // this.menus.forEach((element: any) => {
    //   let isRole = element.roles.includes(this.role)
    //   if (isRole) {
    //     this.userMenus.push(element)
    //   }
    // })
    // console.log('User menus: ', this.userMenus);
  }


  logout() {
    this.userService.userLogout().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('logout response from: ', res);

        this.router.navigate(['login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Logout failed:', error);
        this.router.navigate(['login']);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
