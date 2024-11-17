import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserSrerviceService } from '../../services/user-srervice.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  userService=inject(UserSrerviceService)
  router=inject(Router)

  logout() {
    this.userService.userLogout().subscribe((res: any) => {
      this.router.navigate(['login'])
    })
  }
}
