import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookedServices, IResponse, IService } from '../../model/interface/interface';
import { environment } from '../../../environments/environment.development';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Booking } from '../../model/class/bookingClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../shared/components/form/form.component';
import { Districts } from '../../model/districtsList';
import { DataService } from '../../services/dataService/data.service';
import { BookingService } from '../../services/bookingService/booking.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { IChoice } from '../../model/class/serviceClass';
import { AlertService } from '../../services/alertService/alert.service';

@Component({
  selector: 'app-user-service-details',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormComponent],
  templateUrl: './user-service-details.component.html',
  styleUrl: './user-service-details.component.css'
})
export class UserServiceDetailsComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  bookingService = inject(BookingService)
  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)

  bookingFromObj: Booking = new Booking()

  bookingForm: FormGroup = new FormGroup({})

  @ViewChild('modal') formModal!: ElementRef

  statesList = Object.keys(Districts)
  districtsList: string[] = []

  dataService = inject(DataService)

  service: string = ''
  servicesByName = signal<IService[]>([])
  selectedService: Partial<IService> = {}
  optionArray: any[] = []
  serviceImgUrl = environment.serviceImgUrl

  step = signal<number>(1)

  ngOnInit(): void {
    this.service = this.dataService.getServiceName()
    this.servicesByName.set(this.dataService.getServiceData())

    this.initialiseBookingForm()

    this.userService.loggedUser$.subscribe(user => {
      console.log('user from service:', user);

      this.bookingForm.get('user')?.setValue(user?.user)
      this.bookingForm.get('userId')?.setValue(user?.id)
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
      services: new FormArray(
        this.bookingFromObj.services.map((service) => {
          return new FormGroup({
            // providerId: new FormControl(service.providerId),
            // serviceId: new FormControl(service.serviceId)
            // serviceName: new FormControl(service.serviceName),
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


  bookService(name: string, serviceId: string, providerId: string) {
    console.log('id to book service: ', serviceId, providerId);

    this.bookingForm.get('serviceId')?.setValue(serviceId)
    this.bookingForm.get('providerId')?.setValue(providerId)

    this.bookingService.getServicesByNameAndProvider(name, providerId).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('selected service details: ', res.body?.data);
        this.selectedService = res.body?.data
        this.optionArray = this.selectedService?.choices || []
      },
      error: (error: HttpErrorResponse) => {
        console.log('service booking error: ', error.error.message, error);

      }
    })

    // const servicesArray = <FormArray>this.bookingForm.get('services')
    // servicesArray.push(new FormGroup({
    //   serviceId: new FormControl(serviceId),
    //   providerId: new FormControl(providerId)
    // })
    // )

    this.showModal()
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
    console.log('service booking form values: ', this.bookingForm.value);
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

  isOption(name: string, choiceType:string,choiceImg:string) {
    console.log('choiceName to check isOption: ', name,choiceType,choiceImg);

    const serviceArray = <FormArray>this.bookingForm.get('services')
    console.log('serviceArray: ', serviceArray);
    
    const isOption = serviceArray.value.some((service: any) => {
      return service.choiceName === name && service.choiceType===choiceType && service.choiceImg===choiceImg
    })
    console.log('value of isOption: ', isOption);
    return isOption
  }

  setChoices(event: Event, index: number, name: string, type: string, price: number) {
    let target = <HTMLInputElement>event.target
    console.log('setChoices target value:', target, target?.checked);
    console.log('setChoices index value:', index);
    const choicesArray = <FormArray>this.bookingForm.get('services')

    if (target?.checked) {
      choicesArray.push(new FormGroup({
        choiceName: new FormControl(name),
        choiceType: new FormControl(type),
        choicePrice: new FormControl(price),
      }))
    } else {
      const indexN = choicesArray.controls.findIndex(group => {
        // Check if the form group matches based on the values you want to compare
        return group.get('choiceName')?.value === name &&
          group.get('choiceType')?.value === type &&
          group.get('choicePrice')?.value === price;
      });
      if (indexN !== -1) choicesArray.removeAt(indexN)
    }

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
