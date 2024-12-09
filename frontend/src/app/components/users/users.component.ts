import { Component, ElementRef, inject, OnChanges, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserSearchFilter, User } from '../../model/class/userClass';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../shared/components/form/form.component';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HttpParams } from '@angular/common/http';
import { IUser } from '../../model/interface/interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormComponent, ButtonComponent, AlertComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users$: any = []
  users = signal<IUser[]>([])

  userFormObj: User = new User()
  searchFilterFormObj: UserSearchFilter = new UserSearchFilter()
  // searchParams:any

  isAddUser: boolean = false

  searchParams = new HttpParams()
  totalUsers: number = 0

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
    this.searchParams = this.searchParams
      .set('pageNumber', this.searchFilterFormObj.pageNumber)
      .set('pageSize', this.searchFilterFormObj.pageSize)
    this.getUsers(this.searchParams)
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
    this.userServices.getUsersCount().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.totalUsers = res.data
          console.log('total users count: ', this.totalUsers);

        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)
        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)
      }
    })
  }

  getTotalPages() {
    let totalPages = Math.ceil(this.totalUsers / Number(this.searchFilterFormObj.pageSize))
    return Array(totalPages).fill(0).map((e, i) => i + 1)
  }

  getLastpage() {
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
    this.userServices.getAllUsers(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.users$ = res.data
          this.users.set(res.data)
        } else {
          console.log('could not get users');
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  editUser(userId: string) {
    console.log('id to edit user: ', userId);
    let { id, _id, ...rest } = this.userForm.value
    let data = rest
    console.log('user update data:', data);

    this.userServices.editUser(data, userId).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('update user response: ', res.data);
          this.alertService.getAlert('alert alert-success', 'Success!', res.message)
          this.getUsers(this.searchParams)
          // this.getUsers()
          this.hideModal()
        } else {
          console.log('could not get users', res.message);
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })

  }

  saveUser() {
    const { id, _id, ...rest } = this.userForm.value
    const data = rest
    // this.userFormObj.id=0
    console.log('create user data:', this.userForm.value);
    this.userServices.registerUser(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('update user response: ', res.userData);
          this.alertService.getAlert('alert alert-success', 'Success!', res.message)
          this.getUsers(this.searchParams)
          this.getTotalUsers()
          this.hideModal()
        } else {
          console.log('could not get users', res.message);
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })

  }

  onEdit(userId: string) {
    this.userServices.getUserById(userId).subscribe({
      next: (res: any) => {
        this.userFormObj = res.data
        // console.log(this.userFormObj);
        this.initialiseUserForm()
        this.showModal()
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  setStatus(userId: string) {
    console.log(userId);
    this.userServices.editStatus(userId).subscribe({
      next: (res: any) => {
        console.log('edit status response: ', res);
        if (res.success) {
          this.getUsers(this.searchParams)

          this.alertService.getAlert('alert alert-success', 'Success!', res.message)

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }

      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

      }
    })
  }

  verifyUser(userId: string) {
    this.userServices.verifyUser(userId).subscribe({
      next: (res: any) => {
        console.log('verify user response: ', res);
        if (res.success) {
          this.getUsers(this.searchParams)

          this.alertService.getAlert('alert alert-success', 'Success!', res.message)

        } else {
          this.alertService.getAlert('alert alert-danger', 'Failed!', res.message)

        }

      },
      error: (error: any) => {
        console.log(error);
        this.alertService.getAlert('alert alert-danger', 'Failed!', error.message)

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


}
