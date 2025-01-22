
import { Component, inject, OnInit, signal } from '@angular/core';
import { Chat, ChatSearchFilter, IChat } from '../../model/class/chatClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ChatService } from '../../services/chatService/chat.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { IChatJoiningResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})

export class UserChatComponent implements OnInit {

  chatService = inject(ChatService)

  chatFormObj: Chat = new Chat()
  searchFilterFormObj: ChatSearchFilter = new ChatSearchFilter()

  chatForm: FormGroup = new FormGroup({})
  searchFilterForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  chats = signal<IChat[]>([])
  userService = inject(UserSrerviceService);

  notification: string[] = []
  messages: any[] = []
  newChats: any[] = []
  typing: string = ''
  roomId: string = ''
  userName: string = ''
  userId: string = ''
  oldChats:boolean=false
  isLeftChat:boolean=false

  ngOnInit(): void {

    this.initialiseChatForm()

    this.userService.loggedUser$.subscribe((user) => {
      if (user) {
        console.log(user);
        this.userName = user.user
        this.userId = user.id
        this.chatForm.get('userId')?.setValue(user.id)

        if (user.role !== 'admin') {
          this.chatForm.get('chats')?.patchValue({ sender: user.user, receiver: 'Admin' })
        } else {
          this.chatForm.get('chats')?.patchValue({ sender: user.user })
        }
        // this.chatForm.get('chats.sender')?.setValue(user.username) // alternate way
      }
    })

    this.chatService.getChatsByUser(this.userId).subscribe({
      next: (res: any) => {
        console.log('user chats from db:', res.body.data);
        const chats = res.body.data
        for (let chat of chats) {
          this.messages.push(chat)
        }
        console.log('user messages array:', this.messages);
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })

    this.startChat()
    this.getMessage()
    this.getJoiningNotification()
    this.getLeavingNotification
    this.getTypingNotification()

  }

  initialiseChatForm() {
    this.chatForm = new FormGroup({
      // _id: new FormControl(this.chatFormObj._id),
      userId: new FormControl(this.chatFormObj.userId, [Validators.required]),
      roomId: new FormControl(this.chatFormObj.roomId, [Validators.required]),
      chats: new FormGroup({
        sender: new FormControl(this.chatFormObj.chats.sender, [Validators.required]),
        receiver: new FormControl(this.chatFormObj.chats.receiver, [Validators.required]),
        message: new FormControl(this.chatFormObj.chats.message, [Validators.required]),
        date: new FormControl(new Date())
      })
    })
  }

  initialiseSearchFilterForm() {
    this.searchFilterForm = new FormGroup({
      userName: new FormControl(this.searchFilterFormObj.userName),
      pageNumber: new FormControl(this.searchFilterFormObj.pageNumber),
      pageSize: new FormControl(this.searchFilterFormObj.pageSize),
      sortBy: new FormControl(this.searchFilterFormObj.sortBy),
      sortOrder: new FormControl(this.searchFilterFormObj.sortOrder),
    })
  }

  startChat() {
    this.oldChats=false
    this.isLeftChat=false
    this.chatService.startChat(this.userName, this.userId)
  }

  sendMessage() {
    console.log(this.chatForm.value);
    this.chatService.sendMessage(this.chatForm.value)
    this.chatForm.get('chats.message')?.setValue('')
    this.typing = ''
  }

  startedTyping() {
    this.chatService.typing(this.userName, this.userId)
  }

  leaveChat() {
    this.isLeftChat=true
    this.chatService.leaveRoom(this.userName, this.userId)
  }

  getMessage() {
    this.chatService.getMessage().subscribe({
      next: (data: any) => {
        console.log('sent message from server:', data);
        this.messages.push(data)
        this.newChats.push(data)
        // this.newChats=data
        console.log('user messages array:', this.messages);
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getTypingNotification() {
    this.chatService.getTypingNotificatrion().subscribe({
      next: (notification: string) => {
        console.log('TypingNotificatrion from server:', notification);
        this.typing = notification
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getJoiningNotification() {
    this.chatService.getJoiningNotificatrion().subscribe({
      next: (notification: any) => {
        console.log('JoiningNotificatrion from server:', notification);
        this.notification.push(notification.message)
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getStartChatNotification() {
    this.chatService.getStartChatNotificatrion().subscribe({
      next: (notification: any) => {
        console.log('start chat notificatrion from server:', notification);
        this.roomId = notification.roomId
        console.log('user room id from start chat notificatrion: ', this.roomId);

        // this.chatForm.get('roomId')?.setValue(this.roomId)
        this.chatForm.patchValue({ roomId: this.roomId })
        this.notification.push(notification.message)
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getLeavingNotification() {
    this.chatService.getLeavingNotificatrion().subscribe({
      next: (notification: string) => {
        console.log('LeavingNotificatrion from server:', notification);
        this.notification.push(notification)
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

}
