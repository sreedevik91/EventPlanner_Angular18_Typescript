import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent, IResponse, IService, IServicesArray } from '../../model/interface/interface';
import { environment } from '../../../environments/environment.development';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataService } from '../../services/dataService/data.service';
import { BookingService } from '../../services/bookingService/booking.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { Booking } from '../../model/class/bookingClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../shared/components/form/form.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Districts } from '../../model/districtsList';
import { style } from '@angular/animations';
import { AlertService } from '../../services/alertService/alert.service';

@Component({
  selector: 'app-user-event-details',
  standalone: true,
  imports: [ButtonComponent, FormComponent, ReactiveFormsModule],
  templateUrl: './user-event-details.component.html',
  styleUrl: './user-event-details.component.css'
})
export class UserEventDetailsComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute)

  dataService = inject(DataService)

  bookingService = inject(BookingService)
  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)

  bookingFromObj: Booking = new Booking()

  bookingForm: FormGroup = new FormGroup({})

  @ViewChild('modal') formModal!: ElementRef

  servicesData = signal<any>({})
  serviceNames: string[] = []

  step = signal<number>(1)

  statesList = Object.keys(Districts)
  districtsList: string[] = []

  selectedService: Partial<IService> = {}
  optionArray: any[] = []

  eventsList: Partial<IEvent>[] = []
  eventsArray: string[] = []

  decor: IServicesArray[] = []
  dining: IServicesArray[] = []
  cuisine: IServicesArray[] = []
  coverage: IServicesArray[] = []

  serviceImgUrl = environment.serviceImgUrl

  ngOnInit(): void {

    this.servicesData.set(this.dataService.getEventServiceData())
    this.serviceNames = Object.keys(this.servicesData())

    this.initialiseBookingForm()

    this.userService.loggedUser$.subscribe(user => {
      this.bookingForm.get('user')?.setValue(user?.user)
      this.bookingForm.get('userId')?.setValue(user?.id)
    })

    this.bookingService.getAllEvents().subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('getAllEvents response: ', res.body?.data);
        this.eventsList = res.body?.data
        this.eventsArray = res.body?.extra
      },
      error: (error: HttpErrorResponse) => {
        console.log('getAllEvents error: ', error.error.message, error);
      }
    })
  }


  initialiseBookingForm() {
    this.bookingForm = new FormGroup({
      _id: new FormControl(this.bookingFromObj._id),
      user: new FormControl(this.bookingFromObj.user, [Validators.required]),
      userId: new FormControl(this.bookingFromObj.userId, [Validators.required]),
      serviceId: new FormControl(this.bookingFromObj.serviceId, [Validators.required]),
      providerId: new FormControl(this.bookingFromObj.providerId, [Validators.required]),
      // eventId: new FormControl(this.bookingFromObj.eventId, [Validators.required]),
      event: new FormControl(this.bookingFromObj.event, [Validators.required]),
      style: new FormControl(this.bookingFromObj.style, [Validators.required]),
      services: new FormArray(
        this.bookingFromObj.services.map((service) => {
          return new FormGroup({
            providerId: new FormControl(service.providerId),
            serviceName: new FormControl(service.serviceName),
            choiceName: new FormControl(service.choiceName),
            choiceType: new FormControl(service.choiceType),
            choicePrice: new FormControl(service.choicePrice),
          })
        })
      ),
      deliveryDate: new FormControl(this.bookingFromObj.deliveryDate, [Validators.required]),
      venue: new FormGroup({
        building: new FormControl(this.bookingFromObj.venue.building, [Validators.required]),
        street: new FormControl(this.bookingFromObj.venue.street, [Validators.required]),
        city: new FormControl(this.bookingFromObj.venue.city, [Validators.required]),
        district: new FormControl(this.bookingFromObj.venue.district, [Validators.required]),
        state: new FormControl(this.bookingFromObj.venue.state, [Validators.required]),
        pbNo: new FormControl(this.bookingFromObj.venue.pbNo === 0 ? null : this.bookingFromObj.venue.pbNo, [Validators.required]),
      }),
      totalCount: new FormControl(this.bookingFromObj.totalCount === 0 ? null : this.bookingFromObj.totalCount, [Validators.required]),
    })
  }

  get services(): FormArray {
    return this.bookingForm.get('services') as FormArray;
  }

  bookEvent(serviceId: string, providerId: string) {
    this.showModal()
  }

  getServices(event: Event) {
    console.log((<HTMLInputElement>event.target).value);
    const eventName = (<HTMLInputElement>event.target).value
    this.bookingService.getServicesByEvent(eventName).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('getServicesByEvent response: ', res.body?.data, res.body?.extra);
        const services = res.body?.extra
        this.decor = services.decor
        this.dining = services.dining
        this.cuisine = services.cuisine
        this.coverage = services.coverage
      },
      error: (error: HttpErrorResponse) => {
        console.log('getAllEvents error: ', error.error.message, error);
      }
    })

  }

  getDistricts(event: Event) {
    console.log(event);
    const state = (<HTMLSelectElement>event.target).value
    console.log(Districts[state]);
    this.districtsList = Districts[state]
    // if(event in Districts){
    //   console.log(Districts[event]);
    // }else {
    //   console.log("No districts found for the provided state.");
    // }
  }

  saveBooking() {
    console.log('event booking form values: ', this.bookingForm.value);
    console.log('is event booking form valid: ', this.bookingForm.valid);

    this.bookingService.createBooking(this.bookingForm.value).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === 200) {
          console.log('service booking response: ', res.body?.data);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')
          this.hideModal()
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message || '')
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('service booking error: ', error.error.message, error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })

  }

  isOption(name: string) {
    // console.log('choiceName to check isOption: ', name);

    const serviceArray = <FormArray>this.bookingForm.get('services')
    const isOption = serviceArray.value.some((service: any) => {
      return service.choiceName === name
    })
    // console.log('value of isOption: ', isOption);
    return isOption
  }

  setServiceCheckboxes(choicename: string, choicePrice: number, providerId: string, serviceName: string) {
    const choicesArray = <FormArray>this.bookingForm.get('services')
    let choiceNameSelected = ''
    let choiceTypeSelected = ''
    let choicePriceSelected = 0
    let serviceNameSelected = ''
   
    let selectedServiceArray = this.cuisine.filter(service => service.providerId === providerId && service.name === choicename)
    console.log('selectedServiceArray value: ', selectedServiceArray);

    if(serviceName === 'cuisine'){
      choiceNameSelected = 'Menu'
      choiceTypeSelected = selectedServiceArray[0].name
      choicePriceSelected = selectedServiceArray[0].price
      serviceNameSelected = 'Catering'
    }else if(serviceName === 'coverage'){
      let selectedServiceArray = this.coverage.filter(service => service.providerId === providerId && service.name === choicename)
      choiceNameSelected = selectedServiceArray[0].name
      choicePriceSelected = selectedServiceArray[0].price
      serviceNameSelected = 'Event Coverage'
    }
   
    choicesArray.push(new FormGroup({
      serviceName: new FormControl(serviceNameSelected),
      providerId: new FormControl(providerId),
      choiceName: new FormControl(choiceNameSelected),
      choiceType: new FormControl(choiceTypeSelected),
      choicePrice: new FormControl(choicePriceSelected),
    }))
    console.log('choiceArray value: ', choicesArray);

  }

  setServiceDropdowns(event: Event, service: string) {
    let target = <HTMLSelectElement>event.target
    let selectedOptions = target.options[target.selectedIndex]
    console.log('setChoices target value:', target, selectedOptions.value, selectedOptions.getAttribute('data-extra'));

    let providerId = selectedOptions.getAttribute('data-extra')
    const choicesArray = <FormArray>this.bookingForm.get('services')

    let choiceNameSelected = ''
    let choiceTypeSelected = ''
    let choicePriceSelected = 0
    let serviceNameSelected = ''


    if (service === 'decor') {
      let selectedServiceArray = this.decor.filter(service => service.providerId === providerId && service.name === target.value)
      choiceNameSelected = selectedServiceArray[0].name
      choicePriceSelected = selectedServiceArray[0].price
      serviceNameSelected = 'Decor'
    } else if (service === 'dining') {
      let selectedServiceArray = this.dining.filter(service => service.providerId === providerId && service.name === target.value)
      choiceNameSelected = 'Dining'
      choiceTypeSelected = selectedServiceArray[0].name
      choicePriceSelected = selectedServiceArray[0].price
      serviceNameSelected = 'Catering'
    } 
    // else if (service === 'cuisine') {
    //   let selectedServiceArray = this.cuisine.filter(service => service.providerId === providerId && service.name === target.value)
    //   choiceNameSelected = 'Menu'
    //   choiceTypeSelected = selectedServiceArray[0].name
    //   choicePriceSelected = selectedServiceArray[0].price
    //   serviceNameSelected = 'Catering'
    // } else if (service === 'coverage') {
    //   let selectedServiceArray = this.coverage.filter(service => service.providerId === providerId && service.name === target.value)
    //   choiceNameSelected = selectedServiceArray[0].name
    //   choicePriceSelected = selectedServiceArray[0].price
    //   serviceNameSelected = 'Event Coverage'
    // }

    choicesArray.push(new FormGroup({
      serviceName: new FormControl(serviceNameSelected),
      providerId: new FormControl(providerId),
      choiceName: new FormControl(choiceNameSelected),
      choiceType: new FormControl(choiceTypeSelected),
      choicePrice: new FormControl(choicePriceSelected),
    }))

    // console.log('choiceArray value: ', choicesArray);

  }

  formNext() {
    this.step.set(this.step() + 1)
    console.log('step 1 from value: ', this.bookingForm.value);
    this.dataService.setBookingFormData(this.bookingForm.value)
    this.bookingFromObj = this.dataService.getBookingFormData()
    this.initialiseBookingForm()
  }

  formPrevious() {
    this.step.set(this.step() - 1)
    console.log('step 2 from value: ', this.bookingForm.value);
    this.dataService.setBookingFormData(this.bookingForm.value)
    this.bookingFromObj = this.dataService.getBookingFormData()
    this.initialiseBookingForm()

    const formArray = (<FormArray>this.bookingForm.get('services'))
    console.log('step 2 formArray value: ', formArray.value);

    // this.optionArray = formArray.value
    // formArray.value.forEach((service: any) => {
    //     this.isOption(service.serviceName)
    //   })

    // formArray.controls.forEach((control: any) => {
    //  const serviceName= control.get('serviceName')?.value
    //  const isChecked=this.isOption(serviceName)
    //  control.patchValue({checked:isChecked})

    // })

  }

  //   onOptionClick(name:string,price:number,providerId:string,serviceName:string){
  // console.log('selected service details:',name,price,providerId,serviceName);

  //   }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
    this.bookingForm.reset()
    this.bookingFromObj = new Booking()
    this.initialiseBookingForm()
  }
}
