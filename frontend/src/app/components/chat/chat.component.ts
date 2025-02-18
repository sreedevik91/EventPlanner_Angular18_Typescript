import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { UserChatComponent } from '../user-chat/user-chat.component';
import { AdminChatComponent } from '../admin-chat/admin-chat.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UserChatComponent,AdminChatComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export default class ChatComponent implements OnInit, OnDestroy {

  destroy$:Subject<void>= new Subject<void>()

  userService = inject(UserSrerviceService);

  role: string = ''

  ngOnInit(): void {

    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        console.log(user);
        this.role = user.role
      }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
