import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAlert } from '../../model/interface/interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject: BehaviorSubject<IAlert> = new BehaviorSubject<IAlert>({ alertOn: false, alertClass: '', alertText: '', alertMessage: '' })

  alert$ = this.alertSubject.asObservable()

  constructor() { }

  getAlert(className: string, text: string, message: string) {
    this.alertSubject.next({ alertOn: true, alertClass: className, alertText: text, alertMessage: message })
    setTimeout(() => {
      this.alertSubject.next({ alertOn: false, alertClass: '', alertText: '', alertMessage: '' })
    }, 2000)
  }
}
