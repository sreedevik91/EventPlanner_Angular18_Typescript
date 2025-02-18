import { Component, computed, ElementRef, inject, OnChanges, OnDestroy, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserSearchFilter, User } from '../../model/class/userClass';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpStatusCodes, IResponse, IUser } from '../../model/interface/interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormComponent, ButtonComponent, AlertComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export default class UsersComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>()

  // users$: any = []
  users = signal<IUser[]>([])

  userFormObj: User = new User()
  searchFilterFormObj: UserSearchFilter = new UserSearchFilter()
  // searchParams:any

  isAddUser: boolean = false

  searchParams = new HttpParams()
  totalUsers:number=0
  // totalUsers= signal<number>(0)
  // totalUsers= computed(()=>this.users().length)


  @ViewChild('modal') formModal!: ElementRef

  userForm: FormGroup = new FormGroup({})
  searchFilterForm: FormGroup = new FormGroup({})

  userServices = inject(UserSrerviceService)
  alertService = inject(AlertService)

  currentPage: number = Number(this.searchFilterFormObj.pageNumber)

  constructor() {
    this.getTotalUsers()
    this.initialiseUserForm()
    this.initialiseSearchFilterForm()
  }

  ngOnInit() {
    // this.searchParams = this.searchParams
    //   .set('pageNumber', this.searchFilterFormObj.pageNumber)
    //   .set('pageSize', this.searchFilterFormObj.pageSize)
    // this.getUsers(this.searchParams)
    this.onRefresh()
    console.log('total users count beginning: ', this.totalUsers);
  }

  initialiseUserForm() {
    this.userForm = new FormGroup({
      _id: new FormControl(this.userFormObj._id),
      name: new FormControl(this.userFormObj.name, [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]),
      email: new FormControl(this.userFormObj.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      username: new FormControl(this.userFormObj.username, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(this.userFormObj.password, [Validators.required, Validators.minLength(8)]),
      mobile: new FormControl(this.userFormObj.mobile, [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
      role: new FormControl(this.userFormObj.role),
    })
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      userName: new FormControl(this.searchFilterFormObj.userName),
      userStatus: new FormControl(this.searchFilterFormObj.userStatus),
      role: new FormControl(this.searchFilterFormObj.role),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder),
    })
  }


  onRefresh() {
    this.searchParams = new HttpParams()
    this.searchFilterForm.get('userName')?.setValue('')
    this.searchFilterForm.get('userStatus')?.setValue('')
    this.searchFilterForm.get('role')?.setValue('')
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getUsers(this.searchParams)
  }

  onSort(value: string) {
    this.searchParams = this.searchParams.set('sortBy', value)
    this.searchFilterFormObj.sortOrder = this.searchFilterFormObj.sortOrder === 'asc' ? 'desc' : 'asc'
    this.searchParams = this.searchParams.set('sortOrder', this.searchFilterFormObj.sortOrder)
    this.getUsers(this.searchParams)
  }

  onSearch() {
    // debugger
    console.log(this.searchFilterForm.value);
    this.searchFilterFormObj = this.searchFilterForm.value
    this.searchParams = this.searchParams
      .set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
      .set('sortBy', this.searchFilterFormObj.sortBy)
      .set('sortOrder', this.searchFilterFormObj.sortOrder)

    if (this.searchFilterFormObj.userName !== '') {
      this.searchParams = this.searchParams.set('userName', this.searchFilterFormObj.userName)
    }

    if (this.searchFilterFormObj.userStatus !== '') {
      this.searchParams = this.searchParams.set('userStatus', this.searchFilterFormObj.userStatus)
    }

    if (this.searchFilterFormObj.role !== '') {
      this.searchParams = this.searchParams.set('role', this.searchFilterFormObj.role)
    }

    this.getUsers(this.searchParams)
  }

  getTotalUsers() {
    this.userServices.getUsersCount().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          this.totalUsers = res.body?.data
          // this.totalUsers.set( res.body?.data)
          console.log('total users count: ', this.totalUsers);

        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)
      }
    })
  }

  getTotalPages() {
    console.log('total users count from getTotalPages: ', this.totalUsers);
    let totalPages = Math.ceil(this.totalUsers / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
    console.log('total users count from getLastpage: ', this.totalUsers);
    return Math.ceil(this.totalUsers / Number(this.searchFilterFormObj.pageSize))
  }

  onPageChange(page: number) {
    // debugger
    this.currentPage = page
    this.searchFilterFormObj.pageNumber = page.toString()
    this.searchParams = this.searchParams.set('pageNumber', this.searchFilterFormObj.pageNumber)
    console.log('pageNumber: ', this.searchFilterFormObj.pageNumber);
    this.getUsers(this.searchParams)
  }

  getUsers(params: HttpParams) {
    this.userServices.getAllUsers(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.users$ = res.body?.data
          this.users.set(res.body?.data)
        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }

  editUser(userId: string) {
    console.log('id to edit user: ', userId);
    let { id, _id, ...rest } = this.userForm.value
    let data = rest
    console.log('user update data:', data);

    this.userServices.editUser(data, userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('update user response: ', res.body?.data);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')
          this.getUsers(this.searchParams)
          // this.getUsers()
          this.hideModal()
        } else {
          console.log('could not get users', res.body?.message);
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })

  }

  saveUser() {
    const { id, _id, ...rest } = this.userForm.value
    const data = rest
    // this.userFormObj.id=0
    console.log('create user data:', this.userForm.value);
    this.userServices.registerUser(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        if (res.status === HttpStatusCodes.CREATED) {
          console.log('add user response: ', res.body?.data);
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')
          this.getUsers(this.searchParams)
          this.totalUsers+=1
          // this.getTotalUsers()
          this.hideModal()
        } else {
          console.log('could not get users', res.body?.message);
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })

  }

  onEdit(userId: string) {
    this.userServices.getUserById(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        this.userFormObj = res.body?.data
        // console.log(this.userFormObj);
        this.initialiseUserForm()
        this.showModal()
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }

  setStatus(userId: string) {
    console.log(userId);
    this.userServices.editStatus(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('edit status response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.getUsers(this.searchParams)
          this.users.update(users =>
            users.map(user =>
              user._id === userId ? { ...user, isActive: !user.isActive } : user
            )
          )

          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }

  verifyUser(userId: string) {
    this.userServices.verifyUser(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: HttpResponse<IResponse>) => {
        console.log('verify user response: ', res);
        if (res.status === HttpStatusCodes.SUCCESS) {
          // this.getUsers(this.searchParams)
          this.users.update(users =>
            users.map(user =>
              user._id === userId ? { ...user, isUserVerified: !user.isUserVerified } : user
            )
          )
          this.alertService.getAlert('alert alert-success', 'Success!', res.body?.message || '')

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.body?.message || '')

        }

      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.error.message)

      }
    })
  }

  hideModal() {
    this.formModal.nativeElement.style.display = 'none'
    this.userForm.reset()
    this.isAddUser = false
  }

  showModal() {
    this.formModal.nativeElement.style.display = 'block'
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
