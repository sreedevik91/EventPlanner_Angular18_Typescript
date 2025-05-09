
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Chat, ChatSearchFilter, IChat } from '../../model/class/chatClass';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { ChatService } from '../../services/chatService/chat.service';
import { UserSrerviceService } from '../../services/userService/user-srervice.service';
import { HttpStatusCodes, IChatJoiningResponse, IResponse } from '../../model/interface/interface';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alertService/alert.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';


@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe,AlertComponent],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserChatComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>

  destroy$: Subject<void> = new Subject<void>()

  chatService = inject(ChatService)
  alertService = inject(AlertService);

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
  oldChats: boolean = false
  isLeftChat: boolean = false

  showEmojiPicker: boolean = false

  recording: boolean = false
  mediaRecorder!: MediaRecorder;
  recordedChunks: any[] = []


  ngOnInit(): void {

    this.initialiseChatForm()

    this.userService.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
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
      }
    })

    this.startChat()
    this.getMessage()
    this.getAllChats()
    this.getJoiningNotification()
    this.getLeavingNotification
    this.getTypingNotification()

  }


  initialiseChatForm() {
    this.chatForm = new FormGroup({
      userId: new FormControl(this.chatFormObj.userId, [Validators.required]),
      roomId: new FormControl(this.chatFormObj.roomId, [Validators.required]),
      chats: new FormGroup({
        sender: new FormControl(this.chatFormObj.chats.sender, [Validators.required]),
        receiver: new FormControl(this.chatFormObj.chats.receiver, [Validators.required]),
        message: new FormControl(this.chatFormObj.chats.message, [Validators.required]),
        type: new FormControl(this.chatFormObj.chats.type, [Validators.required]),
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

  getAllChats() {
    this.chatService.getChatsByUser(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res.status === HttpStatusCodes.SUCCESS) {
          console.log('user chats from db:', res.body.data);
          const chatData = res.body.data
          this.messages = []
          for (let chat of chatData.chats) {
            this.messages.push(chat)
          }
          console.log('user messages array:', this.messages);
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }

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

  startChat() {
    this.oldChats = false
    this.isLeftChat = false
    this.chatService.startChat(this.userName, this.userId)
  }

  sendMessage() {
    this.chatForm.get('chats.type')?.setValue('text')
    this.chatForm.get('chats.date')?.setValue(new Date())
    console.log(this.chatForm.value);
    this.chatService.sendMessage(this.chatForm.value)
    this.chatForm.get('chats.message')?.setValue('')
    this.typing = ''
  }

  startedTyping() {
    this.chatService.typing(this.userName, this.userId)
  }

  leaveChat() {
    this.isLeftChat = true
    this.chatService.leaveRoom(this.userName, this.userId)
  }

  getMessage() {
    this.chatService.getMessage().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        console.log('sent message from server:', data);
        this.messages.push(data.chats)
        this.newChats.push(data)
        console.log('user messages array:', this.messages);
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getTypingNotification() {
    this.chatService.getTypingNotificatrion().pipe(takeUntil(this.destroy$)).subscribe({
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
    this.chatService.getJoiningNotificatrion().pipe(takeUntil(this.destroy$)).subscribe({
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
    this.chatService.getStartChatNotificatrion().pipe(takeUntil(this.destroy$)).subscribe({
      next: (notification: any) => {
        console.log('start chat notificatrion from server:', notification);
        this.roomId = notification.roomId
        console.log('user room id from start chat notificatrion: ', this.roomId);

        this.chatForm.patchValue({ roomId: this.roomId })
        this.notification.push(notification.message)
      },
      error: (error: any) => {
        console.log('error from getMessage:', error.message);
      }
    })
  }

  getLeavingNotification() {
    this.chatService.getLeavingNotificatrion().pipe(takeUntil(this.destroy$)).subscribe({
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

      this.chatService.getImgUrlFromCloudinary(formData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: HttpResponse<IResponse>) => {
          if (res.status === HttpStatusCodes.SUCCESS) {
          console.log(res.body?.data);
          this.chatForm.get('chats.message')?.setValue(res.body?.data.imgUrl)
          this.chatForm.get('chats.type')?.setValue(res.body?.data.type)
          this.chatService.sendMessage(this.chatForm.value)
          console.log(this.chatForm.value);
          this.chatForm.get('chats.message')?.setValue('')
        } else {
          console.log(res.body?.message);
          this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
        }

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
        this.chatService.getAudioUrlFromCloudinary(formData).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: HttpResponse<IResponse>) => {
            if (res.status === HttpStatusCodes.SUCCESS) {
            console.log(res.body?.data);
            this.chatForm.get('chats.message')?.setValue(res.body?.data.imgUrl)
            this.chatForm.get('chats.type')?.setValue(res.body?.data.type)
            this.chatService.sendMessage(this.chatForm.value)
            console.log(this.chatForm.value);
            this.chatForm.get('chats.message')?.setValue('')
          } else {
            console.log(res.body?.message);
            this.alertService.getAlert("alert alert-danger", "Failed", res.body?.message ? res.body?.message : '')
          }
  
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
