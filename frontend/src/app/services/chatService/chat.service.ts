import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IChat } from '../../model/class/chatClass';
import { Observable } from 'rxjs';
import { IChatJoiningResponse } from '../../model/interface/interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket = inject(Socket)

  http = inject(HttpClient)

  baseUrl: string = environment.apiChatUrl

  constructor() {
    debugger
    // Log when the socket connects successfully
    this.socket.on('connect', () => {
      console.log('Socket connected to backend');
    });

    // Log when the socket disconnects
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Log any connection error
    this.socket.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
    });
  }

  getChatsByUser(userId: string) {
    return this.http.get(`${this.baseUrl}${userId}`, { observe: 'response', withCredentials:true })
  }

  getImgUrlFromCloudinary(data: any) {
    return this.http.post(`${this.baseUrl}upload`, data, { observe: 'response', withCredentials:true })
  }

  getAudioUrlFromCloudinary(data: any) {
    return this.http.post(`${this.baseUrl}audioUpload`, data, { observe: 'response', withCredentials:true })
  }

  startChat(userName: string, userId: string) {
    this.socket.emit('startChat', { userName, userId })
  }

  activeUsers() {
    this.socket.emit('getActiveUsers')
  }

  joinRoom(userId: string) {
    this.socket.emit('joinChat', { userId })
  }

  adminSendMessage(userId: string, data: IChat) {
    console.log('chat data from admin component', data);
    this.socket.emit('adminSentMessage', { userId, data })
  }

  sendMessage(data: IChat) {
    console.log('chat data from user component', data);
    this.socket.emit('sendMessage', data)
  }

  typing(userName: string, userId: string) {
    this.socket.emit('typing', { userName, userId })
  }

  leaveRoom(userName: string, userId: string) {
    this.socket.emit('leaveChat', { userName, userId })
  }

  getMessage(): Observable<any> {
    return this.socket.fromEvent<any>('receivedMessage')
  }
  getUserMessage(): Observable<any> {
    return this.socket.fromEvent<any>('receiveUserMessage')
  }

  getStartChatNotificatrion(): Observable<any> {
    return this.socket.fromEvent<any>('startChatNotification')
  }

  getJoiningNotificatrion(): Observable<any> {
    return this.socket.fromEvent<any>('joiningNotification')
  }

  getTypingNotificatrion(): Observable<string> {
    return this.socket.fromEvent<string>('typingNotification')
  }

  getLeavingNotificatrion(): Observable<string> {
    return this.socket.fromEvent<string>('leavingNotification')
  }

  getActiveUsers(): Observable<any> {
    return this.socket.fromEvent<any>('updatedActiveUsers')
  }

}


