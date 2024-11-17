import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserSrerviceService } from '../../services/user-srervice.service';
import { Menus } from '../../model/menus';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  role: string = ''
  userMenus: any = []
  userName:string=''

  userService = inject(UserSrerviceService)
  router = inject(Router)
  menus=Menus

  constructor() {
    this.role = this.userService.getUser().role
    this.userName = this.userService.getUser().user
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
    this.userService.userLogout().subscribe((res: any) => {
      this.router.navigate(['login'])
    })
  }
}
