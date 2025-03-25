import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Events, EventSearchFilter, IEventService } from '../../model/class/eventClass';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { EventServiceService } from '../../services/eventService/event-service.service';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpStatusCodes, IEvent, IEventServiceResponse, IResponse } from '../../model/interface/interface';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, AlertComponent, FormComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  eventFromObj: Events = new Events()
  searchFilterFormObj: EventSearchFilter = new EventSearchFilter()

  eventForm: FormGroup = new FormGroup({})
  searchFilterForm: FormGroup = new FormGroup({})

  @ViewChild('modal') formModal!: ElementRef
  @ViewChild('eventImgInput') eventImgInput!: ElementRef<HTMLInputElement>

  searchParams = new HttpParams()

  eventService = inject(EventServiceService)
  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)

  isAddEvent: boolean = true
  showServices: boolean = false
  currentPage: number = Number(this.searchFilterFormObj.pageNumber)
  totalEvents: number = 0
  events = signal<IEvent[]>([])
  services = signal<any[]>([])
  // eventServicesList = signal<IEventServiceResponse[]>([])
  eventServicesList = signal<string[]>([])

  eventOptions = ['Marriage', 'Engagement', 'Birthday']

  // eventImgUrl: string = environment.eventImgUrl

  imgUrl: string | ArrayBuffer | null = ''

  constructor() { }

  ngOnInit(): void {
    this.initialiseEventForm()
    // this.getTotalEvents()
    this.initialiseSearchFilterForm()
    // this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user: any) => {
    //   this.providerId = user.id
    //   this.provider = user.user
    //   console.log(this.providerId, user);

    // })
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllEvents(this.searchParams)
  }

  initialiseEventForm() {
    this.eventForm = new FormGroup({
      _id: new FormControl(this.eventFromObj._id),
      name: new FormControl(this.eventFromObj.name, [Validators.required]),
      img: new FormControl(this.eventFromObj.img || null, [Validators.required]),

      // services: this.isAddEvent ? new FormArray([]) : new FormArray(
      //   (this.eventFromObj.services).map((service) => {
      //     return new FormGroup({
      //       service: new FormControl(service.service, [Validators.required]),
      //       providerId: new FormControl(service.providerId, [Validators.required]),
      //     })
      //   })
      // )

      services: new FormArray(
        (this.eventFromObj.services).map((service) => {
          return new FormControl(service, [Validators.required])
        })
      )

    })
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      eventName: new FormControl(this.searchFilterFormObj.eventName),
      isActive: new FormControl(this.searchFilterFormObj.isActive),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder),
    })
  }


  onImageUpload(event: Event) {
    console.log('onImageUpload: ', event);
    const input = <HTMLInputElement>event.target
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      let imageurl: string | ArrayBuffer | null = ''

      let reader = new FileReader
      reader.readAsDataURL(file)
      reader.onload = (event: Event) => {
        imageurl = (<FileReader>event.target).result

        this.eventForm.get('img')?.setValue(file)
        this.imgUrl = imageurl

      }
    }
  }

  getTotalEvents() {
    this.eventService.getTotalEvents().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.totalEvents = res.body?.data
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })
  }

  onRefresh() {
    this.searchParams = new HttpParams()
    this.searchFilterForm.get('eventName')?.setValue('')
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllEvents(this.searchParams)
  }

  onSearch() {
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('sortBy', this.searchFilterFormObj.sortBy)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)

    if (this.searchFilterFormObj.eventName !== '') {
      this.searchParams = this.searchParams.set('eventName', this.searchFilterFormObj.eventName)
    }

    this.getAllEvents(this.searchParams)

  }

  onSort(value: string) {
    this.searchFilterFormObj.sortOrder = this.searchFilterFormObj.sortOrder === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortBy', value)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)
    this.getAllEvents(this.searchParams)

  }

  getAllEvents(params: HttpParams) {
    // debugger
    this.eventService.getAllEvents(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.totalEvents=res.body.data.length
          this.events.set(res.body?.data.events)
          this.totalEvents = res.body?.data.count

          console.log('events response: ', res.body);
          console.log('events: ', this.events());
        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }

  getServices(value: string) {
    console.log('getServices event: ', value);
    this.eventService.getServicesByName(value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('getServices res: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.services.set(res.body?.data)
          this.eventServicesList.set(res.body?.extra)
          this.showServices = true
        } else {
          console.log('could not get services', res.body?.message);
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message ? res.body?.message : '')

        }

      },
      error: (error: HttpErrorResponse) => {
        console.log('getEventServices error: ', error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message || error.statusText)
      }
    })
  }

  getEventServices(event: Event) {
    // get services come under the particulae event on change of event name while adding new event
    // has to get it from services microservice from backend
    console.log('change event on change of event name: ', event);
    console.log('getEventServices: ', event?.target);

    const eventInput = <HTMLInputElement>event?.target
    const eventName: string | undefined = eventInput?.value
    this.getServices(eventName)

    //  let eventName:string=''
    //   if(eventInput){
    //     eventName=eventInput.value 
    //   }else if(eventNameValue){
    //     eventName=eventNameValue
    //   }

    // this.eventService.getServicesByName(eventName).pipe(takeUntil(this.destroy$)).subscribe({
    //   next: (res: HttpResponse<IResponse>) => {
    //     console.log('getEventServices res: ', res);
    //     if (res.status === HttpStatusCodes.SUCCESS) {
    //       this.services.set(res.body?.data)
    //       this.eventServicesList.set(res.body?.extra)
    //       this.showServices = true
    //     } else {
    //       console.log('could not get services', res.body?.message);
    //       this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message ? res.body?.message : '')

    //     }

    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.log('getEventServices error: ', error);
    //     this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message || error.statusText)
    //   }
    // })

  }

  setServiceValues(event: Event, service: string, id?: string, index?: number) {
    console.log('setServiceValues service on change: ', service);

    const formArray = <FormArray>this.eventForm.get('services')
    let serviceArray = formArray.value
    console.log('serviceArray: ', serviceArray);

    if ((<HTMLInputElement>event.target).checked) {
      if (!formArray.value.includes(service)) {
        formArray.push(new FormControl(service))
      }
    } else {
      let index = formArray.value.indexOf(service)
      if (index !== -1) {
        formArray.removeAt(index)
      }
    }


    // if ((<HTMLInputElement>event.target).checked) {
    //   const eventFormGroup = new FormGroup({
    //     service: new FormControl(service),
    //     providerId: new FormControl(id)
    //   });

    //   (<FormArray>this.eventForm.get('services')).push(eventFormGroup)

    // }

  }

  isServiceChecked(service: string) {
    let formArray = <FormArray>this.eventForm.get('services')
    if (formArray.value.includes(service)) {
      return true
    } else {
      return false
    }
  }

  onAddService() {
    this.isAddEvent = true
    this.showModal()
  }

  setStatus(id: string) {
    console.log(id);
    this.eventService.editStatus(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('edit status response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.getAllEvents(this.searchParams)
          this.events.update(events =>
            events.map(event => event._id === id ? { ...event, isActive: !event.isActive } : event)
          )
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : '')

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message ? res.body?.message : '')

        }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }


  onEdit(id: string) {
    this.isAddEvent = false
    this.eventService.getEventById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.eventFromObj = res.body?.data
          console.log('update form data: ', this.eventFromObj);
          this.initialiseEventForm()
          const eventName = this.eventForm.get('name')?.value
          this.getServices(eventName)
          this.showModal()
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }


  saveEvent() {
    // console.log(this.eventForm.errors);
    // console.log(this.eventForm.value);
    const { _id, ...rest } = this.eventForm.value
    console.log('data to add new service: ', rest);

    const formData = new FormData()

    let services = this.eventForm.get('services')?.value
    formData.append('name', this.eventForm.get('name')?.value)
    formData.append('img', this.eventForm.get('img')?.value)
    formData.append('services', JSON.stringify(services))

    // let services = this.eventForm.get('services')?.value || []
    // // formData.append('choices',[])
    // services = services.map((service: any, index: number) => {
    //   const newChoices = {
    //     serviceId: service.serviceId,
    //     providerId: service.providerId

    //   }
    //   return newChoices
    // })

    // formData.append('choices', JSON.stringify(services))
    // console.log('data to add new service: ', formData);

    this.eventService.createEvent(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.CREATED) {
          this.hideModal()
          // this.getTotalEvents()
          this.totalEvents+=1
          this.getAllEvents(this.searchParams)
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : '')
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.error.message)

      }
    })

  }

  editEvent(id: string) {

    // console.log('service data to edit: ', this.eventFromObj);
    let { _id, ...rest } = this.eventForm.value
    let data = rest
    console.log('updated event data:', data);

    const formData = new FormData()
    let services = this.eventForm.get('services')?.value
    formData.append('name', this.eventForm.get('name')?.value)
    formData.append('img', this.eventForm.get('img')?.value || data.img)
    formData.append('services', JSON.stringify(services))

    // let services = this.eventForm.get('services')?.value || []
    // services = services.map((service: IEventService, index: number) => {
    //   const newChoices = {
    //     serviceId: service.service,
    //     providerId: service.providerId
    //   }
    //   return newChoices
    // })
    // formData.append('services', JSON.stringify(services))

    console.log('edited event data: ', formData);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // debugger

    this.eventService.editEvent(formData, id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('update event response: ', res.body);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || 'Service updated')
          this.hideModal()
          // this.getTotalEvents()
          this.getAllEvents(this.searchParams)
        } else {
          console.log('could not get event', res.body?.message || '');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')
          // this.getTotalEvents()
          // this.getAllEvents(this.searchParams)
          this.events.update(events =>
            events.filter(event => event._id !== id)
          )
          this.totalEvents-=1
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message || '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Delete Service Failed", error.error.message)

      }
    })
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.searchFilterFormObj.pageNumber = page.toString()
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
    this.getAllEvents(this.searchParams)

  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalEvents / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    return Math.ceil(this.totalEvents / Number(this.searchFilterFormObj.pageSize))
  }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
    this.imgUrl = ''
    this.eventForm.reset()
    this.eventFromObj = new Events()
    this.initialiseEventForm()
    this.isAddEvent = true
    this.eventServicesList.set([])
    this.eventImgInput.nativeElement.value = ''
    console.log('on closing the model eventForm value: ', this.eventForm.value);

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
