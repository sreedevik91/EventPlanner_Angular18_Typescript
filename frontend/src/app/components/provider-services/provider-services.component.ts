import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Service, ServiceSearchFilter } from '../../model/class/serviceClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ILoggedUserData, IService } from '../../model/interface/interface';
import { ServiceService } from '../../services/serviceService/service.service';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Catering, Decor, EventCoverage } from '../../model/eventServicesOptions';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormComponent, AlertComponent],
  templateUrl: './provider-services.component.html',
  styleUrl: './provider-services.component.css'
})
export class ProviderServicesComponent implements OnInit {

  serviceFromObj: Service = new Service()
  searchFilterFormObj: ServiceSearchFilter = new ServiceSearchFilter()

  @ViewChild('modal') formModal!: ElementRef

  serviceForm: FormGroup = new FormGroup({})
  searchFilterForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  serviceService = inject(ServiceService)
  userService = inject(UserSrerviceService)
  alertService = inject(AlertService)

  isAddService: boolean = true
  currentPage: number = Number(this.searchFilterFormObj.pageNumber)
  totalServices: number = 0
  services = signal<IService[]>([])

  choice: string[] = []
  type: string[][] = []
  isType: boolean = false
  providerId: string = ''

imgUrl: string | ArrayBuffer | null=''
choiceImageUrl:( string | ArrayBuffer | null )[]=[]

  constructor() {
    this.initialiseServiceForm()
    this.getTotalServices()
    this.initialiseSearchFilterForm()
  }
  ngOnInit(): void {
    this.userService.loggedUser$.subscribe((user: any) => {
      this.providerId = user.id
      console.log(this.providerId, user);

    })
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllServices(this.searchParams)
  }

  // initialiseServiceForm() {
  //   this.serviceForm = new FormGroup({
  //     _id: new FormControl(this.serviceFromObj._id),
  //     name: new FormControl(this.serviceFromObj.name, [Validators.required]),
  //     img: new FormControl(this.serviceFromObj.img || null, [Validators.required]),
  //     provider: new FormControl(this.serviceFromObj.provider, [Validators.required]),
  //     // events: new FormArray([
  //     //   new FormControl(this.serviceFromObj.events, [Validators.required])
  //     // ]),
  //     events: this.isAddService ? new FormArray([
  //       new FormControl(this.serviceFromObj.events, [Validators.required])
  //     ])
  //       :
  //       new FormArray(
  //         this.serviceFromObj.events.map((event) => {
  //           return new FormControl(event, [Validators.required])
  //         })
  //       ),
  //     choices: new FormArray(
  //       (this.serviceFromObj.choices).map((choice) => {
  //         return new FormGroup({
  //           choiceName: new FormControl(choice.choiceName, [Validators.required]),
  //           choiceType: new FormControl(choice.choiceType, [Validators.required]),
  //           choicePrice: new FormControl(choice.choicePrice === 0 ? null : choice.choicePrice, [Validators.required]),
  //           choiceImg: new FormControl(choice.choiceImg || null, [Validators.required]),
  //         })
  //       })

  //     )
  //   })
  // }


  initialiseServiceForm() {
    this.serviceForm = new FormGroup({
      _id: new FormControl(this.serviceFromObj._id),
      name: new FormControl(this.serviceFromObj.name, [Validators.required]),
      provider: new FormControl(this.serviceFromObj.provider, [Validators.required]),
      // events: new FormArray([
      //   new FormControl(this.serviceFromObj.events, [Validators.required])
      // ]),
      events: this.isAddService ? new FormArray([
        new FormControl(this.serviceFromObj.events, [Validators.required])
      ])
        :
        new FormArray(
          this.serviceFromObj.events.map((event) => {
            return new FormControl(event, [Validators.required])
          })
        ),
      choices: new FormArray(
        (this.serviceFromObj.choices).map((choice) => {
          return new FormGroup({
            choiceName: new FormControl(choice.choiceName, [Validators.required]),
            choiceType: new FormControl(choice.choiceType, [Validators.required]),
            choicePrice: new FormControl(choice.choicePrice === 0 ? null : choice.choicePrice, [Validators.required]),
          })
        })

      )
    })
  }




  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      serviceName: new FormControl(this.searchFilterFormObj.serviceName),
      isApproved: new FormControl(this.searchFilterFormObj.isApproved),
      provider: new FormControl(this.searchFilterFormObj.provider),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder),
    })
  }

  getChoiceOptions() {
    const service = this.serviceForm.get('name')?.value
    if (service === 'Catering') {
      this.choice = Catering.choicesName
      this.isType = true
    } else if (service === 'Decor') {
      this.choice = Decor.choicesName
      this.isType = false
    } else if (service === 'Event Coverage') {
      this.choice = EventCoverage.choicesName
      this.isType = false
    }
  }

  getEvents() {
    const events = (<FormArray>this.serviceForm.get('events'))['controls']

    console.log('events array: ', events.forEach((e) => {
      console.log(e);
    }));

    return events
  }
  addEvent() {
    (<FormArray>this.serviceForm.get('events')).push(new FormControl(this.serviceFromObj.events, [Validators.required]))
  }

  closeEvent(index: number) {
    const events = (<FormArray>this.serviceForm.get('events'))
    events.removeAt(index)
  }

  getChoices() {
    const choices = ((<FormArray>this.serviceForm.get('choices'))['controls'])
    console.log('choices array: ', choices);

    return choices
  }

  getChoiceImg(index: number) {

    const choiceControl = (<FormArray>this.serviceForm.get('choices')).at(index)
    console.log('choiceControl array: ', choiceControl);

    return choiceControl?.get('choiceImg')?.value ? choiceControl?.get('choiceImg')?.value : this.choiceImageUrl[index]

    // return this.choiceImageUrl[index]

  }

  closeChoice(index: number) {
    const choice = (<FormArray>this.serviceForm.get('choices'))
    choice.removeAt(index)
  }

  addChoice() {
    const choiceFormGroup = new FormGroup({
      choiceName: new FormControl(null, [Validators.required]),
      choiceType: new FormControl(null, [Validators.required]),
      choicePrice: new FormControl(null, [Validators.required]),
      choiceImg: new FormControl(null, [Validators.required]),

    });

    (<FormArray>this.serviceForm.get('choices')).push(choiceFormGroup)
  }

  getChoiceTypeOptions(index: number) {
    const choiceControl = <FormArray>this.serviceForm.get('choices')
    const choiceGroup = choiceControl.at(index)
    const value = choiceGroup.value.choiceName

    if (value === 'Menu') {
      this.type[index] = Catering.menuTypes
    } else if (value === 'Dining') {
      this.type[index] = Catering.diningTypes
    }
  }

  onImageUpload(event: Event, controlName: string, index?: number) {
    console.log('onImageUpload: ', event);
    const input = <HTMLInputElement>event.target
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      let imageurl: string | ArrayBuffer | null = ''

      let reader = new FileReader
      reader.readAsDataURL(file)
      reader.onload = (event:Event) => {
        imageurl =(<FileReader> event.target).result
        if (controlName === 'img') {
          this.serviceForm.get('img')?.setValue(imageurl)
          this.imgUrl=imageurl
        } else if (controlName === 'choiceImg' && index !== undefined) {
          const choiceArray = <FormArray>this.serviceForm.get('choices')
          const choiceGroup = choiceArray.at(index)
          choiceGroup.get('choiceImg')?.setValue(imageurl)
          this.choiceImageUrl[index]=imageurl

        }
      }
     
    }
  }

  getTotalServices() {
    this.serviceService.getTotalServices().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.totalServices = res.body.data
        } else {
          console.log(res.body.message);
          // this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        // this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })
  }

  onRefresh() {
    this.searchParams = new HttpParams()
    this.searchFilterForm.get('serviceName')?.setValue('')
    this.searchFilterForm.get('provider')?.setValue('')
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getAllServices(this.searchParams)
  }

  onSearch() {
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('sortBy', this.searchFilterFormObj.sortBy)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)

    if (this.searchFilterFormObj.serviceName !== '') {
      this.searchParams = this.searchParams.set('serviceName', this.searchFilterFormObj.serviceName)
    }

    if (this.searchFilterFormObj.provider !== '') {
      this.searchParams = this.searchParams.set('provider', this.searchFilterFormObj.provider)
    }

    this.getAllServices(this.searchParams)

  }

  onSort(value: string) {
    this.searchFilterFormObj.sortOrder = this.searchFilterFormObj.sortOrder === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortBy', value)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)
    this.getAllServices(this.searchParams)

  }

  getAllServices(params: HttpParams) {
    this.serviceService.getAllServices(params).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.services.set(res.body.data)
          console.log('total services: ', this.services());
        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)
      }
    })
  }

  onAddService() {
    this.isAddService = true
    this.showModal()
  }

  onEdit(id: string) {
    this.isAddService = false
    this.serviceService.getServiceById(id).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.serviceFromObj = res.body.data
          console.log('update form data: ', this.serviceFromObj);
          this.initialiseServiceForm()
          this.getChoiceOptions()
          this.showModal()
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)
      }
    })
  }

  setStatus(id: string) {
    console.log(id);
    this.serviceService.editStatus(id).subscribe({
      next: (res: HttpResponse<any>) => {
        console.log('edit status response: ', res);
        if (res.status === 200) {
          this.getAllServices(this.searchParams)

          this.alertService.getAlert('alert alert-success', 'Success!', res.body.message)

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body.message)

        }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  saveService() {
    console.log(this.serviceForm.errors);
    this.serviceForm.get('provider')?.setValue(this.providerId)
    console.log(this.serviceForm.value);
    const { _id, ...rest } = this.serviceForm.value
    console.log('data to add new service: ', rest);

    this.serviceService.createService(rest).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.hideModal()
          this.getAllServices(this.searchParams)
          this.alertService.getAlert('alert alert-success', 'Success!', res.body.message)
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })

  }

  editService(id: string) {
    console.log('id to edit user: ', id);
    let { _id, ...rest } = this.serviceForm.value
    let data = rest
    console.log('user update data:', data);

    this.serviceService.editService(data, id).subscribe({
      next: (res: HttpResponse<any>) => {
        debugger
        if (res.status === 200) {
          console.log('update user response: ', res.body);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body.message || 'Service updated')
          this.hideModal()
          this.getAllServices(this.searchParams)
        } else {
          console.log('could not get service', res.body.message || '');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body.message || '')

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  deleteService(id: string) {
    this.serviceService.deleteService(id).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body.message)
          this.getTotalServices()
          this.getAllServices(this.searchParams)
        } else {
          console.log(res.body.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body.message)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Register User Failed", error.message)

      }
    })
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.searchFilterFormObj.pageNumber = page.toString()
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
    this.getAllServices(this.searchParams)

  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalServices / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    return Math.ceil(this.totalServices / Number(this.searchFilterFormObj.pageSize))
  }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
    this.isAddService = true
    this.imgUrl=''
    this.choiceImageUrl=[]
    this.serviceForm.reset()
    this.serviceFromObj = new Service()
    this.initialiseServiceForm()
  }


}
