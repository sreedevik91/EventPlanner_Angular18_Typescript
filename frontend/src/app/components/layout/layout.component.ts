import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Menus } from '../../model/constants/menus';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements OnDestroy{

  destroy$:Subject<void>=new Subject<void>()

  role: string = ''
  userMenus: any = []
  userName:string=''

  userService = inject(UserSrerviceService)
  router = inject(Router)
  menus=Menus

  constructor() {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user)=>{
      if(user){
        this.role = user.role
        this.userName = user.user
      }
    })
  
    // console.log('User role: ',this.role);
    this.menus.forEach((element:any)=>{
     let isRole=element.roles.includes(this.role)
     if(isRole){
      this.userMenus.push(element)
     }
    })
    console.log('User menus: ',this.userMenus);
    
  }

  logout() {
    this.userService.userLogout().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.router.navigate(['login'])
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
