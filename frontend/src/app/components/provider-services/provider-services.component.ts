import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { IChoice, Service, ServiceSearchFilter } from '../../model/class/serviceClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HttpStatusCodes, ILoggedUserData, IResponse, IService } from '../../model/interface/interface';
import { ServiceService } from '../../services/serviceService/service.service';
import { AlertService } from '../../services/alertService/alert.service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Catering, Decor, EventCoverage } from '../../model/constants/eventServicesOptions';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { environment } from '../../../environments/environment';
import { Subject, take, takeUntil } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormComponent, AlertComponent],
  templateUrl: './provider-services.component.html',
  styleUrl: './provider-services.component.css'
})
export class ProviderServicesComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  serviceFromObj: Service = new Service()
  searchFilterFormObj: ServiceSearchFilter = new ServiceSearchFilter()

  @ViewChild('modal') formModal!: ElementRef
  @ViewChild('serviceImgInput') serviceImgInput!: ElementRef<HTMLInputElement>
  @ViewChildren('choiceImgInput') choiceImgInputs!: QueryList<ElementRef<HTMLInputElement>>


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
  availableEvents = signal<string[]>([])

  choice: string[] = []
  type: string[][] = []
  isType: boolean = false
  providerId: string = ''
  provider: string = ''

  // serviceImgUrl: string = environment.serviceImgUrl

  imgUrl: string | ArrayBuffer | null = ''
  choiceImageUrl: (string | ArrayBuffer | null)[] = []

  constructor() { }

  ngOnInit(): void {
    this.initialiseServiceForm()
    this.getTotalServices()
    this.initialiseSearchFilterForm()
    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user: any) => {
      this.providerId = user.id
      this.provider = user.user
      console.log(this.providerId, user);

    })
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('providerId', this.providerId)
    this.getAllServices(this.searchParams)
    this.getAvailableEvents()
  }

  initialiseServiceForm() {
    this.serviceForm = new FormGroup({
      _id: new FormControl(this.serviceFromObj._id),
      name: new FormControl(this.serviceFromObj.name, [Validators.required]),
      img: new FormControl(this.serviceFromObj.img || null, [Validators.required]),
      provider: new FormControl(this.serviceFromObj.provider, [Validators.required]),
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
            choiceImg: new FormControl(choice.choiceImg || null, [Validators.required]),
            choiceImgCategory: new FormControl(choice.choiceImgCategory || null),
          })
        })

      )
    })
  }


  // initialiseServiceForm() {
  //   this.serviceForm = new FormGroup({
  //     _id: new FormControl(this.serviceFromObj._id),
  //     name: new FormControl(this.serviceFromObj.name, [Validators.required]),
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
  //         })
  //       })

  //     )
  //   })
  // }


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

    // console.log('events array: ', events.forEach((e) => {
    //   console.log(e);
    // }));

    return events
  }

  getAvailableEvents() {
    this.serviceService.getAvailableEvents().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('available events response: ',res );
          
          this.availableEvents.set(res.body?.data)
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

  addEvent() {
    (<FormArray>this.serviceForm.get('events')).push(new FormControl(this.serviceFromObj.events, [Validators.required]))
  }

  closeEvent(index: number) {
    const events = (<FormArray>this.serviceForm.get('events'))
    events.removeAt(index)
  }

  getChoices() {
    const choices = ((<FormArray>this.serviceForm.get('choices'))['controls'])
    // console.log('choices array: ', choices);
    return choices
  }

  getChoiceImg(index: number) {

    const choiceControl = (<FormArray>this.serviceForm.get('choices')).at(index)
    // console.log('choiceControl array: ', choiceControl);
    // console.log('choice images: ', choiceControl?.get('choiceImg')?.value);


    // return choiceControl?.get('choiceImg')?.value ? this.serviceImgUrl + choiceControl?.get('choiceImg')?.value : null
    return choiceControl?.get('choiceImg')?.value ? choiceControl?.get('choiceImg')?.value : null


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
      choiceImgCategory: new FormControl(null, [Validators.required]),

    });

    (<FormArray>this.serviceForm.get('choices')).push(choiceFormGroup)
  }

  getChoiceTypeOptions(index: number) {
    const choiceControl = <FormArray>this.serviceForm.get('choices')
    const choiceGroup = choiceControl.at(index)
    const value = choiceGroup.value.choiceName
    // console.log('getChoiceTypeOptions value:', value);

    if (value === 'Menu') {
      this.type[index] = Catering.menuTypes
    } else if (value === 'Dining') {
      this.type[index] = Catering.diningTypes
    }
  }

  getChoiceTypes(index: number) {
    const choiceControl = <FormArray>this.serviceForm.get('choices')
    const choiceGroup = choiceControl.at(index)
    const value = choiceGroup.value.choiceType
    let typesArr = new Set(this.type[index])
    typesArr.add(value)
    console.log('getChoiceTypes Array:', Array.from(typesArr));

    return Array.from(typesArr)

  }

  onImageUpload(event: Event, controlName: string, index?: number) {
    // console.log('onImageUpload: ', event);
    const input = <HTMLInputElement>event.target
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      let imageurl: string | ArrayBuffer | null = ''

      let reader = new FileReader
      reader.readAsDataURL(file)
      reader.onload = (event: Event) => {
        imageurl = (<FileReader>event.target).result || this.imgUrl
        if (controlName === 'img') {
          // this.serviceForm.get('img')?.setValue(imageurl)
          this.serviceForm.get('img')?.setValue(file)
          this.imgUrl = imageurl
        } else if (controlName === 'choiceImg' && index !== undefined) {
          const choiceArray = <FormArray>this.serviceForm.get('choices')
          const choiceGroup = choiceArray.at(index)
          // choiceGroup.get('choiceImg')?.setValue(imageurl)
          choiceGroup.get('choiceImg')?.setValue(file)
          // let fileNameCategory=choiceGroup.get('choiceName')?.value
          // let fileNameCategory=file.name || ''
          let fileNameCategory = file.name
          choiceGroup.get('choiceImgCategory')?.setValue(fileNameCategory)

          this.choiceImageUrl[index] = imageurl

        }
      }

    }
  }

  getTotalServices() {
    this.serviceService.getTotalServices().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.totalServices = res.body?.data
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
    this.serviceService.getAllServices(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('getAllServices res from provider panel: ', res.body);

          // this.totalServices=res.body.data.length
          this.services.set(res.body?.data.services)
          this.totalServices = res.body?.data.count

          // console.log('total services: ', this.services());
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

  onAddService() {
    this.isAddService = true
    this.showModal()
  }

  onEdit(id: string) {
    this.isAddService = false
    this.serviceService.getServiceById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.serviceFromObj = res.body?.data
          console.log('update form data: ', this.serviceFromObj);

          this.initialiseServiceForm()
          this.getChoiceOptions()

          const choicesArray = <FormArray>this.serviceForm.get('choices');
          // const choicesArray = <FormArray>this.serviceForm.get('choices');
          // choicesArray.clear(); // Clear existing controls
          // this.serviceFromObj.choices.forEach(choice => {
          //   choicesArray.push(new FormGroup({
          //     choiceName: new FormControl(choice.choiceName),
          //     choiceType: new FormControl(choice.choiceType),
          //     choicePrice: new FormControl(choice.choicePrice),
          //     choiceImg: new FormControl(choice.choiceImg)
          //   }));
          // });

          choicesArray.controls.forEach((_, index) => this.getChoiceTypeOptions(index));

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

  setStatus(id: string) {
    console.log(id);
    this.serviceService.editStatus(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('edit status response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.getAllServices(this.searchParams)
          this.services.update(services =>
            services.map(service =>
              service._id === id ? { ...service, isActive: !service.isActive } : service
            )
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

  saveService() {
    // console.log(this.serviceForm.errors);
    this.serviceForm.get('provider')?.setValue(this.providerId)
    console.log('service form values: ',this.serviceForm.value);
    const { _id, ...rest } = this.serviceForm.value
    console.log('data to add new service: ', rest);

    const formData = new FormData()

    formData.append('name', this.serviceForm.get('name')?.value)
    formData.append('provider', this.serviceForm.get('provider')?.value)
    formData.append('events', JSON.stringify(this.serviceForm.get('events')?.value))
    formData.append('img', this.serviceForm.get('img')?.value)

    let choices = this.serviceForm.get('choices')?.value || []
    // formData.append('choices',[])
    choices = choices.map((choice: any, index: number) => {
      const newChoices = {
        choiceName: choice.choiceName,
        choiceType: choice.choiceType || '',
        choicePrice: choice.choicePrice,
        choiceImg: choice.choiceImg,
        choiceImgCategory: choice.choiceImgCategory

      }
      formData.append(`choiceImg`, choice.choiceImg)
      return newChoices
    })

    formData.append('choices', JSON.stringify(choices))
    console.log('data to add new service: ', formData);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.serviceService.createService(formData).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.CREATED) {
          this.hideModal()
          // this.getTotalServices()
          this.totalServices += 1
          this.getAllServices(this.searchParams)
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message ? res.body?.message : '')
        } else {
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.getAlert("alert alert-danger", "Add Service Failed", error.error.message || '')

      }
    })

  }

  editService(id: string) {

    // console.log('service data to edit: ', this.serviceFromObj);
    let { _id, ...rest } = this.serviceForm.value
    let data = rest
    console.log('updated service data:', data);

    const formData = new FormData()

    formData.append('name', this.serviceForm.get('name')?.value)
    formData.append('provider', this.serviceForm.get('provider')?.value)
    formData.append('events', JSON.stringify(this.serviceForm.get('events')?.value))
    formData.append('img', this.serviceForm.get('img')?.value || data.img)

    let choices = this.serviceForm.get('choices')?.value || []
    // formData.append('choices',[])
    choices = choices.map((choice: IChoice, index: number) => {
      const newChoices = {
        choiceName: choice.choiceName,
        choiceType: choice.choiceType || '',
        choicePrice: choice.choicePrice,
        choiceImg: choice.choiceImg,
        choiceImgCategory: choice.choiceImgCategory
      }
      formData.append(`choiceImg`, choice.choiceImg)
      return newChoices
    })

    formData.append('choices', JSON.stringify(choices))

    console.log('edited service data: ', formData);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // debugger

    this.serviceService.editService(formData, id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('update user response: ', res.body);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || 'Service updated')
          this.hideModal()
          this.getTotalServices()
          this.getAllServices(this.searchParams)
        } else {
          console.log('could not get service', res.body?.message || '');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error?.message || error.statusText)

      }
    })
  }

  deleteService(id: string) {
    this.serviceService.deleteService(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')
          // this.getTotalServices()
          // this.getAllServices(this.searchParams)
          this.services.update(services =>
            services.filter(service => service._id !== id)
          )
          this.totalServices -= 1
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

  //   toggleCollapse(id: string, event: Event) {
  //     // debugger
  //     console.log('toggler element id: ', id);

  //     event.preventDefault();
  //     const collapseElement = document.getElementById(id);
  //     if (collapseElement) {
  //       const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
  //       if (collapseElement.classList.contains('show')) {
  //           bsCollapse.hide(); // Collapse it
  //       } else {
  //           bsCollapse.show(); // Expand it
  //       }
  //       console.log('collapseElement class: ',  collapseElement.classList);

  //         const button = event.target as HTMLElement;
  //         button.setAttribute('aria-expanded', collapseElement.classList.contains('show') ? 'true' : 'false');
  //         console.log('button aria-expanded class: ',  button.getAttribute('aria-expanded'));

  //       }
  // }


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
    this.imgUrl = ''
    this.choiceImageUrl = []
    this.serviceForm.reset()
    this.serviceFromObj = new Service()
    this.initialiseServiceForm()
    this.serviceImgInput.nativeElement.value = ''
    this.choiceImgInputs.toArray().forEach(input => {
      input.nativeElement.value = ''
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
