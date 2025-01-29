

import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Chat, ChatSearchFilter, IChat } from '../../model/class/chatClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { ChatService } from '../../services/chatService/chat.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { IChatJoiningResponse, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './admin-chat.component.html',
  styleUrl: './admin-chat.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminChatComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>

  chatService = inject(ChatService)

  chatFormObj: Chat = new Chat()
  searchFilterFormObj: ChatSearchFilter = new ChatSearchFilter()

  chatForm: FormGroup = new FormGroup({})
  searchFilterForm: FormGroup = new FormGroup({})

  searchParams = new HttpParams()

  chats = signal<IChat[]>([])
  userService = inject(UserSrerviceService);

  notification: string[] = []
  activeUsers: {userId:string,userName:string}[] = []
  messages: any[] = []
  newChats: any[] = []
  typing: string = ''
  roomId: string = ''
  userName: string = ''
  userId: string = ''
  isJoinedChat: boolean = false
  activeUser: string = ''
  oldChats: boolean = false

  showEmojiPicker: boolean = false

  recording: boolean = false
  mediaRecorder!: MediaRecorder;
  recordedChunks: any[] = []

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


    this.requestActiveUsers()
    this.getActiveUsers()
    this.getMessage()
    this.getAllChats()
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

  joinChat(userId: string) {
    debugger
    this.isJoinedChat = true
    this.activeUser = userId

    // this.chatService.getChatsByUser(this.activeUser).subscribe({
    //   next: (res: any) => {
    //     console.log('user chats from db:', res.body.data);
    //     const chats=res.body.data
    //     for(let item of chats){
    //       this.messages.push(item)
    //     }
    //     console.log('user messages array:', this.messages);
    //   },
    //   error: (error: any) => {
    //     console.log('error from getMessage:', error.message);
    //   }
    // })

    this.getAllChats()
    this.chatService.joinRoom(userId)
    this.getUserMessages()
  }

  requestActiveUsers() {
    this.chatService.activeUsers()
  }

  getAllChats() {
    this.chatService.getChatsByUser(this.activeUser).subscribe({
      next: (res: any) => {
        console.log('user chats from db:', res.body.data);
        const chatData = res.body.data
        this.messages = []
        for (let chat of chatData.chats) {
          this.messages.push(chat)
        }
        console.log('user messages array:', this.messages);
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  togglePrevChats() {
    this.oldChats = !this.oldChats
    this.getAllChats()
  }

  sendMessage() {
    this.chatForm.get('chats.type')?.setValue('text')
    console.log(this.chatForm.value);
    this.chatService.adminSendMessage(this.activeUser, this.chatForm.value)
    this.chatForm.get('chats.message')?.setValue('')
    this.typing = ''
  }

  startedTyping() {
    this.chatService.typing(this.userName, this.activeUser)
  }

  leaveChat() {
    this.isJoinedChat = false
    this.chatService.leaveRoom(this.userName, this.activeUser)
  }

  getMessage() {
    this.chatService.getMessage().subscribe({
      next: (data: any) => {
        console.log('sent message from server:', data);
        this.messages.push(data.chats)
        this.newChats.push(data)
        // this.newChats=data
        console.log('user messages array:', this.messages);

      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getUserMessages() {
    this.chatService.getUserMessage().subscribe({
      next: (data: any) => {
        console.log('user chats from socket:', data);

        this.newChats = data

        console.log('user messages array:', this.newChats);
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getActiveUsers() {
    this.chatService.getActiveUsers().subscribe({
      next: (data: any) => {
        console.log('ActiveUsers from server:', data);
        this.activeUsers = data
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
      next: (notification: IChatJoiningResponse) => {
        console.log('JoiningNotificatrion from server:', notification);
        this.roomId = notification.roomId
        console.log('admin joined room id from start JoiningNotificatrion:', this.roomId);

        // this.chatForm.get('roomId')?.setValue(this.roomId)
        this.chatForm.patchValue({ roomId: this.roomId })

        this.notification.push(notification.message)
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getStartChatNotification() {
    this.chatService.getStartChatNotificatrion().subscribe({
      next: (notification: IChatJoiningResponse) => {
        console.log('JoiningNotificatrion from server:', notification);
        this.roomId = notification.roomId
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


  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click()
  }

  handleFileUpload(event: Event) {
    const input = <HTMLInputElement>event.target
    if (input.files && input.files.length > 0) {
      console.log('File(s) selected:', input, input.files[0]);
      const formData = new FormData()
      const file = input.files[0]
      formData.append('img', file)

      this.chatService.getImgUrlFromCloudinary(formData).subscribe({
        next: (res: HttpResponse<IResponse>) => {
          console.log(res.body?.data);
          this.chatForm.get('chats.message')?.setValue(res.body?.data.imgUrl)
          this.chatForm.get('chats.type')?.setValue(res.body?.data.type)
          this.chatService.sendMessage(this.chatForm.value)
          console.log(this.chatForm.value);
          this.chatForm.get('chats.message')?.setValue('')

        },
        error: (err: HttpErrorResponse) => {
          console.log(err, err.error.message);
        }
      })
    }
  }


  startRecording() {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('Your browser does not support audio recording.');
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream)
      this.recording = true
      this.recordedChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        this.recording = false
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/ogg' })
        console.log('audioBlob: ', audioBlob);
        const formData = new FormData()
        formData.append('audio', audioBlob)
        // get cloudinary link from server and send mesage to socket 
        this.chatService.getAudioUrlFromCloudinary(formData).subscribe({
          next: (res: HttpResponse<IResponse>) => {
            console.log(res.body?.data);
            this.chatForm.get('chats.message')?.setValue(res.body?.data.imgUrl)
            this.chatForm.get('chats.type')?.setValue(res.body?.data.type)
            this.chatService.sendMessage(this.chatForm.value)
            console.log(this.chatForm.value);
            this.chatForm.get('chats.message')?.setValue('')

          },
          error: (err: HttpErrorResponse) => {
            console.log(err, err.error.message);
          }
        })
      }

      this.mediaRecorder.start()

    })
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop()
    }
  }

  addEmoji(event: any) {

    console.log('emoji click event: ', event, event.detail.unicode);
    const control = this.chatForm.get('chats.message')
    const userMessage = control?.value || ''
    control?.setValue(`${userMessage}${event.detail.unicode}`)
    console.log(control?.value);

  }

}
