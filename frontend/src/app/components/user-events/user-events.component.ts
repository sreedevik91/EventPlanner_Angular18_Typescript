import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EventServiceService } from '../../services/eventService/event-service.service';
import { HttpStatusCodes, IEvent, IResponse } from '../../model/interface/interface';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataService/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-events',
  standalone: true,
  imports: [ButtonComponent, AlertComponent],
  templateUrl: './user-events.component.html',
  styleUrl: './user-events.component.css'
})
export class UserEventsComponent implements OnInit,OnDestroy {

  destroy$:Subject<void>= new Subject<void>()

  eventService = inject(EventServiceService)
  alertService = inject(AlertService)
  dataService = inject(DataService)

  searchParams = new HttpParams()

  events = signal<IEvent[]>([])

  router=inject(Router)

  ngOnInit(): void {

  }

  getEventService(name: string) {
    this.eventService.getEventByName(name).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {

        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(`events by the name ${name}`, res.body?.data);
          console.log(`services for ${name}`, res.body?.extra);
          this.events.set(res.body?.data)
          this.dataService.setEventServiceData(res.body?.extra)
          this.router.navigate(['events/details'])
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Register User Failed", res.body?.message || 'Could not get data!')
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
        this.alertService.getAlert("alert alert-danger", "Register User Failed", err.error.message || err.statusText)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
