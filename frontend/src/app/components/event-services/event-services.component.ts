import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { UserServicesComponent } from '../user-services/user-services.component';
import { AdminServicesComponent } from '../admin-services/admin-services.component';
import { ProviderServicesComponent } from '../provider-services/provider-services.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-event-services',
  standalone: true,
  imports: [UserServicesComponent, AdminServicesComponent, ProviderServicesComponent],
  templateUrl: './event-services.component.html',
  styleUrl: './event-services.component.css'
})
export default class EventServicesComponent implements OnInit,OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  role: string = ''

  userService = inject(UserSrerviceService)

  ngOnInit(): void {
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      console.log('logged user:', user);

      this.role = user?.role!
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
