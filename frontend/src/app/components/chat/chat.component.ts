import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { UserChatComponent } from '../user-chat/user-chat.component';
import { AdminChatComponent } from '../admin-chat/admin-chat.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UserChatComponent,AdminChatComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  userService = inject(UserSrerviceService);

  role: string = ''

  ngOnInit(): void {

    this.userService.loggedUser$.subscribe((user) => {
      if (user) {
        console.log(user);
        this.role = user.role
      }
    })

  }

}
